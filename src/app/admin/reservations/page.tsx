"use client";

import { motion } from "framer-motion";
import {
  CalendarRange,
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  Filter,
} from "lucide-react";

export default function ReservationAdminPage() {
  const reservations = [
    {
      id: "RSV-1001",
      customer: "Rizky Maulana",
      item: "Tenda Consina 4P",
      date: "23 - 26 Mei 2026",
      total: "Rp255.000",
      status: "Confirmed",
    },
    {
      id: "RSV-1002",
      customer: "Andi Saputra",
      item: "Carrier Eiger 60L",
      date: "24 - 27 Mei 2026",
      total: "Rp180.000",
      status: "Pending",
    },
    {
      id: "RSV-1003",
      customer: "Siti Rahma",
      item: "Paket Camping Family",
      date: "25 - 29 Mei 2026",
      total: "Rp520.000",
      status: "Cancelled",
    },
    {
      id: "RSV-1004",
      customer: "Fajar Nugraha",
      item: "Cooking Set Portable",
      date: "26 - 28 Mei 2026",
      total: "Rp120.000",
      status: "Confirmed",
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] p-10">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Reservation Management
          </h1>

          <p className="text-gray-500 mt-1">
            Kelola reservasi penyewaan alat outdoor
          </p>
        </div>

        <button className="bg-emerald-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
          <CalendarRange size={18} />
          Calendar Reservation
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reservation</p>

              <h2 className="text-3xl font-black text-gray-900 mt-2">
                124
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CalendarRange className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>

              <h2 className="text-3xl font-black text-yellow-500 mt-2">
                18
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center">
              <Clock3 className="text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>

              <h2 className="text-3xl font-black text-emerald-600 mt-2">
                92
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cancelled</p>

              <h2 className="text-3xl font-black text-red-500 mt-2">
                14
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <XCircle className="text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* TOPBAR */}
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Reservation List
            </h2>

            <p className="text-gray-500 mt-1 text-sm">
              Semua data reservasi customer
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search reservation..."
                className="h-12 w-[260px] rounded-2xl border border-gray-200 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* FILTER */}
            <button className="h-12 px-5 rounded-2xl border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-all">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-600">
                  Reservation ID
                </th>

                <th className="px-6 py-5 text-left text-sm font-bold text-gray-600">
                  Customer
                </th>

                <th className="px-6 py-5 text-left text-sm font-bold text-gray-600">
                  Item
                </th>

                <th className="px-6 py-5 text-left text-sm font-bold text-gray-600">
                  Date
                </th>

                <th className="px-6 py-5 text-left text-sm font-bold text-gray-600">
                  Total
                </th>

                <th className="px-6 py-5 text-left text-sm font-bold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-5 text-center text-sm font-bold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((item, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-5 font-bold text-gray-900">
                    {item.id}
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {item.customer}
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {item.item}
                  </td>

                  <td className="px-6 py-5 text-gray-700">
                    {item.date}
                  </td>

                  <td className="px-6 py-5 font-bold text-emerald-600">
                    {item.total}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold ${
                        item.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all">
                        <Eye size={18} />
                      </button>

                      <button className="px-4 h-10 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:scale-105 transition-all">
                        Approve
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}