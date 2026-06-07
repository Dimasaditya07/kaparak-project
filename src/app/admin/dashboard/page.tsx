"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/breadcrumb";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Wallet,
  ArrowUpRight,
  Clock3,
} from "lucide-react";

export default function AdminDashboard() {
  const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }];

  const stats = [
    {
      title: "Total Equipment",
      value: 128,
      desc: "Inventory aktif",
      icon: Package,
    },
    {
      title: "Active Rentals",
      value: 42,
      desc: "Sedang dipinjam",
      icon: ShoppingCart,
    },
    {
      title: "Pending Issues",
      value: 3,
      desc: "Perlu tindakan",
      icon: AlertTriangle,
    },
    {
      title: "Revenue",
      value: "Rp 8.2JT",
      desc: "Bulan ini",
      icon: Wallet,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

          <p className="text-slate-500 text-sm mt-1">
            Overview sistem rental equipment
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((item, i) => {
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

                <p className="text-xs text-slate-500 mt-3">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ACTIVITY */}
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </h2>
                <p className="text-sm text-slate-500">
                  Latest rental transactions
                </p>
              </div>

              <button className="text-sm text-black font-medium">
                View all
              </button>
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-slate-600" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Tenda Eiger Rental
                      </p>
                      <p className="text-xs text-slate-500">by Dimas Aditya</p>
                    </div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Completed
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock3 className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Quick Summary
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { label: "Available Equipment", value: 124 },
                { label: "Pending Approval", value: 8 },
                { label: "Finished Rentals", value: 76 },
                { label: "Total Customers", value: 312 },
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

            {/* PERFORMANCE CARD */}
            <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-sm text-slate-500">Monthly Growth</p>

              <div className="flex items-end justify-between mt-2">
                <h3 className="text-3xl font-semibold text-slate-900">+24%</h3>

                <ArrowUpRight className="text-emerald-500" />
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Increased rental performance compared to last month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
