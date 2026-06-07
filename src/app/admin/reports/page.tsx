"use client";

import { motion } from "framer-motion";
import {
  FileBarChart2,
  Wallet,
  CalendarRange,
  TrendingUp,
  Download,
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
    <div className="min-h-screen bg-slate-50 p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Reports & Analytics
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              Business performance & transaction insights
            </p>
          </div>

          <button className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2">
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Total Revenue",
              value: "Rp48M",
              icon: Wallet,
            },
            {
              title: "Reservations",
              value: "1.284",
              icon: CalendarRange,
            },
            {
              title: "Growth",
              value: "+24%",
              icon: TrendingUp,
            },
            {
              title: "Reports",
              value: "32",
              icon: FileBarChart2,
            },
          ].map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-slate-200 rounded-2xl p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500">{item.title}</p>

                    <h2 className="text-2xl font-semibold text-slate-900 mt-1">
                      {item.value}
                    </h2>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CHART + SUMMARY */}
        <div className="grid xl:grid-cols-3 gap-6 mb-8">
          {/* CHART */}
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Revenue Overview
                </h2>

                <p className="text-sm text-slate-500">Monthly performance</p>
              </div>

              <button className="px-4 py-2 rounded-xl border border-slate-200 text-sm">
                Monthly
              </button>
            </div>

            {/* SIMPLE CHART */}
            <div className="h-[280px] flex items-end gap-3">
              {[40, 65, 50, 90, 75, 110, 95, 140].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h * 2}px` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex-1 rounded-t-xl bg-slate-900"
                />
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Summary
            </h2>

            <div className="space-y-4">
              {[
                {
                  label: "Best Month",
                  value: "Mei 2026",
                },
                {
                  label: "Top Item",
                  value: "Tenda 4P",
                },
                {
                  label: "Active Users",
                  value: "182",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b border-slate-100 pb-3"
                >
                  <span className="text-sm text-slate-500">{item.label}</span>

                  <span className="text-sm font-semibold text-slate-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-sm text-slate-500">Growth</p>

              <div className="flex items-center justify-between mt-1">
                <h3 className="text-xl font-semibold text-slate-900">+24%</h3>

                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Increased performance vs last month
              </p>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-slate-900">
              Latest Reports
            </h2>
            <p className="text-sm text-slate-500">
              System generated analytics reports
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4">Growth</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {reports.map((item, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {item.id}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">Generated report</p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.category}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {item.total}
                    </td>

                    <td className="px-6 py-4 text-emerald-600 text-sm font-medium">
                      {item.growth}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button className="px-4 py-2 rounded-xl bg-black text-white text-sm">
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
