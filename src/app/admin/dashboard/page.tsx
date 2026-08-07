"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Wallet,
  ChevronRight,
  Clock,
  Home,
} from "lucide-react";
import { getDashboardSummary } from "@/lib/query/dashboard";
import { DashboardSummary } from "@/lib/query/dashboard.model";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getDashboardSummary();
        setData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const formatRupiah = (value: number) =>
    `Rp ${Number(value).toLocaleString("id-ID")}`;

  const stats = data
    ? [
        {
          title: "Total Peralatan",
          value: data.stats.total_equipment.toString(),
          desc: "Peralatan yang tersedia",
          icon: Package,
        },
        {
          title: "Rental Aktif",
          value: data.stats.active_rentals.toString(),
          desc: "Sedang dipinjam",
          icon: ShoppingCart,
        },
        {
          title: "Masalah Tertunda",
          value: data.stats.pending_issues.toString(),
          desc: "Perlu tindakan",
          icon: AlertTriangle,
        },
        {
          title: "Pendapatan",
          value: formatRupiah(data.stats.revenue),
          desc: "Bulan ini",
          icon: Wallet,
        },
      ]
    : [];

  const summaryItems = data
    ? [
        {
          label: "Peralatan Tersedia",
          value: data.summary.available_equipment.toString(),
        },
        {
          label: "Tertunda",
          value: data.summary.pending_approval.toString(),
        },
        {
          label: "Rental Selesai",
          value: data.summary.finished_rentals.toString(),
        },
      ]
    : [];

  const recentActivities = data?.recent_activities ?? [];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 font-sans antialiased text-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* BREADCRUMB & HEADER */}
        <div className="space-y-3">
          <nav className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer">
              <Home className="w-3.5 h-3.5" />
              <span>Admin</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-900">Dashboard</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Ringkasan sistem rental equipment dan performa bulan ini.
              </p>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-6 animate-pulse"
                >
                  <div className="h-4 w-24 bg-slate-200 rounded mb-4" />
                  <div className="h-7 w-16 bg-slate-200 rounded mb-2" />
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                </div>
              ))
            : stats.map((item, i) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm p-6"
                  >
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <h3 className="tracking-tight text-sm font-medium text-slate-500">
                        {item.title}
                      </h3>
                      <Icon className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{item.value}</div>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* RECENT ACTIVITY CARD */}
          <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
            <div className="flex flex-row items-center justify-between p-6 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="font-semibold leading-none tracking-tight text-lg">
                  Aktifitas Terbaru
                </h3>
                <p className="text-sm text-slate-500">
                  Transaksi rental terbaru yang baru diselesaikan
                </p>
              </div>

              <button
                onClick={() => router.push("/admin/orders/reservations")}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 hover:bg-slate-100 hover:text-slate-900 h-9 px-3 py-2"
              >
                Lihat Semua
              </button>
            </div>

            <div className="p-6 pt-4 space-y-3">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg bg-slate-100 animate-pulse"
                  />
                ))
              ) : recentActivities.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  Belum ada aktivitas selesai.
                </p>
              ) : (
                recentActivities.map((act, i) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-md border border-slate-200 shadow-sm">
                        <Package className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none text-slate-900">
                          {act.item}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {act.user}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 transition-colors">
                      {act.status}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* QUICK SUMMARY CARD */}
          <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="font-semibold leading-none tracking-tight text-lg">
                  Ringkasan Cepat
                </h3>
              </div>

              <div className="space-y-4">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 bg-slate-100 rounded animate-pulse"
                      />
                    ))
                  : summaryItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm pb-2 border-b border-slate-100 last:border-0"
                      >
                        <span className="text-slate-500">{item.label}</span>
                        <span className="font-semibold text-slate-900">
                          {item.value}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
