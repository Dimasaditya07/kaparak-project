"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, CalendarRange, Boxes, Users, Eye } from "lucide-react";
import { Inter } from "next/font/google";
import { getReportsSummary } from "@/lib/query/reports";
import { ReportsSummary } from "@/lib/query/reports.model";

const inter = Inter({ subsets: ["latin"] });

const STATUS_UI: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Menunggu",
    className: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  },
  confirmed: {
    label: "Dikonfirmasi",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  picked_up: {
    label: "Diambil",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  returned: {
    label: "Dikembalikan",
    className: "bg-purple-50 text-purple-700 ring-purple-200",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
};

export default function ReportsPage() {
  const router = useRouter();
  const [data, setData] = useState<ReportsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getReportsSummary();
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

  const maxMonthlyRevenue = data
    ? Math.max(...data.monthly_revenue.map((m) => m.total), 1)
    : 1;

  const statCards = data
    ? [
        {
          title: "Total Revenue",
          value: formatRupiah(data.total_revenue),
          icon: Wallet,
        },
        {
          title: "Reservations",
          value: data.total_reservations.toLocaleString("id-ID"),
          icon: CalendarRange,
        },
        {
          title: "Total Products",
          value: data.total_products.toLocaleString("id-ID"),
          icon: Boxes,
        },
        {
          title: "Active Users",
          value: data.active_users.toLocaleString("id-ID"),
          icon: Users,
        },
      ]
    : [];

  const summaryItems = data
    ? [
        { label: "Best Month", value: data.best_month?.label ?? "-" },
        { label: "Top Item", value: data.top_item },
        { label: "Active Users", value: data.active_users.toString() },
      ]
    : [];

  return (
    <div
      className={`${inter.className} min-h-screen bg-slate-50/50 p-6 md:p-10 antialiased text-slate-950`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reports & Analytics
            </h1>
            <p className="text-sm text-slate-500">
              Business performance & transaction insights
            </p>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse"
                >
                  <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
                  <div className="h-7 w-24 bg-slate-200 rounded" />
                </div>
              ))
            : statCards.map((item, i) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-xl border border-slate-200 bg-white p-5 text-slate-950 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                          {item.title}
                        </p>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                          {item.value}
                        </h2>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-600">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
        </div>

        {/* CHART + SUMMARY SECTION */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* CHART CARD */}
          <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-slate-900">
                  Revenue Overview
                </h2>
                <p className="text-xs text-slate-500">
                  8 bulan terakhir, dari pembayaran yang sudah lunas
                </p>
              </div>
            </div>

            {/* CHART DISPLAY */}
            {loading ? (
              <div className="h-65 flex items-end gap-3 pt-6 px-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-slate-100 rounded-t animate-pulse"
                    style={{ height: `${40 + (i % 4) * 30}px` }}
                  />
                ))}
              </div>
            ) : (
              <div className="h-65 flex items-end gap-3 pt-6 px-2">
                {(data?.monthly_revenue ?? []).map((m, i) => {
                  const heightPx = Math.max(
                    (m.total / maxMonthlyRevenue) * 220,
                    4,
                  );

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPx}px` }}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                        className="w-full rounded-t bg-slate-900 transition-colors group-hover:bg-slate-700"
                        title={formatRupiah(m.total)}
                      />
                      <span className="text-[10px] text-slate-400">
                        {m.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SUMMARY CARD */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Performance Summary
              </h2>

              <div className="space-y-3">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 bg-slate-100 rounded animate-pulse"
                      />
                    ))
                  : summaryItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50"
                      >
                        <span className="text-slate-500 font-medium">
                          {item.label}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {item.value}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>

        {/* LATEST TRANSACTIONS TABLE */}
        <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              Latest Transactions
            </h2>
            <p className="text-xs text-slate-500">
              5 reservasi dengan pembayaran lunas terbaru
            </p>
          </div>

          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-medium">
                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Code
                  </th>
                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Customer
                  </th>
                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Status
                  </th>
                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Total
                  </th>
                  <th className="h-10 px-6 text-right align-middle font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4 px-6">
                        <div className="h-4 w-20 bg-slate-100 rounded" />
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-4 w-28 bg-slate-100 rounded" />
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-5 w-20 bg-slate-100 rounded-full" />
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-4 w-24 bg-slate-100 rounded" />
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-8 w-16 bg-slate-100 rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : (data?.latest_transactions ?? []).length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-sm text-slate-400"
                    >
                      Belum ada transaksi lunas.
                    </td>
                  </tr>
                ) : (
                  data!.latest_transactions.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                    >
                      <td className="p-4 px-6 align-middle font-mono text-xs font-medium text-slate-500">
                        {item.code}
                      </td>

                      <td className="p-4 px-6 align-middle">
                        <p className="font-medium text-slate-900 text-sm leading-none">
                          {item.customer}
                        </p>
                      </td>

                      <td className="p-4 px-6 align-middle">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            STATUS_UI[item.status]?.className ??
                            "bg-slate-100 text-slate-700 ring-slate-200"
                          }`}
                        >
                          {STATUS_UI[item.status]?.label ?? item.status}
                        </span>
                      </td>

                      <td className="p-4 px-6 align-middle font-semibold text-slate-900 text-sm">
                        {formatRupiah(item.total)}
                      </td>

                      <td className="p-4 px-6 align-middle text-right">
                        <button
                          onClick={() =>
                            router.push(`/admin/orders/reservations/${item.id}`)
                          }
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900 transition-colors focus-visible:outline-none"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
