/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package as PackageIcon,
  Tag,
  Boxes,
  Trash2,
  Pencil,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { getPackage, deletePackage } from "@/lib/query/package";
import { PackageItem, PackageProduct } from "@/lib/query/package.model";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

    setDeleting(true);

    try {
      await deletePackage(pkg.id);

      toast.success("Paket berhasil dihapus.", {
        description: `"${pkg.name}" telah dihapus dari daftar paket.`,
      });

      router.push("/admin/inventory/package");
    } catch (error) {
      console.error(error);

      toast.error("Gagal menghapus paket.", {
        description: "Terjadi kesalahan saat menghapus data paket.",
      });

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 font-sans antialiased text-slate-950">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
          <div className="h-12 w-1/3 bg-slate-200 rounded-md animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-72 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-32 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6 font-sans text-slate-950">
        <div className="text-center bg-white border border-slate-200 rounded-xl p-8 max-w-md w-full shadow-sm">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base mb-1">
            Paket Tidak Ditemukan
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Data paket tidak dapat dimuat atau ID paket yang dimasukkan salah.
          </p>
          <button
            onClick={() => router.push("/admin/inventory/package")}
            className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white shadow-sm hover:bg-slate-100 h-9 px-4 transition-colors"
          >
            Kembali ke Daftar Paket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 font-sans antialiased text-slate-950">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* BACK BUTTON & NAVIGATION */}
        <div>
          <button
            onClick={() => router.push("/admin/inventory/package")}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Paket
          </button>

          {/* HEADER ACTION BAR */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5"
          >
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {pkg.code}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
                {pkg.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* STATUS BADGE */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  pkg.status === "available"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {pkg.status === "available" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Available
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-slate-400" />
                    Inactive
                  </>
                )}
              </span>

              {/* EDIT BUTTON */}
              <button
                onClick={() =>
                  router.push(`/admin/inventory/package/${pkg.id}/edit`)
                }
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                title="Edit data paket"
              >
                <Pencil className="w-4 h-4 text-slate-500" />
                <span>Edit</span>
              </button>

              {/* DELETE BUTTON */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={deleting}
                    className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-600 shadow-sm hover:bg-rose-50 transition-colors disabled:opacity-50"
                    title="Hapus paket"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{deleting ? "Menghapus..." : "Hapus"}</span>
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-2">
                      <Trash2 className="w-5 h-5 text-rose-600" />
                    </div>

                    <AlertDialogTitle className="text-slate-900">
                      Hapus paket?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-slate-500 leading-relaxed">
                      Yakin ingin menghapus paket{" "}
                      <span className="font-semibold text-slate-700">
                        &quot;{pkg.name}&quot;
                      </span>
                      ? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="gap-2 sm:gap-2">
                    <AlertDialogCancel
                      disabled={deleting}
                      className="border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      Batal
                    </AlertDialogCancel>

                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleting}
                      className="bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600"
                    >
                      {deleting ? "Menghapus..." : "Hapus Paket"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        </div>

        {/* CONTENT MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: IMAGE, DESCRIPTION & ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {/* CARD: IMAGE & DESKRIPSI */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <div
                className="w-full bg-slate-100 relative border-b border-slate-100"
                style={{ aspectRatio: "16/7" }}
              >
                {pkg.image_url ? (
                  <img
                    src={pkg.image_url}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <PackageIcon className="w-10 h-10 stroke-[1.25]" />
                    <span className="text-xs mt-2">Tidak ada gambar</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Deskripsi Paket
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {pkg.description ||
                    "Tidak ada deskripsi rinci untuk paket bundling ini."}
                </p>
              </div>
            </motion.div>

            {/* CARD: PACKAGE ITEMS LIST */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-slate-500" />
                  <h2 className="font-semibold text-slate-900 text-sm">
                    Komponen Produk Paket
                  </h2>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {pkg.packageItems?.length ?? 0} Item
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {(pkg.packageItems ?? []).length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    Belum ada perlengkapan yang dimasukkan ke dalam paket ini.
                  </div>
                ) : (
                  pkg.packageItems.map((pi: PackageProduct) => (
                    <div
                      key={pi.id}
                      className="p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          {pi.product.image_url ? (
                            <img
                              src={pi.product.image_url}
                              alt={pi.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <PackageIcon className="w-5 h-5 text-slate-300" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {pi.product.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            SKU:{" "}
                            <span className="font-mono text-slate-500">
                              {pi.product.code}
                            </span>{" "}
                            ·{" "}
                            <span className="font-semibold text-slate-700">
                              {pi.quantity}x
                            </span>{" "}
                            per paket
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div>
                          <p className="text-[11px] text-slate-400">
                            Stok Produk
                          </p>
                          <p
                            className={`text-xs font-semibold ${
                              pi.product.stock < pi.quantity
                                ? "text-rose-600"
                                : "text-slate-700"
                            }`}
                          >
                            {pi.product.stock} unit
                          </p>
                        </div>

                        <div className="min-w-[100px]">
                          <p className="text-[11px] text-slate-400">
                            Harga Satuan
                          </p>
                          <p className="text-xs font-semibold text-slate-900">
                            Rp{" "}
                            {Number(pi.product.price).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: PRICING & CAPACITY SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* PRICING CARD */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Tag className="w-4 h-4 text-slate-500" />
                <h2 className="font-semibold text-slate-900 text-sm">
                  Rincian Kalkulasi Harga
                </h2>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Harga Normal</span>
                  <span className="font-medium text-slate-700">
                    Rp {Number(pkg.normal_price).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Hemat</span>
                  <span className="font-medium text-rose-600">
                    - Rp {Number(pkg.discount_amount).toLocaleString("id-ID")}
                    {discountPercent > 0 && (
                      <span className="ml-1 text-xs font-semibold bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">
                        {discountPercent}%
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-slate-100">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Harga Paket
                </span>
                <span className="text-2xl font-bold text-emerald-600 tracking-tight">
                  Rp {Number(pkg.package_price).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* CAPACITY / STOCK LIMIT CARD */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Kapasitas Paket Tersedia
              </h3>
              <div className="flex items-baseline gap-2 pt-1">
                <span
                  className={`text-3xl font-bold tracking-tight ${
                    maxAvailablePackages > 0
                      ? "text-slate-900"
                      : "text-rose-600"
                  }`}
                >
                  {maxAvailablePackages}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  Paket
                </span>
              </div>
              <p className="text-xs text-slate-500 pt-1 leading-relaxed">
                Dihitung secara otomatis berdasarkan batas stok produk paling
                terbatas di dalam paket ini.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
