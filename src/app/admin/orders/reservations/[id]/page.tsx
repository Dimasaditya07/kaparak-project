/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package as PackageIcon,
  User as UserIcon,
  CalendarDays,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import {
  getReservationDetail,
  confirmReturn,
  pickupReservation,
} from "@/lib/query/reservations";

import {
  Reservation,
  ReservationItem,
  ConfirmReturnItemPayload,
} from "@/lib/query/reservations.model";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ItemDisplay = {
  type: "product" | "package";
  name: string;
  code: string;
  imageUrl: string | null;
  subLabel: string;
};

function getItemDisplay(item: ReservationItem): ItemDisplay {
  if (item.package) {
    return {
      type: "package",
      name: item.package.name,
      code: item.package.code,
      imageUrl: item.package.image_url ?? null,
      subLabel: `Paket · ${item.package.packageItems?.length ?? 0} Barang`,
    };
  }

  if (item.product) {
    return {
      type: "product",
      name: item.product.name,
      code: item.product.code,
      imageUrl: item.product.image_url ?? null,
      subLabel: item.product.category?.name || "Outdoor Equipment",
    };
  }

  return {
    type: "product",
    name: "Item tidak dikenal",
    code: "-",
    imageUrl: null,
    subLabel: "—",
  };
}

const STATUS_UI: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  picked_up: "bg-blue-50 text-blue-700 border-blue-200",
  returned: "bg-purple-50 text-purple-700 border-purple-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const PAYMENT_UI: Record<string, string> = {
  unpaid: "bg-yellow-50 text-yellow-700 border-yellow-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-blue-50 text-blue-700 border-blue-200",
};

type ConditionDraft = {
  good: number;
  damaged: number;
  lost: number;
  note: string;
};

