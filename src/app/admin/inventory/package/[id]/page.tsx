/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import {
  ArrowLeft,
  Package as PackageIcon,
  Tag,
  Boxes,
  Trash2,
  Pencil,
} from "lucide-react";

import { getPackage, deletePackage } from "@/lib/query/package";
import { PackageItem, PackageProduct } from "@/lib/query/package.model";

const inter = Inter({ subsets: ["latin"] });

export default function PackageDetailAdminPage() {
  const router = useRouter();
  const params = useParams();
  const [pkg, setPkg] = useState<PackageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getPackage(Number(params.id));
        setPkg(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchDetail();
  }, [params.id]);

  const discountPercent = useMemo(() => {
    if (!pkg || !pkg.normal_price || pkg.normal_price <= 0) return 0;
    return Math.round((pkg.discount_amount / pkg.normal_price) * 100);
  }, [pkg]);

  // Kapasitas: berapa paket lagi yang bisa dibuat berdasarkan stok
  // produk paling terbatas di dalamnya
  const maxAvailablePackages = useMemo(() => {
    if (!pkg || !pkg.packageItems || pkg.packageItems.length === 0) return 0;
    const limits = pkg.packageItems.map((pi) =>
      pi.quantity > 0 ? Math.floor(pi.product.stock / pi.quantity) : 0,
    );
    return Math.min(...limits);
  }, [pkg]);

  const handleDelete = async () => {
    if (!pkg) return;
    const confirmDelete = confirm(
      `Yakin ingin menghapus paket "${pkg.name}"? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await deletePackage(pkg.id);
      router.push("/admin/inventory/packages");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus paket.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`${inter.className} min-h-screen bg-slate-50 p-8 lg:p-12`}
      >
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="h-8 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div
        className={`${inter.className} min-h-screen bg-slate-50 flex items-center justify-center p-8`}
      >
        <div className="text-center bg-white border border-slate-200 rounded-2xl p-10 max-w-sm">
          <p className="font-semibold text-slate-800 mb-1">
            Paket Tidak Ditemukan
          </p>
          <p className="text-sm text-slate-500 mb-5">
            Pastikan ID paket sudah benar.
          </p>
          <button
            onClick={() => router.push("/admin/inventory/packages")}
            className="px-4 py-2 rounded-lg border hover:bg-slate-100 text-sm"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${inter.className} min-h-screen bg-slate-50 p-8 lg:p-12`}>
      <div className="max-w-5xl mx-auto">
        {/* BACK */}
        <button
          onClick={() => router.push("/admin/inventory/packages")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Paket
        </button>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <p className="font-mono text-xs text-slate-400 mb-1">{pkg.code}</p>
            <h1 className="text-2xl font-semibold text-slate-900">
              {pkg.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                pkg.status === "available"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {pkg.status === "available" ? "Available" : "Inactive"}
            </span>

            <button
              onClick={() => router.push("/admin/inventory/package")}
              className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
              title="Edit paket dari halaman daftar"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50"
              title="Hapus paket"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* IMAGE + DESCRIPTION */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
            >
              <div
                className="w-full bg-slate-100"
                style={{ aspectRatio: "16/7" }}
              >
                {pkg.image_url ? (
                  <img
                    src={pkg.image_url}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PackageIcon size={40} className="text-slate-300" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Deskripsi
                </p>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {pkg.description || "Tidak ada deskripsi untuk paket ini."}
                </p>
              </div>
            </motion.div>

            {/* ITEMS LIST */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Boxes size={16} className="text-slate-500" />
                <h2 className="font-semibold text-slate-800 text-sm">
                  Barang dalam Paket ({pkg.packageItems?.length ?? 0})
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                {(pkg.packageItems ?? []).length === 0 ? (
                  <p className="px-6 py-8 text-sm text-slate-400 text-center">
                    Belum ada barang di paket ini.
                  </p>
                ) : (
                  pkg.packageItems.map((pi: PackageProduct) => (
                    <div
                      key={pi.id}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                        {pi.product.image_url ? (
                          <img
                            src={pi.product.image_url}
                            alt={pi.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <PackageIcon size={20} className="text-slate-300" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {pi.product.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {pi.product.code} · {pi.quantity} unit per paket
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-400 mb-0.5">
                          Stok produk saat ini
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            pi.product.stock < pi.quantity
                              ? "text-red-500"
                              : "text-slate-700"
                          }`}
                        >
                          {pi.product.stock} unit
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0 w-28">
                        <p className="text-xs text-slate-400 mb-0.5">
                          Harga Satuan
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          Rp {Number(pi.product.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: PRICING SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-8 h-fit space-y-6"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Tag size={16} className="text-slate-500" />
                <h2 className="font-semibold text-slate-800 text-sm">
                  Rincian Harga
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Harga Normal</span>
                  <span className="font-semibold text-slate-700">
                    Rp {Number(pkg.normal_price).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Hemat</span>
                  <span className="font-semibold text-red-500">
                    − Rp {Number(pkg.discount_amount).toLocaleString("id-ID")}
                    {discountPercent > 0 && (
                      <span className="ml-1 text-xs">({discountPercent}%)</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-dashed border-slate-200">
                <span className="text-sm font-semibold text-slate-500">
                  Harga Paket
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  Rp {Number(pkg.package_price).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* CAPACITY */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Kapasitas Tersedia
              </p>
              <p
                className={`text-2xl font-bold ${
                  maxAvailablePackages > 0 ? "text-slate-900" : "text-red-500"
                }`}
              >
                {maxAvailablePackages} paket
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Dihitung dari stok produk paling terbatas di dalam paket ini.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
