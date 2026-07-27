/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package as PackageIcon,
  User as UserIcon,
  CalendarDays,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

import {
  getReservationDetail,
  confirmReturn,
  pickupReservation,
} from "@/lib/query/reservations";
import { Reservation, ReservationItem } from "@/lib/query/reservations.model";

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

export default function ReservationDetailAdminPage() {
  const router = useRouter();
  const params = useParams();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = async () => {
    try {
      const data = await getReservationDetail(Number(params.id));
      setReservation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleConfirmReturn = async () => {
    if (!reservation) return;

    setError(null);
    setConfirming(true);

    try {
      const updated = await confirmReturn(reservation.id);
      setReservation(updated);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Gagal mengonfirmasi pengembalian.",
      );
    } finally {
      setConfirming(false);
    }
  };

  const handlePickup = async () => {
    if (!reservation) return;

    setConfirming(true);
    setError(null);

    try {
      const updated = await pickupReservation(reservation.id);
      setReservation(updated);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Gagal mengubah status.");
    } finally {
      setConfirming(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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
            className="px-4 py-2 rounded-lg border hover:bg-slate-100 text-sm"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  const items = reservation.reservationItems ?? [];

  return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* BACK */}
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
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${STATUS_UI[reservation.status] ?? STATUS_UI.pending}`}
            >
              {reservation.status}
            </span>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${PAYMENT_UI[reservation.payment_status] ?? PAYMENT_UI.unpaid}`}
            >
              {reservation.payment_status}
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT: ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {/* CUSTOMER + DATES */}
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
                  <p className="text-xs text-slate-400 mb-0.5">Periode Sewa</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDate(reservation.pickup_date)}
                  </p>
                  <p className="text-xs text-slate-400">
                    s/d {formatDate(reservation.return_date)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ITEMS LIST */}
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

                    return (
                      <div key={item.id} className="px-6 py-4">
                        {/* Header Item */}
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
                              {display.code} · {item.quantity}
                              {display.type === "package" ? " paket" : " unit"}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-slate-400">Subtotal</p>

                            <p className="text-sm font-semibold text-slate-800">
                              Rp {Number(item.subtotal).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>

                        {/* ====================== */}
                        {/* DETAIL ISI PAKET */}
                        {/* ====================== */}

                        {item.package &&
                          item.package.packageItems &&
                          item.package.packageItems.length > 0 && (
                            <div className="mt-4 ml-18 rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border flex items-center justify-center">
                                        {packageItem.product?.image_url ? (
                                          <img
                                            src={packageItem.product.image_url}
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
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: SUMMARY + ACTION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
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

              {error && <p className="mt-5 text-sm text-red-500">{error}</p>}

              {/* =========================
        STATUS : CONFIRMED
    ========================== */}

              {reservation.status === "confirmed" && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-3">
                    Klik tombol berikut ketika customer sudah mengambil barang.
                  </p>

                  <button
                    onClick={handlePickup}
                    disabled={confirming}
                    className="w-full h-11 rounded-xl bg-gray-900 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
                  >
                    {confirming ? "Memproses..." : "Tandai Barang Diambil"}
                  </button>
                </div>
              )}

              {/* =========================
        STATUS : PICKED UP
    ========================== */}

              {reservation.status === "picked_up" && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-3">
                    Konfirmasi jika seluruh barang telah dikembalikan oleh
                    customer.
                  </p>

                  <button
                    onClick={handleConfirmReturn}
                    disabled={confirming}
                    className="w-full h-11 rounded-xl bg-gray-900 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
                  >
                    {confirming ? "Memproses..." : "Konfirmasi Pengembalian"}
                  </button>
                </div>
              )}

              {/* =========================
        STATUS : RETURNED
    ========================== */}

              {reservation.status === "returned" && (
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 size={18} />
                  Barang sudah dikembalikan
                </div>
              )}

              {/* =========================
        STATUS : CANCELLED
    ========================== */}

              {reservation.status === "cancelled" && (
                <div className="mt-6 pt-6 border-t border-slate-100 text-red-500 font-medium">
                  Reservasi telah dibatalkan.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
