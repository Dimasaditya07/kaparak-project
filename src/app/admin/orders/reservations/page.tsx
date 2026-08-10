/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Calendar,
  CalendarClock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { getReservations } from "@/lib/query/reservations";
import { Reservation } from "@/lib/query/reservations.model";
import { markAdminNotificationsAsReadByType } from "@/lib/query/adminNotification";

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu",
  confirmed: "Dibayar",
  picked_up: "Diambil",
  returned: "Dikembalikan",
  cancelled: "Dibatalkan",
};

export default function ReservationAdminPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // RESET PAGE
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus]);

  useEffect(() => {
    const markAsRead = async () => {
      try {
        await markAdminNotificationsAsReadByType("reservation");
      } catch (error) {
        console.error("Gagal menandai notifikasi reservasi:", error);
      }
    };

    markAsRead();
  }, []);

  // FILTER + SEARCH
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchSearch =
        r.code.toLowerCase().includes(search.toLowerCase()) ||
        r.user?.name?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        filterStatus === "all" ? true : r.status === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [reservations, search, filterStatus]);

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReservations.length / ITEMS_PER_PAGE),
  );

  const paginatedData = filteredReservations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // STATS
  const stats = useMemo(() => {
    return {
      total: reservations.length,
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      cancelled: reservations.filter((r) => r.status === "cancelled").length,
    };
  }, [reservations]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getStatusUI = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      case "picked_up":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "returned":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/60";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans antialiased text-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Reservasi
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola seluruh pemesanan dan reservasi sewa pelanggan
            </p>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Reservasi",
              value: stats.total,
              icon: Calendar,
              color: "text-slate-600",
            },
            {
              label: "Menunggu (Pending)",
              value: stats.pending,
              icon: CalendarClock,
              color: "text-amber-600",
            },
            {
              label: "Dikonfirmasi",
              value: stats.confirmed,
              icon: CheckCircle2,
              color: "text-emerald-600",
            },
            {
              label: "Dibatalkan",
              value: stats.cancelled,
              icon: XCircle,
              color: "text-rose-600",
            },
          ].map((item, i) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {item.value}
                  </p>
                </div>
                <div
                  className={`p-2.5 bg-slate-50 rounded-lg border border-slate-100 ${item.color}`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* MAIN CONTAINER */}
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden space-y-4">
          {/* FILTER BAR */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kode atau nama pemesan..."
                className="w-full h-9 pl-9 pr-4 rounded-md border border-slate-200 bg-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-44 h-9 px-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="confirmed">Dibayar</option>
                <option value="picked_up">Diambil</option>
                <option value="returned">Dikembalikan</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  <th className="py-3 px-5">Kode</th>
                  <th className="py-3 px-5">Pelanggan</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Total Biaya</th>
                  <th className="py-3 px-5">Tgl Ambil</th>
                  <th className="py-3 px-5">Tgl Kembali</th>
                  <th className="py-3 px-5 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {/* LOADING STATE */}
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-5">
                        <div className="h-3.5 w-20 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-3.5 w-28 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-5 w-16 bg-slate-100 rounded-full" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-3.5 w-24 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-3.5 w-20 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-3.5 w-20 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-7 w-7 bg-slate-100 rounded mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <img
                          src="/images/empty.png"
                          alt="Tidak ada reservasi"
                          className="w-48 object-contain opacity-80"
                        />
                        <p className="text-xs font-medium text-slate-500">
                          Tidak ada data reservasi ditemukan
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: i * 0.02 }}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-mono text-xs font-semibold text-slate-900">
                        #{r.code}
                      </td>

                      <td className="py-3.5 px-5 font-medium text-slate-900">
                        {r.user?.name ?? "-"}
                      </td>

                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${getStatusUI(
                            r.status,
                          )}`}
                        >
                          {STATUS_LABEL[r.status] ?? r.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        Rp {Number(r.total).toLocaleString("id-ID")}
                      </td>

                      <td className="py-3.5 px-5 text-slate-500">
                        {formatDate(r.pickup_date)}
                      </td>

                      <td className="py-3.5 px-5 text-slate-500">
                        {formatDate(r.return_date)}
                      </td>

                      <td className="py-3.5 px-5 text-center">
                        <button
                          onClick={() =>
                            router.push(`/admin/orders/reservations/${r.id}`)
                          }
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!loading && filteredReservations.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/30">
              <p className="text-xs text-slate-500">
                Halaman{" "}
                <span className="font-semibold text-slate-700">
                  {currentPage}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-slate-700">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="h-8 px-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors shadow-sm cursor-pointer"
                >
                  Sebelumnya
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="h-8 px-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors shadow-sm cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
