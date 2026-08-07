/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Search } from "lucide-react";

import { Payment } from "@/lib/query/payments.model";
import { getPayments } from "@/lib/query/payments";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      const res = await getPayments();
      setPayments(res);
    } catch (error) {
      console.error("Gagal mengambil data pembayaran:", error);
    } finally {
      setLoading(false);
    }
  }

  // RESET HALAMAN KETIKA FILTER ATAU PENCARIAN BERUBAH
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, search]);

  // FORMAT RUPIAH
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // STATUS PEMBAYARAN
  const getStatusUI = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return {
          label: "Dibayar",
          class: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };

      case "pending":
        return {
          label: "Menunggu",
          class: "bg-yellow-50 text-yellow-700 border-yellow-200",
        };

      case "failed":
        return {
          label: "Gagal",
          class: "bg-red-50 text-red-700 border-red-200",
        };

      default:
        return {
          label: "Dikembalikan",
          class: "bg-slate-50 text-slate-700 border-slate-200",
        };
    }
  };

  // FILTER DATA BERDASARKAN STATUS DAN PENCARIAN
  const filteredPayments = payments.filter((p) => {
    const matchesStatus =
      filterStatus === "all" ? true : p.status === filterStatus;

    const searchLower = search.toLowerCase();

    const matchesSearch =
      !search ||
      (p.order_id && p.order_id.toLowerCase().includes(searchLower)) ||
      (p.reservation_id &&
        p.reservation_id.toString().toLowerCase().includes(searchLower)) ||
      (p.payment_method &&
        p.payment_method.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE) || 1;

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // STATISTIK
  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalPaid = payments.filter((p) => p.status === "paid").length;

  const totalPending = payments.filter((p) => p.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Ringkasan Pembayaran
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Pantau semua transaksi dan status pembayaran
          </p>
        </div>

        {/* STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* TOTAL PENDAPATAN */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Pendapatan</p>

                <p className="text-xl font-semibold text-slate-900">
                  {formatRupiah(totalRevenue)}
                </p>
              </div>

              <CreditCard className="text-slate-400" />
            </div>
          </motion.div>

          {/* TOTAL DIBAYAR */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-2xl border border-slate-200"
          >
            <div>
              <p className="text-sm text-slate-500">Pembayaran Berhasil</p>

              <p className="text-xl font-semibold text-emerald-600">
                {totalPaid}
              </p>
            </div>
          </motion.div>

          {/* TOTAL MENUNGGU */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-2xl border border-slate-200"
          >
            <div>
              <p className="text-sm text-slate-500">Pembayaran Menunggu</p>

              <p className="text-xl font-semibold text-yellow-600">
                {totalPending}
              </p>
            </div>
          </motion.div>
        </div>

        {/* FILTER DAN PENCARIAN */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-5">
          {/* PENCARIAN */}
          <div className="relative flex-1 sm:flex-none">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID pesanan, reservasi, metode..."
              className="h-11 w-full sm:w-72 rounded-xl border border-slate-200 pl-11 pr-4 outline-none focus:ring-2 focus:ring-black bg-white text-sm"
            />
          </div>

          {/* FILTER STATUS */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-0 focus:ring-gray-200"
          >
            <option value="all">Semua Status</option>
            <option value="paid">Dibayar</option>
            <option value="pending">Menunggu</option>
            <option value="failed">Gagal</option>
          </select>
        </div>

        {/* TABEL PEMBAYARAN */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b">
                  <th className="py-4 px-6">Pesanan</th>

                  <th className="py-4 px-6">Reservasi</th>

                  <th className="py-4 px-6">Metode Pembayaran</th>

                  <th className="py-4 px-6">Jumlah</th>

                  <th className="py-4 px-6">Status</th>

                  <th className="py-4 px-6">Dibayar Pada</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* LOADING */}
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="h-4 w-24 bg-slate-200 rounded" />
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-4 w-16 bg-slate-200 rounded" />
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-4 w-20 bg-slate-200 rounded" />
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-4 w-24 bg-slate-200 rounded" />
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-6 w-20 bg-slate-200 rounded-full" />
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-4 w-28 bg-slate-200 rounded" />
                      </td>
                    </tr>
                  ))
                ) : paginatedPayments.length === 0 ? (
                  /* DATA KOSONG */
                  <tr>
                    <td colSpan={6} className="py-16">
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src="/images/empty.png"
                          alt="Belum ada data"
                          className="w-72 md:w-96 object-contain"
                        />

                        <p className="text-slate-400 text-sm mt-4">
                          {search
                            ? `Tidak ada hasil untuk "${search}"`
                            : "Tidak ada transaksi ditemukan"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* DATA PEMBAYARAN */
                  paginatedPayments.map((p, i) => {
                    const statusUI = getStatusUI(p.status);

                    return (
                      <motion.tr
                        key={p.id}
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: i * 0.03,
                        }}
                        className="hover:bg-slate-50 transition"
                      >
                        {/* PESANAN */}
                        <td className="py-4 px-6 font-mono text-xs text-slate-600">
                          {p.order_id ?? "-"}
                        </td>

                        {/* RESERVASI */}
                        <td className="py-4 px-6 text-slate-700">
                          #{p.reservation_id}
                        </td>

                        {/* METODE PEMBAYARAN */}
                        <td className="py-4 px-6 text-slate-700 capitalize">
                          {p.payment_method}
                        </td>

                        {/* JUMLAH */}
                        <td className="py-4 px-6 font-medium text-slate-900">
                          {formatRupiah(p.amount)}
                        </td>

                        {/* STATUS */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${statusUI.class}`}
                          >
                            {statusUI.label}
                          </span>
                        </td>

                        {/* DIBAYAR PADA */}
                        <td className="py-4 px-6 text-slate-500 text-sm">
                          {p.paid_at
                            ? new Date(p.paid_at).toLocaleString("id-ID")
                            : "-"}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!loading && filteredPayments.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-500">
                Halaman {currentPage} dari {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="hover:bg-black hover:text-white px-4 py-2 rounded-lg border border-slate-200 text-sm transition disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit"
                >
                  Sebelumnya
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  className="hover:bg-black hover:text-white px-4 py-2 rounded-lg border border-slate-200 text-sm transition disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
