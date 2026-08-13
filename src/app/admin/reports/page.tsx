"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  CalendarRange,
  Boxes,
  Users,
  Eye,
  CalendarDays,
  Download,
} from "lucide-react";
import { Inter } from "next/font/google";
import * as XLSX from "xlsx";

import { getReportsSummary, getMonthlyReport } from "@/lib/query/reports";

import { ReportsSummary, MonthlyReportDetail } from "@/lib/query/reports.model";

const inter = Inter({
  subsets: ["latin"],
});

/*
|--------------------------------------------------------------------------
| STATUS UI
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| CURRENT MONTH
|--------------------------------------------------------------------------
*/

function getCurrentMonthValue() {
  const now = new Date();

  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  return `${now.getFullYear()}-${month}`;
}

/*
|--------------------------------------------------------------------------
| REPORTS PAGE
|--------------------------------------------------------------------------
*/

export default function ReportsPage() {
  const router = useRouter();

  /*
  |--------------------------------------------------------------------------
  | SUMMARY STATE
  |--------------------------------------------------------------------------
  */

  const [data, setData] = useState<ReportsSummary | null>(null);

  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | MONTHLY REPORT STATE
  |--------------------------------------------------------------------------
  */

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());

  const [monthlyReport, setMonthlyReport] =
    useState<MonthlyReportDetail | null>(null);

  const [loadingMonthly, setLoadingMonthly] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | FETCH SUMMARY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getReportsSummary();

        setData(res);
      } catch (error) {
        console.error("Gagal mengambil laporan summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FETCH MONTHLY REPORT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchMonthly = async () => {
      const [yearStr, monthStr] = selectedMonth.split("-");

      const year = Number(yearStr);
      const month = Number(monthStr);

      if (!year || !month) {
        return;
      }

      setLoadingMonthly(true);

      try {
        const res = await getMonthlyReport(year, month);

        setMonthlyReport(res);
      } catch (error) {
        console.error("Gagal mengambil laporan bulanan:", error);

        setMonthlyReport(null);
      } finally {
        setLoadingMonthly(false);
      }
    };

    fetchMonthly();
  }, [selectedMonth]);

  /*
  |--------------------------------------------------------------------------
  | FORMAT RUPIAH
  |--------------------------------------------------------------------------
  */

  const formatRupiah = (value: number) =>
    `Rp ${Number(value).toLocaleString("id-ID")}`;

  /*
  |--------------------------------------------------------------------------
  | EXPORT EXCEL
  |--------------------------------------------------------------------------
  */

  const handleExportExcel = () => {
    if (!monthlyReport) {
      alert("Data laporan belum tersedia.");

      return;
    }

    const transactions = monthlyReport.transactions ?? [];

    if (transactions.length === 0) {
      alert("Tidak ada transaksi lunas pada bulan yang dipilih.");

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | DATA TRANSAKSI
    |--------------------------------------------------------------------------
    */

    const transactionData = transactions.map((item, index) => ({
      No: index + 1,

      "Kode Reservasi": item.code,

      Pelanggan: item.customer,

      Status: STATUS_UI[item.status]?.label ?? item.status,

      Total: Number(item.total),
    }));

    /*
    |--------------------------------------------------------------------------
    | DATA RINGKASAN
    |--------------------------------------------------------------------------
    */

    const summaryData = [
      {
        Informasi: "Laporan",
        Nilai: "Laporan KAPARAK",
      },

      {
        Informasi: "Periode",
        Nilai: `${monthlyReport.month} ${monthlyReport.year}`,
      },

      {
        Informasi: "Total Transaksi",
        Nilai: monthlyReport.total_transactions ?? 0,
      },

      {
        Informasi: "Total Pendapatan",
        Nilai: Number(monthlyReport.total_revenue) || 0,
      },
    ];

    /*
    |--------------------------------------------------------------------------
    | WORKBOOK
    |--------------------------------------------------------------------------
    */

    const workbook = XLSX.utils.book_new();

    /*
    |--------------------------------------------------------------------------
    | SHEET RINGKASAN
    |--------------------------------------------------------------------------
    */

    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);

    summaryWorksheet["!cols"] = [
      {
        wch: 22,
      },

      {
        wch: 35,
      },
    ];

    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Ringkasan");

    /*
    |--------------------------------------------------------------------------
    | SHEET TRANSAKSI
    |--------------------------------------------------------------------------
    */

    const transactionWorksheet = XLSX.utils.json_to_sheet(transactionData);

    transactionWorksheet["!cols"] = [
      {
        wch: 6,
      },

      {
        wch: 22,
      },

      {
        wch: 30,
      },

      {
        wch: 20,
      },

      {
        wch: 20,
      },
    ];

    XLSX.utils.book_append_sheet(workbook, transactionWorksheet, "Transaksi");

    /*
    |--------------------------------------------------------------------------
    | FILE NAME
    |--------------------------------------------------------------------------
    */

    const fileName = `Laporan-KAPARAK-${selectedMonth}.xlsx`;

    /*
    |--------------------------------------------------------------------------
    | DOWNLOAD
    |--------------------------------------------------------------------------
    */

    XLSX.writeFile(workbook, fileName);
  };

  /*
  |--------------------------------------------------------------------------
  | MAX REVENUE
  |--------------------------------------------------------------------------
  */

  const maxMonthlyRevenue = data
    ? Math.max(...data.monthly_revenue.map((m) => m.total), 1)
    : 1;

  /*
  |--------------------------------------------------------------------------
  | STAT CARDS
  |--------------------------------------------------------------------------
  */

  const statCards = data
    ? [
        {
          title: "Total Pendapatan",

          value: formatRupiah(data.total_revenue),

          icon: Wallet,
        },

        {
          title: "Total Reservasi",

          value: data.total_reservations.toLocaleString("id-ID"),

          icon: CalendarRange,
        },

        {
          title: "Total Produk",

          value: data.total_products.toLocaleString("id-ID"),

          icon: Boxes,
        },

        {
          title: "Pengguna Aktif",

          value: data.active_users.toLocaleString("id-ID"),

          icon: Users,
        },
      ]
    : [];

  /*
  |--------------------------------------------------------------------------
  | SUMMARY ITEMS
  |--------------------------------------------------------------------------
  */

  const summaryItems = data
    ? [
        {
          label: "Bulan Terbaik",

          value: data.best_month?.label ?? "-",
        },

        {
          label: "Produk Terlaris",

          value: data.top_item,
        },

        {
          label: "Pengguna Aktif",

          value: data.active_users.toString(),
        },
      ]
    : [];

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className={`${inter.className} min-h-screen bg-slate-50/50 p-6 md:p-10 antialiased text-slate-950`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Laporan
            </h1>

            <p className="text-sm text-slate-500">
              Performa bisnis & informasi transaksi
            </p>
          </div>
        </div>

        {/* ================================================================ */}
        {/* STATISTIK */}
        {/* ================================================================ */}

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
                    whileHover={{
                      y: -2,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
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

        {/* ================================================================ */}
        {/* GRAFIK + RINGKASAN */}
        {/* ================================================================ */}

        <div className="grid xl:grid-cols-3 gap-6">
          {/* GRAFIK */}

          <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-slate-900">
                  Ringkasan Pendapatan
                </h2>

                <p className="text-xs text-slate-500">
                  8 bulan terakhir berdasarkan pembayaran yang sudah lunas
                </p>
              </div>
            </div>

            {loading ? (
              <div className="h-65 flex items-end gap-3 pt-6 px-2">
                {Array.from({
                  length: 8,
                }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-slate-100 rounded-t animate-pulse"
                    style={{
                      height: `${40 + (i % 4) * 30}px`,
                    }}
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
                        initial={{
                          height: 0,
                        }}
                        animate={{
                          height: `${heightPx}px`,
                        }}
                        transition={{
                          duration: 0.4,
                          delay: i * 0.04,
                        }}
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

          {/* RINGKASAN PERFORMA */}

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Ringkasan Performa
              </h2>

              <div className="space-y-3">
                {loading
                  ? Array.from({
                      length: 3,
                    }).map((_, i) => (
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

        {/* ================================================================ */}
        {/* PEMASUKAN PER BULAN */}
        {/* ================================================================ */}

        <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
          {/* HEADER */}

          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900">
                Pemasukan per Bulan
              </h2>

              <p className="text-xs text-slate-500">
                Pilih bulan untuk melihat transaksi lunas pada periode tersebut
              </p>
            </div>

            {/* FILTER + EXPORT */}

            <div className="flex items-center gap-2">
              {/* PILIH BULAN */}

              <div className="relative">
                <CalendarDays className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="h-9 pl-9 pr-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              {/* EXPORT EXCEL */}

              <button
                type="button"
                onClick={handleExportExcel}
                disabled={
                  loadingMonthly ||
                  !monthlyReport ||
                  (monthlyReport.transactions ?? []).length === 0
                }
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                Export Excel
              </button>
            </div>
          </div>

          {/* TOTAL BULAN */}

          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {loadingMonthly ? (
              <>
                <div className="h-8 w-40 bg-slate-200 rounded animate-pulse" />

                <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs text-slate-500">
                    Pemasukan {monthlyReport?.month} {monthlyReport?.year}
                  </p>

                  <p className="text-2xl font-bold text-slate-900">
                    {formatRupiah(monthlyReport?.total_revenue ?? 0)}
                  </p>
                </div>

                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-1 text-xs font-semibold w-fit">
                  {monthlyReport?.total_transactions ?? 0} transaksi
                </span>
              </>
            )}
          </div>

          {/* ============================================================ */}
          {/* TABEL TRANSAKSI */}
          {/* ============================================================ */}

          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-medium">
                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Kode
                  </th>

                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Pelanggan
                  </th>

                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Status
                  </th>

                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Total
                  </th>

                  <th className="h-10 px-6 text-right align-middle font-medium">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* LOADING */}

                {loadingMonthly ? (
                  Array.from({
                    length: 3,
                  }).map((_, i) => (
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
                ) : /* DATA KOSONG */

                (monthlyReport?.transactions ?? []).length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-sm text-slate-400"
                    >
                      Tidak ada transaksi lunas di bulan ini.
                    </td>
                  </tr>
                ) : (
                  /* DATA */

                  monthlyReport!.transactions.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.15,
                        delay: index * 0.02,
                      }}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                    >
                      {/* KODE */}

                      <td className="p-4 px-6 align-middle font-mono text-xs font-medium text-slate-500">
                        {item.code}
                      </td>

                      {/* PELANGGAN */}

                      <td className="p-4 px-6 align-middle">
                        <p className="font-medium text-slate-900 text-sm leading-none">
                          {item.customer}
                        </p>
                      </td>

                      {/* STATUS */}

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

                      {/* TOTAL */}

                      <td className="p-4 px-6 align-middle font-semibold text-slate-900 text-sm">
                        {formatRupiah(item.total)}
                      </td>

                      {/* AKSI */}

                      <td className="p-4 px-6 align-middle text-right">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/admin/orders/reservations/${item.id}`)
                          }
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900 transition-colors focus-visible:outline-none"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Lihat
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
