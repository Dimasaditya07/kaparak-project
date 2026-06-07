"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";

import { getReservations } from "@/lib/query/reservations";
import { Reservation } from "@/lib/query/reservations.model";

export default function ReservationAdminPage() {
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
  const totalPages = Math.ceil(filteredReservations.length / ITEMS_PER_PAGE);

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
    new Date(date).toLocaleDateString("id-ID");

  const getStatusUI = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "picked_up":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "returned":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Reservations Overview
            </h1>
            <p className="text-slate-500 text-sm">
              Manage all customer reservations
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Confirmed", value: stats.confirmed },
            { label: "Cancelled", value: stats.cancelled },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-slate-200 rounded-2xl p-5"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-xl font-semibold text-slate-900 mt-1">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reservation..."
              className="h-11 w-65 rounded-xl border border-slate-200 pl-11 pr-4 outline-none focus:ring-2 focus:ring-black bg-white"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-11 px-4 rounded-xl border border-slate-200 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="picked_up">Picked Up</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b">
                  <th className="py-4 px-6">Code</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Pickup</th>
                  <th className="py-4 px-6">Return</th>
                  <th className="py-4 px-6 text-center">Action</th>
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
                        <div className="h-4 w-20 bg-slate-200 rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-6 w-20 bg-slate-200 rounded-full" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 w-24 bg-slate-200 rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 w-20 bg-slate-200 rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 w-20 bg-slate-200 rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-8 w-8 bg-slate-200 rounded" />
                      </td>
                    </tr>
                  ))
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-slate-400"
                    >
                      No reservations found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-50"
                    >
                      <td className="py-4 px-6 font-mono text-xs text-slate-600">
                        {r.code}
                      </td>

                      <td className="py-4 px-6">{r.user?.name ?? "-"}</td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs border ${getStatusUI(
                            r.status,
                          )}`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-semibold text-emerald-600">
                        Rp {Number(r.total).toLocaleString("id-ID")}
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {formatDate(r.pickup_date)}
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {formatDate(r.return_date)}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button className="p-2 rounded-lg border hover:bg-slate-100">
                          <Eye size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!loading && (
            <div className="flex justify-between items-center px-6 py-4 border-t bg-slate-50">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="hover:bg-black hover:text-white px-4 py-2 rounded-lg border disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="hover:bg-black hover:text-white px-4 py-2 rounded-lg border disabled:opacity-50"
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
