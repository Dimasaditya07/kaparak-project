"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Clock, CheckCircle, XCircle, Search } from "lucide-react";

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // RESET PAGE ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const getStatusUI = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return {
          class: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle size={14} />,
        };
      case "pending":
        return {
          class: "bg-yellow-50 text-yellow-700 border-yellow-200",
          icon: <Clock size={14} />,
        };
      case "failed":
        return {
          class: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle size={14} />,
        };
    }
  };

  // FILTER DATA
  const filteredPayments =
    filterStatus === "all"
      ? payments
      : payments.filter((p) => p.status === filterStatus);

  // PAGINATION
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // STATS
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
            Payments Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor semua transaksi dan status pembayaran
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-xl font-semibold text-slate-900">
                  {formatRupiah(totalRevenue)}
                </p>
              </div>
              <CreditCard className="text-slate-400" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-2xl border border-slate-200"
          >
            <div>
              <p className="text-sm text-slate-500">Paid</p>
              <p className="text-xl font-semibold text-emerald-600">
                {totalPaid}
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-2xl border border-slate-200"
          >
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-xl font-semibold text-yellow-600">
                {totalPending}
              </p>
            </div>
          </motion.div>
        </div>

        {/* FILTER */}
        <div className="flex items-center justify-between mb-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payments..."
              className="h-11 w-65 rounded-xl border border-slate-200 pl-11 pr-4 outline-none focus:ring-2 focus:ring-black bg-white"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-0 focus:ring-gray-200"
          >
            <option value="all">Semua Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b">
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Reservation</th>
                  <th className="py-4 px-6">Method</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Paid At</th>
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
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center text-slate-400"
                    >
                      No payments found
                    </td>
                  </tr>
                ) : (
                  paginatedPayments.map((p, i) => {
                    const statusUI = getStatusUI(p.status);

                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="py-4 px-6 font-mono text-xs text-slate-600">
                          {p.order_id ?? "-"}
                        </td>

                        <td className="py-4 px-6 text-slate-700">
                          #{p.reservation_id}
                        </td>

                        <td className="py-4 px-6 text-slate-700">
                          {p.payment_method}
                        </td>

                        <td className="py-4 px-6 font-medium text-slate-900">
                          {formatRupiah(p.amount)}
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${statusUI.class}`}
                          >
                            {statusUI.icon}
                            {p.status}
                          </span>
                        </td>

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
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="hover:bg-black hover:text-white px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  className="hover:bg-black hover:text-white px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
