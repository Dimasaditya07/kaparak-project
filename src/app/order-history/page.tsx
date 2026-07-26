/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package as PackageIcon,
  ClipboardList,
  CalendarDays,
  MessageSquare,
} from "lucide-react";
// NOTE: sesuaikan path & nama fungsi ini dengan query reservasi Anda yang sebenarnya.
// Diasumsikan mengembalikan { data: Reservation[] } dengan reservationItems
// (product/package) sudah di-eager-load dari backend.
import { getReservations } from "@/lib/query/reservations";
import {
  Reservation,
  ReservationItem,
  ReservationStatus,
  PaymentStatus,
} from "@/lib/query/reservations.model";
import { createReview } from "@/lib/query/reviews";

type StatusFilter = "all" | ReservationStatus;

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "Semua", value: "all" },
  { label: "Menunggu", value: "pending" },
  { label: "Dikonfirmasi", value: "confirmed" },
  { label: "Sedang Disewa", value: "picked_up" },
  { label: "Selesai", value: "returned" },
  { label: "Dibatalkan", value: "cancelled" },
];

const STATUS_CONFIG: Record<
  ReservationStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  pending: {
    label: "Menunggu Konfirmasi",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.3)",
  },
  confirmed: {
    label: "Dikonfirmasi",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.12)",
    border: "rgba(74,222,128,0.3)",
  },
  picked_up: {
    label: "Sedang Disewa",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.3)",
  },
  returned: {
    label: "Selesai",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.3)",
  },
  cancelled: {
    label: "Dibatalkan",
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    border: "rgba(248,113,113,0.3)",
  },
};

const PAYMENT_CONFIG: Record<
  PaymentStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  unpaid: {
    label: "Belum Dibayar",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.1)",
    border: "rgba(251,146,60,0.25)",
  },
  paid: {
    label: "Sudah Dibayar",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.1)",
    border: "rgba(74,222,128,0.25)",
  },
  failed: {
    label: "Pembayaran Gagal",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.25)",
  },
  refunded: {
    label: "Dana Dikembalikan",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.25)",
  },
};

type ItemDisplay = {
  type: "product" | "package";
  name: string;
  imageUrl: string | null;
  subLabel: string;
};

