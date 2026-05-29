"use client";

import { motion } from "framer-motion";
import {
  FileBarChart2,
  Wallet,
  CalendarRange,
  TrendingUp,
  Download,
  Filter,
  ArrowUpRight,
} from "lucide-react";

export default function ReportsPage() {
  const reports = [
    {
      id: "RPT-1001",
      title: "Pendapatan Mei 2026",
      category: "Revenue",
      total: "Rp12.500.000",
      growth: "+18%",
    },
    {
      id: "RPT-1002",
      title: "Reservasi Bulanan",
      category: "Reservation",
      total: "248 Booking",
      growth: "+12%",
    },
    {
      id: "RPT-1003",
      title: "Produk Terlaris",
      category: "Inventory",
      total: "Tenda Consina",
      growth: "+30%",
    },
    {
      id: "RPT-1004",
      title: "Customer Aktif",
      category: "User",
      total: "182 User",
      growth: "+8%",
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] p-10">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Reports & Analytics
          </h1>

          <p className="text-gray-500 mt-1">
            Laporan transaksi, reservasi, dan performa bisnis outdoor rental
          </p>
        </div>

        <button className="bg-emerald-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>

              <h2 className="text-3xl font-black text-gray-900 mt-2">
                Rp48M
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Wallet className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reservations</p>

              <h2 className="text-3xl font-black text-blue-600 mt-2">
                1.284
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <CalendarRange className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Growth</p>

              <h2 className="text-3xl font-black text-emerald-600 mt-2">
                +24%
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>

              <h2 className="text-3xl font-black text-orange-500 mt-2">
                32
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
              <FileBarChart2 className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="grid xl:grid-cols-3 gap-6 mb-8">
        {/* REVENUE CHART */}
        <div className="xl:col-span-2 bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Revenue Overview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Pendapatan rental per bulan
              </p>
            </div>

            <button className="h-11 px-5 rounded-2xl border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-all">
              <Filter size={17} />
              Monthly
            </button>
          </div>

          {/* FAKE CHART */}
          <div className="h-[320px] flex items-end gap-4">
            {[40, 65, 50, 90, 75, 110, 95, 140].map((item, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${item * 2}px` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex-1 rounded-t-[1.5rem] bg-gradient-to-t from-emerald-600 to-emerald-300"
              />
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-6">
            Summary
          </h2>

          <div className="space-y-5">
            <div className="bg-emerald-50 rounded-2xl p-5">
              <p className="text-sm text-emerald-700">
                Best Revenue Month
              </p>

              <h3 className="text-2xl font-black text-emerald-600 mt-2">
                Mei 2026
              </h3>

              <p className="text-sm text-emerald-700 mt-1">
                Rp12.500.000
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              <p className="text-sm text-blue-700">
                Most Reserved Item
              </p>

              <h3 className="text-2xl font-black text-blue-600 mt-2">
                Tenda 4P
              </h3>

              <p className="text-sm text-blue-700 mt-1">
                248 Reservation
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-5">
              <p className="text-sm text-orange-700">
                Active Customer
              </p>

              <h3 className="text-2xl font-black text-orange-500 mt-2">
                182 User
              </h3>

              <p className="text-sm text-orange-700 mt-1">
                +12% this month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT TABLE */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* TOPBAR */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Latest Reports
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Riwayat laporan bisnis dan transaksi
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-600">
                  Report ID
                </th>

                <th className="px-6 py-5 text-left text-sm font-bold text-gray-600">
                  Title
                </th>

                <th className="px-6 py-5 text-left text-sm font-bold text-gray-600">
                  Category
                </th>

                <th className="px-6 py-5 text-left text-sm font-bold text-gray-600">
                  Result
                </th>

                <th className="px-6 py-5 text-left text-sm font-bold text-gray-600">
                  Growth
                </th>

                <th className="px-6 py-5 text-center text-sm font-bold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {reports.map((item, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-5 font-bold text-gray-900">
                    {item.id}
                  </td>

                  <td className="px-6 py-5">
                    <h3 className="font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Generated report analytics
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                      {item.category}
                    </span>
                  </td>

                  <td className="px-6 py-5 font-black text-emerald-600">
                    {item.total}
                  </td>

                  <td className="px-6 py-5">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <ArrowUpRight size={17} />
                      {item.growth}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center">
                      <button className="px-5 h-11 rounded-2xl bg-emerald-600 text-white text-sm font-semibold hover:scale-105 transition-all">
                        View Report
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