export default function ReservationDetailAdminPage() {
  const router = useRouter();
  const params = useParams();

  const reservationId = useMemo(() => Number(params?.id), [params?.id]);

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  // API PROCESS
  const [confirming, setConfirming] = useState(false);

  // RETURN FORM
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [drafts, setDrafts] = useState<Record<number, ConditionDraft>>({});

  // VALIDATION ERROR
  const [error, setError] = useState<string | null>(null);

  // ALERT DIALOG
  const [dialog, setDialog] = useState<"pickup" | "return" | null>(null);

  useEffect(() => {
    if (!reservationId || isNaN(reservationId)) return;

    let isSubscribed = true;

    const fetchDetail = async () => {
      try {
        setLoading(true);

        const data = await getReservationDetail(reservationId);

        if (isSubscribed) {
          setReservation(data);
        }
      } catch (err) {
        console.error("Gagal mengambil detail reservasi:", err);

        toast.error("Gagal memuat reservasi", {
          description: "Terjadi kesalahan saat mengambil detail reservasi.",
        });
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      isSubscribed = false;
    };
  }, [reservationId]);

  // =========================================================
  // OPEN RETURN FORM
  // =========================================================

  const openReturnForm = () => {
    if (!reservation) return;

    const initial: Record<number, ConditionDraft> = {};

    (reservation.reservationItems ?? []).forEach((item) => {
      initial[item.id] = {
        good: item.quantity,
        damaged: 0,
        lost: 0,
        note: "",
      };
    });

    setDrafts(initial);
    setShowReturnForm(true);
    setError(null);
  };

  // =========================================================
  // UPDATE RETURN CONDITION
  // =========================================================

  const updateDraft = (
    itemId: number,
    field: keyof ConditionDraft,
    value: number | string,
    maxQty: number,
  ) => {
    setDrafts((prev) => {
      const current = prev[itemId] || {
        good: maxQty,
        damaged: 0,
        lost: 0,
        note: "",
      };

      if (field === "note") {
        return {
          ...prev,
          [itemId]: {
            ...current,
            note: value as string,
          },
        };
      }

      const numVal = Math.min(maxQty, Math.max(0, Number(value) || 0));

      if (field === "damaged") {
        const remainingForGood = Math.max(0, maxQty - numVal - current.lost);

        return {
          ...prev,
          [itemId]: {
            ...current,
            damaged: numVal,
            good: remainingForGood,
          },
        };
      }

      if (field === "lost") {
        const remainingForGood = Math.max(0, maxQty - current.damaged - numVal);

        return {
          ...prev,
          [itemId]: {
            ...current,
            lost: numVal,
            good: remainingForGood,
          },
        };
      }

      if (field === "good") {
        return {
          ...prev,
          [itemId]: {
            ...current,
            good: numVal,
          },
        };
      }

      return prev;
    });
  };

  // =========================================================
  // VALIDATE RETURN
  // =========================================================

  const validateReturn = () => {
    if (!reservation) return false;

    for (const item of reservation.reservationItems ?? []) {
      const d = drafts[item.id];

      const sum = (d?.good ?? 0) + (d?.damaged ?? 0) + (d?.lost ?? 0);

      if (sum !== item.quantity) {
        setError(
          `Total barang (${getItemDisplay(item).name}): Baik + Rusak + Hilang harus berjumlah ${item.quantity}. Saat ini: ${sum}.`,
        );

        return false;
      }
    }

    setError(null);

    return true;
  };

  // =========================================================
  // CLICK CONFIRM RETURN
  // =========================================================

  const handleClickConfirmReturn = () => {
    if (!reservation) return;

    const isValid = validateReturn();

    if (!isValid) return;

    setDialog("return");
  };

  // =========================================================
  // EXECUTE CONFIRM RETURN
  // =========================================================

  const handleConfirmReturn = async () => {
    if (!reservation) return;

    setDialog(null);
    setConfirming(true);
    setError(null);

    try {
      const payload: ConfirmReturnItemPayload[] = (
        reservation.reservationItems ?? []
      ).map((item) => ({
        reservation_item_id: item.id,
        good: drafts[item.id]?.good ?? 0,
        damaged: drafts[item.id]?.damaged ?? 0,
        lost: drafts[item.id]?.lost ?? 0,
        note: drafts[item.id]?.note || undefined,
      }));

      const updated = await confirmReturn(reservation.id, payload);

      setReservation(updated);
      setShowReturnForm(false);
      setDrafts({});

      toast.success("Pengembalian berhasil dikonfirmasi", {
        description: "Status reservasi telah diperbarui menjadi dikembalikan.",
      });
    } catch (err) {
      console.error("Gagal mengonfirmasi pengembalian:", err);

      if (err instanceof AxiosError) {
        toast.error("Gagal mengonfirmasi pengembalian", {
          description:
            err.response?.data?.message ??
            "Terjadi kesalahan saat memproses pengembalian.",
        });
      } else {
        toast.error("Gagal mengonfirmasi pengembalian", {
          description: "Terjadi kesalahan sistem saat memproses.",
        });
      }
    } finally {
      setConfirming(false);
    }
  };

  // =========================================================
  // CLICK PICKUP
  // =========================================================

  const handleClickPickup = () => {
    if (!reservation) return;

    setDialog("pickup");
  };

  // =========================================================
  // EXECUTE PICKUP
  // =========================================================

  const handlePickup = async () => {
    if (!reservation) return;

    setDialog(null);
    setConfirming(true);
    setError(null);

    try {
      const updated = await pickupReservation(reservation.id);

      setReservation(updated);

      toast.success("Barang berhasil ditandai diambil", {
        description:
          "Status reservasi telah diperbarui menjadi barang diambil.",
      });
    } catch (err) {
      console.error("Gagal mengubah status pengambilan:", err);

      if (err instanceof AxiosError) {
        toast.error("Gagal menandai barang diambil", {
          description:
            err.response?.data?.message ??
            "Terjadi kesalahan saat mengubah status.",
        });
      } else {
        toast.error("Gagal menandai barang diambil", {
          description: "Terjadi kesalahan sistem.",
        });
      }
    } finally {
      setConfirming(false);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // =========================================================
  // OVERDUE
  // =========================================================

  const overdueInfo = useMemo(() => {
    if (!reservation) return null;

    const planned = new Date(reservation.return_date);

    const reference = reservation.returned_at
      ? new Date(reservation.returned_at)
      : new Date();

    const diffDays = Math.floor(
      (reference.getTime() - planned.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays <= 0) return null;

    return {
      days: diffDays,
      isFinal: !!reservation.returned_at,
    };
  }, [reservation]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 lg:p-12">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="h-8 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!reservation) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center bg-white border border-slate-200 rounded-2xl p-10 max-w-sm">
          <p className="font-semibold text-slate-800 mb-1">
            Reservasi Tidak Ditemukan
          </p>

          <p className="text-sm text-slate-500 mb-5">
            Pastikan ID reservasi sudah benar.
          </p>

          <button
            onClick={() => router.push("/admin/orders/reservations")}
            className="px-4 py-2 rounded-lg border hover:bg-slate-100 text-sm transition-colors"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  const items = reservation.reservationItems ?? [];

  return (
    <>
      <div className="min-h-screen bg-slate-50 p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          {/* BACK BUTTON */}
          <button
            onClick={() => router.push("/admin/orders/reservations")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Reservasi
          </button>

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4"
          >
            <div>
              <p className="font-mono text-xs text-slate-400 mb-1">
                {reservation.code}
              </p>

              <h1 className="text-2xl font-semibold text-slate-900">
                Detail Reservasi
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  STATUS_UI[reservation.status] ?? STATUS_UI.pending
                }`}
              >
                {reservation.status}
              </span>

              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  PAYMENT_UI[reservation.payment_status] ?? PAYMENT_UI.unpaid
                }`}
              >
                {reservation.payment_status}
              </span>
            </div>
          </motion.div>

          {/* OVERDUE */}
          {overdueInfo && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-red-500/5 border border-red-500/20"
            >
              <AlertTriangle size={18} className="text-red-500 shrink-0" />

              <p className="text-sm text-red-600">
                {overdueInfo.isFinal ? (
                  <>
                    Selesai{" "}
                    <span className="font-semibold">
                      {overdueInfo.days} hari
                    </span>{" "}
                    lebih lambat dari jadwal (
                    {formatDate(reservation.return_date)}
                    ).
                  </>
                ) : (
                  <>
                    Sudah melewati tanggal pengembalian (
                    {formatDate(reservation.return_date)}) selama{" "}
                    <span className="font-semibold">
                      {overdueInfo.days} hari
                    </span>
                    . Barang belum dikonfirmasi kembali.
                  </>
                )}
              </p>
            </motion.div>
          )}

          {!overdueInfo && <div className="mb-8" />}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* ================================================= */}
            {/* LEFT */}
            {/* ================================================= */}

            <div className="lg:col-span-2 space-y-6">
              {/* CUSTOMER & DATE */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 grid sm:grid-cols-2 gap-6"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <UserIcon size={16} className="text-slate-500" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Customer</p>

                    <p className="text-sm font-semibold text-slate-800">
                      {reservation.user?.name ?? "-"}
                    </p>

                    <p className="text-xs text-slate-400">
                      {reservation.user?.email ?? ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={16} className="text-slate-500" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">
                      Periode Sewa
                    </p>

                    <p className="text-sm font-semibold text-slate-800">
                      {formatDate(reservation.pickup_date)}
                    </p>

                    <p className="text-xs text-slate-400">
                      s/d {formatDate(reservation.return_date)}
                      {reservation.returned_at && (
                        <>
                          {" "}
                          · Dikembalikan {formatDate(reservation.returned_at)}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ITEMS */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-800 text-sm">
                    Barang yang Disewa ({items.length})
                  </h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.length === 0 ? (
                    <p className="px-6 py-8 text-sm text-slate-400 text-center">
                      Tidak ada rincian item.
                    </p>
                  ) : (
                    items.map((item) => {
                      const display = getItemDisplay(item);

                      const hasConditionRecorded = item.condition_good !== null;

                      return (
                        <div key={item.id} className="px-6 py-4">
                          {/* ITEM HEADER */}
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                              {display.imageUrl ? (
                                <img
                                  src={display.imageUrl}
                                  alt={display.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <PackageIcon
                                  size={20}
                                  className="text-slate-300"
                                />
                              )}
                            </div>

                            <div className="flex-1">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">
                                {display.subLabel}
                              </p>

                              <p className="text-sm font-semibold text-slate-800">
                                {display.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                {display.code} · {item.quantity}{" "}
                                {display.type === "package" ? "paket" : "unit"}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-slate-400">Subtotal</p>

                              <p className="text-sm font-semibold text-slate-800">
                                Rp{" "}
                                {Number(item.subtotal).toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>

                          {/* PACKAGE CONTENT */}
                          {item.package?.packageItems &&
                            item.package.packageItems.length > 0 && (
                              <div className="mt-4 sm:ml-18 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold text-slate-700 mb-3">
                                  Barang termasuk dalam paket:
                                </p>

                                <div className="space-y-3">
                                  {item.package.packageItems.map(
                                    (packageItem) => (
                                      <div
                                        key={packageItem.id}
                                        className="flex items-center gap-3"
                                      >
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border flex items-center justify-center flex-shrink-0">
                                          {packageItem.product?.image_url ? (
                                            <img
                                              src={
                                                packageItem.product.image_url
                                              }
                                              alt={packageItem.product.name}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <PackageIcon
                                              size={16}
                                              className="text-slate-400"
                                            />
                                          )}
                                        </div>

                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-slate-800">
                                            {packageItem.product?.name}
                                          </p>

                                          <p className="text-xs text-slate-500">
                                            {packageItem.product?.code} •{" "}
                                            {packageItem.quantity} unit
                                          </p>
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                          {/* CONDITION RECORDED */}
                          {hasConditionRecorded && (
                            <div className="mt-4 sm:ml-18 flex flex-wrap gap-2">
                              {item.condition_good! > 0 && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {item.condition_good} Baik
                                </span>
                              )}

                              {item.condition_damaged! > 0 && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">
                                  {item.condition_damaged} Rusak
                                </span>
                              )}

                              {item.condition_lost! > 0 && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                                  {item.condition_lost} Hilang
                                </span>
                              )}

                              {item.condition_note && (
                                <span className="w-full text-xs text-slate-500 mt-1">
                                  Catatan: {item.condition_note}
                                </span>
                              )}
                            </div>
                          )}

                          {/* RETURN FORM */}
                          {showReturnForm && (
                            <div className="mt-4 sm:ml-18 rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                              <p className="text-xs font-semibold text-slate-700 mb-3">
                                Kondisi pengembalian (total unit:{" "}
                                {item.quantity})
                              </p>

                              <div className="grid grid-cols-3 gap-3 mb-3">
                                {(
                                  [
                                    {
                                      key: "good",
                                      label: "Baik",
                                    },
                                    {
                                      key: "damaged",
                                      label: "Rusak",
                                    },
                                    {
                                      key: "lost",
                                      label: "Hilang",
                                    },
                                  ] as const
                                ).map((f) => (
                                  <div key={f.key}>
                                    <label className="block text-[10px] text-slate-500 mb-1 font-medium">
                                      {f.label}
                                    </label>

                                    <input
                                      type="number"
                                      min={0}
                                      max={item.quantity}
                                      value={drafts[item.id]?.[f.key] ?? 0}
                                      onChange={(e) =>
                                        updateDraft(
                                          item.id,
                                          f.key,
                                          e.target.value,
                                          item.quantity,
                                        )
                                      }
                                      className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm bg-white outline-none focus:ring-2 focus:ring-slate-900 transition"
                                    />
                                  </div>
                                ))}
                              </div>

                              <input
                                type="text"
                                placeholder="Catatan kondisi (opsional, contoh: Tali tenda putus)"
                                value={drafts[item.id]?.note ?? ""}
                                onChange={(e) =>
                                  updateDraft(
                                    item.id,
                                    "note",
                                    e.target.value,
                                    item.quantity,
                                  )
                                }
                                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs bg-white outline-none focus:ring-2 focus:ring-slate-900 transition"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>

            {/* ================================================= */}
            {/* RIGHT COLUMN */}
            {/* ================================================= */}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:sticky lg:top-8 h-fit"
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                {/* PAYMENT */}
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard size={16} className="text-slate-500" />

                  <h2 className="font-semibold text-slate-800 text-sm">
                    Ringkasan Pembayaran
                  </h2>
                </div>

                <div className="flex items-center justify-between pt-4 mt-2 border-t border-dashed border-slate-200">
                  <span className="text-sm font-semibold text-slate-500">
                    Total
                  </span>

                  <span className="text-xl font-bold text-emerald-600">
                    Rp {Number(reservation.total).toLocaleString("id-ID")}
                  </span>
                </div>

                {/* VALIDATION ERROR */}
                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 text-xs font-medium text-red-600 border border-red-100">
                    {error}
                  </div>
                )}

                {/* ================================================= */}
                {/* CONFIRMED */}
                {/* ================================================= */}

                {reservation.status === "confirmed" && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-3">
                      Klik tombol berikut ketika customer sudah mengambil
                      barang.
                    </p>

                    <button
                      onClick={handleClickPickup}
                      disabled={confirming}
                      className="w-full h-11 rounded-xl bg-slate-900 text-white font-medium hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {confirming ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        "Tandai Barang Diambil"
                      )}
                    </button>
                  </div>
                )}

                {/* ================================================= */}
                {/* PICKED UP */}
                {/* ================================================= */}

                {reservation.status === "picked_up" && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    {!showReturnForm ? (
                      <>
                        <p className="text-xs text-slate-500 mb-3">
                          Cek kondisi tiap barang sebelum konfirmasi
                          pengembalian.
                        </p>

                        <button
                          onClick={openReturnForm}
                          className="w-full h-11 rounded-xl bg-slate-900 text-white font-medium hover:bg-emerald-600 transition"
                        >
                          Konfirmasi Pengembalian
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-slate-500 mb-3">
                          Isi kondisi barang pada list di sebelah kiri, lalu
                          kirim.
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={handleClickConfirmReturn}
                            disabled={confirming}
                            className="flex-1 h-11 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {confirming ? (
                              <>
                                <Loader2 size={15} className="animate-spin" />
                                Memproses...
                              </>
                            ) : (
                              "Kirim & Selesaikan"
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setShowReturnForm(false);
                              setError(null);
                            }}
                            disabled={confirming}
                            className="px-4 h-11 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition disabled:opacity-50"
                          >
                            Batal
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ================================================= */}
                {/* RETURNED */}
                {/* ================================================= */}

                {reservation.status === "returned" && (
                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-emerald-600 font-medium text-sm">
                    <CheckCircle2 size={18} />
                    Barang sudah dikembalikan
                  </div>
                )}

                {/* ================================================= */}
                {/* CANCELLED */}
                {/* ================================================= */}

                {reservation.status === "cancelled" && (
                  <div className="mt-6 pt-6 border-t border-slate-100 text-red-500 font-medium text-sm">
                    Reservasi telah dibatalkan.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* ALERT DIALOG - PICKUP */}
      {/* ===================================================== */}

      <AlertDialog
        open={dialog === "pickup"}
        onOpenChange={(open) => {
          if (!open && !confirming) {
            setDialog(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tandai Barang Sudah Diambil?</AlertDialogTitle>

            <AlertDialogDescription>
              Pastikan customer sudah menerima seluruh barang yang disewa.
              Setelah dikonfirmasi, status reservasi akan berubah menjadi{" "}
              <span className="font-semibold">Barang Diambil</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirming}>Batal</AlertDialogCancel>

            <AlertDialogAction
              onClick={handlePickup}
              disabled={confirming}
              className="bg-slate-900 hover:bg-emerald-600"
            >
              {confirming ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Ya, Tandai Diambil"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===================================================== */}
      {/* ALERT DIALOG - RETURN */}
      {/* ===================================================== */}

      <AlertDialog
        open={dialog === "return"}
        onOpenChange={(open) => {
          if (!open && !confirming) {
            setDialog(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pengembalian?</AlertDialogTitle>

            <AlertDialogDescription>
              Pastikan kondisi seluruh barang sudah diperiksa dengan benar.
              Setelah pengembalian dikonfirmasi, status reservasi akan berubah
              menjadi <span className="font-semibold">Dikembalikan</span>
              .
              <br />
              <br />
              Data kondisi barang yang sudah dikirim tidak dapat diubah melalui
              proses ini.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirming}>Batal</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmReturn}
              disabled={confirming}
              className="bg-slate-900 hover:bg-emerald-600"
            >
              {confirming ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Ya, Selesaikan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