function getItemDisplay(item: ReservationItem): ItemDisplay {
  if (item.package) {
    return {
      type: "package",
      name: item.package.name,
      imageUrl: item.package.image_url ?? null,
      subLabel: `Paket · ${item.package.packageItems?.length ?? 0} Barang`,
    };
  }

  if (item.product) {
    return {
      type: "product",
      name: item.product.name,
      imageUrl: item.product.image_url ?? null,
      subLabel: item.product.category?.name || "Outdoor Equipment",
    };
  }

  return {
    type: "product",
    name: "Item tidak dikenal",
    imageUrl: null,
    subLabel: "—",
  };
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function OrdersPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // State untuk form ulasan
  const [openReviewId, setOpenReviewId] = useState<number | null>(null);
  const [reviewDrafts, setReviewDrafts] = useState<Record<number, string>>({});
  const [submittingReviewId, setSubmittingReviewId] = useState<number | null>(
    null,
  );
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await getReservations();
        setReservations(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleSubmitReview = async (reservationId: number) => {
    const text = (reviewDrafts[reservationId] ?? "").trim();

    if (!text) {
      setReviewError("Ulasan tidak boleh kosong.");
      return;
    }

    setReviewError(null);
    setSubmittingReviewId(reservationId);

    try {
      const res = await createReview({
        reservation_id: reservationId,
        review: text,
      });

      // Update state lokal supaya langsung tampil tanpa perlu refetch semuanya
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId ? { ...r, review: res.data } : r,
        ),
      );
      setOpenReviewId(null);
    } catch (error: any) {
      setReviewError(
        error?.response?.data?.message ?? "Gagal mengirim ulasan.",
      );
    } finally {
      setSubmittingReviewId(null);
    }
  };

  const filtered = useMemo(() => {
    if (statusFilter === "all") return reservations;
    return reservations.filter((r) => r.status === statusFilter);
  }, [reservations, statusFilter]);

  return (
    <main
      className="min-h-screen pt-28 pb-24"
      style={{ background: "#0a0a0a", color: "#fff" }}
    >
      {/* AMBIENT BG */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 15% 0%, rgba(74,222,128,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 85% 100%, rgba(74,222,128,0.04) 0%, transparent 60%)",
        }}
      />

      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-1.5 h-7 rounded-full"
              style={{
                background: "linear-gradient(180deg, #4ade80 0%, #16a34a 100%)",
              }}
            />
            <p
              className="text-[10px] font-bold uppercase tracking-[0.4em]"
              style={{ color: "#4ade80" }}
            >
              Order History
            </p>
          </div>

          <h1
            className="font-black uppercase italic leading-[0.85] mb-3"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Riwayat
            <br />
            <span
              style={{
                WebkitTextStroke: "2px rgba(255,255,255,0.2)",
                color: "transparent",
              }}
            >
              Pesanan
            </span>
          </h1>

          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            Semua reservasi alat dan paket rental Anda di KAPARAK Outdoor
          </p>
        </motion.div>

        {/* STATUS FILTER TABS */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center gap-2 mb-8 overflow-x-auto pb-1"
        >
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200"
              style={{
                background:
                  statusFilter === tab.value
                    ? "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)"
                    : "rgba(255,255,255,0.05)",
                border: `1px solid ${statusFilter === tab.value ? "transparent" : "rgba(255,255,255,0.08)"}`,
                color:
                  statusFilter === tab.value
                    ? "#0a0a0a"
                    : "rgba(255,255,255,0.55)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* LOADING */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: "rgba(255,255,255,0.04)", height: 180 }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <ClipboardList
                size={34}
                style={{ color: "rgba(255,255,255,0.25)" }}
              />
            </div>
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {statusFilter === "all"
                ? "Belum Ada Pesanan"
                : "Tidak Ada Pesanan di Status Ini"}
            </p>
            <p
              className="text-sm mb-8"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Mulai sewa alat atau paket outdoor favorit Anda sekarang
            </p>
            <button
              onClick={() => router.push("/product")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-[0.2em] transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "#0a0a0a",
              }}
            >
              Jelajahi Produk
            </button>
          </motion.div>
        ) : (
          /* RESERVATION LIST */
          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((reservation, index) => {
                const statusInfo = STATUS_CONFIG[reservation.status];
                const paymentInfo = PAYMENT_CONFIG[reservation.payment_status];
                const items = reservation.reservationItems ?? [];

                return (
                  <motion.div
                    key={reservation.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {/* TOP BAR */}
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{
                            background: "rgba(74,222,128,0.1)",
                            border: "1px solid rgba(74,222,128,0.2)",
                          }}
                        >
                          <ClipboardList
                            size={16}
                            style={{ color: "#4ade80" }}
                          />
                        </div>
                        <div>
                          <p
                            className="text-sm font-bold"
                            style={{ color: "#fff" }}
                          >
                            {reservation.code}
                          </p>
                          <p
                            className="text-[11px]"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            {formatDate(reservation.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            background: statusInfo.bg,
                            border: `1px solid ${statusInfo.border}`,
                            color: statusInfo.color,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            background: paymentInfo.bg,
                            border: `1px solid ${paymentInfo.border}`,
                            color: paymentInfo.color,
                          }}
                        >
                          {paymentInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* ITEMS */}
                    <div className="px-6 py-5 space-y-3">
                      {items.length === 0 ? (
                        <p
                          className="text-xs"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          Tidak ada rincian item.
                        </p>
                      ) : (
                        items.map((item) => {
                          const display = getItemDisplay(item);
                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-3"
                            >
                              <div
                                className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.07)",
                                }}
                              >
                                {display.imageUrl ? (
                                  <img
                                    src={display.imageUrl}
                                    alt={display.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <PackageIcon
                                    size={18}
                                    style={{ color: "rgba(255,255,255,0.25)" }}
                                  />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-[10px] font-semibold uppercase tracking-wider"
                                  style={{ color: "#4ade80" }}
                                >
                                  {display.subLabel}
                                </p>
                                <p
                                  className="text-sm font-semibold truncate"
                                  style={{ color: "rgba(255,255,255,0.85)" }}
                                >
                                  {display.name}
                                </p>
                                <p
                                  className="text-[11px]"
                                  style={{ color: "rgba(255,255,255,0.35)" }}
                                >
                                  {item.quantity}
                                  {display.type === "package"
                                    ? " paket"
                                    : " unit"}
                                </p>
                              </div>

                              <div
                                className="text-sm font-semibold flex-shrink-0"
                                style={{ color: "rgba(255,255,255,0.6)" }}
                              >
                                Rp{" "}
                                {Number(item.subtotal).toLocaleString("id-ID")}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* BOTTOM BAR */}
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        <CalendarDays
                          size={13}
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                          {formatDate(reservation.pickup_date)} —{" "}
                          {formatDate(reservation.return_date)}
                        </span>
                      </div>

                      <div className="text-right">
                        <p
                          className="text-[10px] uppercase tracking-[0.15em] mb-0.5"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          Total
                        </p>
                        <p
                          className="text-xl font-black"
                          style={{ color: "#4ade80" }}
                        >
                          Rp {Number(reservation.total).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {/* REVIEW SECTION — hanya untuk reservasi yang sudah selesai */}
                    {reservation.status === "returned" && (
                      <div
                        className="px-6 py-5"
                        style={{
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                          background: "rgba(255,255,255,0.015)",
                        }}
                      >
                        {reservation.review ? (
                          /* SUDAH ADA ULASAN */
                          <div className="flex items-start gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                background: "rgba(74,222,128,0.1)",
                                border: "1px solid rgba(74,222,128,0.2)",
                              }}
                            >
                              <MessageSquare
                                size={14}
                                style={{ color: "#4ade80" }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-[10px] font-bold uppercase tracking-wider mb-1"
                                style={{ color: "#4ade80" }}
                              >
                                Ulasan Anda
                              </p>
                              <p
                                className="text-sm leading-relaxed"
                                style={{ color: "rgba(255,255,255,0.65)" }}
                              >
                                {reservation.review.review}
                              </p>
                            </div>
                          </div>
                        ) : openReviewId === reservation.id ? (
                          /* FORM ULASAN TERBUKA */
                          <div>
                            <p
                              className="text-[10px] font-bold uppercase tracking-wider mb-2.5"
                              style={{ color: "rgba(255,255,255,0.4)" }}
                            >
                              Tulis Ulasan
                            </p>
                            <textarea
                              value={reviewDrafts[reservation.id] ?? ""}
                              onChange={(e) =>
                                setReviewDrafts((prev) => ({
                                  ...prev,
                                  [reservation.id]: e.target.value,
                                }))
                              }
                              placeholder="Bagaimana pengalaman sewa Anda? Ceritakan di sini..."
                              rows={3}
                              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all duration-200"
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#fff",
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor =
                                  "rgba(74,222,128,0.5)";
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor =
                                  "rgba(255,255,255,0.1)";
                              }}
                            />
                            {reviewError && (
                              <p
                                className="text-xs mt-2"
                                style={{ color: "#f87171" }}
                              >
                                {reviewError}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() =>
                                  handleSubmitReview(reservation.id)
                                }
                                disabled={submittingReviewId === reservation.id}
                                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-50"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                                  color: "#0a0a0a",
                                }}
                              >
                                {submittingReviewId === reservation.id
                                  ? "Mengirim..."
                                  : "Kirim Ulasan"}
                              </button>
                              <button
                                onClick={() => {
                                  setOpenReviewId(null);
                                  setReviewError(null);
                                }}
                                className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                                style={{
                                  background: "transparent",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  color: "rgba(255,255,255,0.4)",
                                }}
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* TOMBOL BUKA FORM */
                          <button
                            onClick={() => {
                              setOpenReviewId(reservation.id);
                              setReviewError(null);
                            }}
                            className="flex items-center gap-2 text-xs font-semibold transition-colors duration-200"
                            style={{ color: "#4ade80" }}
                          >
                            <MessageSquare size={14} />
                            Tulis Ulasan untuk Pesanan Ini
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
