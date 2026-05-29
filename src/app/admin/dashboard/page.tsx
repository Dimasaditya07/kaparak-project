"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/breadcrumb";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  Wallet,
  Clock3,
} from "lucide-react";

export default function AdminDashboard() {
  const breadcrumbItems = [{ label: "Dashboard", href: "/admin/dashboard" }];

  const stats = [
    {
      title: "Total Equipment",
      value: "128",
      growth: "+12%",
      icon: Package,
      desc: "Inventory aktif",
    },
    {
      title: "Active Rentals",
      value: "42",
      growth: "+5%",
      icon: ShoppingCart,
      desc: "Sedang dipinjam",
    },
    {
      title: "Pending Issues",
      value: "3",
      growth: "-2",
      icon: AlertTriangle,
      desc: "Perlu tindakan",
    },
    {
      title: "Revenue",
      value: "Rp 8.2JT",
      growth: "+18%",
      icon: Wallet,
      desc: "Bulan ini",
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#f6f8fb] text-gray-900 overflow-y-auto">
      <div className="p-10">
        {/* HEADER */}
        <header className="flex items-start justify-between mb-10">
          <div>
            <Breadcrumb items={breadcrumbItems} />

            <p className="text-gray-500 mt-3 text-xl text-bold tracking-[0.25em] uppercase font-medium">
              Kaparak Outdoor Management System
            </p>
          </div>
        </header>
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {stats.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-4xl border border-gray-200 bg-white p-6 hover:shadow-xl transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
                      {item.title}
                    </p>

                    <h3 className="text-4xl font-black text-gray-900">
                      {item.value}
                    </h3>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
                    <Icon className="text-green-600 w-6 h-6" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{item.desc}</span>

                  <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                    {item.growth}
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ACTIVITY */}
          <div className="xl:col-span-2 rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  Aktivitas Terakhir
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Monitoring realtime aktivitas penyewaan
                </p>
              </div>

              <button className="text-sm font-semibold text-green-600 hover:text-green-500 transition-colors">
                Lihat Semua
              </button>
            </div>

            <div className="space-y-5">
              {[1, 2, 3, 4].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-green-300 transition-all bg-[#fafafa]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
                      <Package className="text-green-600 w-6 h-6" />
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900">
                        Peminjaman Tenda Eiger
                      </h4>

                      <p className="text-sm text-gray-500 mt-1">
                        Oleh Dimas Aditya Ramadhan
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest">
                      Selesai
                    </span>

                    <p className="text-xs text-gray-400 mt-2">2 menit lalu</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SIDE PANEL */}
          <div className="rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <Clock3 className="text-green-600" />

              <h3 className="text-2xl font-black text-gray-900">
                Quick Summary
              </h3>
            </div>

            <div className="space-y-6">
              {[
                {
                  label: "Equipment Available",
                  value: "124",
                },
                {
                  label: "Pending Approval",
                  value: "8",
                },
                {
                  label: "Rental Finished",
                  value: "76",
                },
                {
                  label: "Total Customer",
                  value: "312",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-gray-100 pb-4"
                >
                  <span className="text-gray-500 text-sm">{item.label}</span>

                  <span className="text-xl font-black text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-4xl bg-linear-to-br from-green-50 to-emerald-100 border border-green-100 p-6">
              <p className="text-sm text-gray-500 mb-2">Monthly Performance</p>

              <h4 className="text-4xl font-black text-green-600 mb-2">+24%</h4>

              <p className="text-sm text-gray-600 leading-relaxed">
                Performa rental meningkat dibanding bulan lalu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
