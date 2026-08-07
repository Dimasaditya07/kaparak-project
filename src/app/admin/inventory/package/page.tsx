/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { Package, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPackages, deletePackage } from "@/lib/query/package";
import { PackageItem } from "@/lib/query/package.model";
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
import { toast } from "sonner";

export default function PackagePage() {
  const router = useRouter();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(
    null,
  );

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  async function fetchPackages() {
    try {
      const response = await getPackages();
      setPackages(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedPackage) return;

    setDeleting(true);

    try {
      await deletePackage(selectedPackage.id);

      toast.success("Paket berhasil dihapus.", {
        description: `"${selectedPackage.name}" telah dihapus dari daftar paket.`,
      });

      setSelectedPackage(null);
      await fetchPackages();
    } catch (error) {
      console.error(error);

      toast.error("Gagal menghapus paket.", {
        description: "Terjadi kesalahan saat menghapus data paket.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 font-sans antialiased text-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Kelola Paket
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola seluruh paket yang tersedia di sistem.
            </p>
          </div>

          {/* shadcn Button Primary */}
          <button
            onClick={() => router.push("/admin/inventory/package/create")}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90 h-9 px-4 py-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket</span>
          </button>
        </div>

        {/* TABLE CONTAINER (shadcn Card style) */}
        <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm overflow-hidden">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              {/* TABLE HEADER */}
              <thead>
                <tr className="border-b border-slate-200 transition-colors bg-slate-50/70 hover:bg-slate-50/70">
                  <th className="h-12 px-6 text-left align-middle font-medium text-slate-500">
                    Paket
                  </th>
                  <th className="h-12 px-6 text-left align-middle font-medium text-slate-500">
                  </th>
                  <th className="h-12 px-6 text-left align-middle font-medium text-slate-500">
                    Harga Normal
                  </th>
                  <th className="h-12 px-6 text-left align-middle font-medium text-slate-500">
                    Harga Paket
                  </th>
                  <th className="h-12 px-6 text-left align-middle font-medium text-slate-500">
                    Status
                  </th>
                  <th className="h-12 px-6 text-right align-middle font-medium text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="[&_tr:last-child]:border-0">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="p-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-200 animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                            <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-8 w-24 bg-slate-200 rounded ml-auto animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : packages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <img
                          src="/images/empty.png"
                          alt="Empty state"
                          className="w-60 opacity-80"
                        />
                        <p className="text-sm font-medium text-slate-600">
                          Belum ada paket yang tersedia.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  packages.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
                    >
                      {/* Package Name & Image */}
                      <td className="p-4 px-6 align-middle">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="text-slate-400 w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 leading-none">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 font-mono">
                              {item.code}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Harga Normal */}
                      <td className="p-4 px-6 align-middle text-slate-600">
                        Rp {Number(item.normal_price).toLocaleString("id-ID")}
                      </td>

                      {/* Harga Paket */}
                      <td className="p-4 px-6 align-middle font-semibold text-slate-600">
                        Rp {Number(item.package_price).toLocaleString("id-ID")}/hari
                      </td>

                      {/* Status Badge (shadcn style) */}
                      <td className="p-4 px-6 align-middle">
                        {item.status === "available" ? (
                          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            Tersedia
                          </div>
                        ) : (
                          <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                            {item.status}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 px-6 align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Eye Button */}
                          <button
                            onClick={() =>
                              router.push(`/admin/inventory/package/${item.id}`)
                            }
                            title="Detail"
                            className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors focus-visible:outline-none"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/inventory/package/${item.id}/edit`,
                              )
                            }
                            title="Edit"
                            className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                onClick={() => setSelectedPackage(item)}
                                title="Hapus"
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors focus-visible:outline-none"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Hapus paket?
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                  Yakin ingin menghapus paket{" "}
                                  <span className="font-semibold text-slate-700">
                                    &quot;{item.name}&quot;
                                  </span>
                                  ? Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={deleting}>
                                  Batal
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  onClick={handleDelete}
                                  disabled={deleting}
                                  className="bg-rose-600 hover:bg-rose-700 text-white"
                                >
                                  {deleting ? "Menghapus..." : "Hapus Paket"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
