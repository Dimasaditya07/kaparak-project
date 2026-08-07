/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Plus, Edit, Trash2, Boxes } from "lucide-react";
import { getProducts, deleteProduct } from "@/lib/query/product";
import { ProductItem } from "@/lib/query/product.model";
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
} from "@/components/ui/alert-dialog";

export default function ProductPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  );

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedProduct) return;

    setDeleting(true);

    try {
      await deleteProduct(selectedProduct.id);

      toast.success("Produk berhasil dihapus.", {
        description: `"${selectedProduct.name}" telah dihapus dari inventaris.`,
      });

      setSelectedProduct(null);
      await fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error("Gagal menghapus produk.", {
        description: "Terjadi kesalahan saat menghapus data produk.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 font-sans antialiased text-slate-950">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Kelola Peralatan
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola seluruh inventaris barang rental, tarif sewa, dan
              ketersediaan stok Anda.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/inventory/product/create")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>

        {/* TABLE CARD */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-6">Peralatan</th>
                  <th className="py-3 px-6">Kategori</th>
                  <th className="py-3 px-6">Harga Sewa</th>
                  <th className="py-3 px-6">Status Stok</th>
                  <th className="py-3 px-6 text-right w-32">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* LOADING SKELETON */}
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg shrink-0" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-36 bg-slate-100 rounded" />
                            <div className="h-2.5 w-24 bg-slate-100 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="h-3 w-20 bg-slate-100 rounded" />
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="h-3.5 w-24 bg-slate-100 rounded" />
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="h-5 w-16 bg-slate-100 rounded-full" />
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="h-7 w-20 bg-slate-100 rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  /* EMPTY STATE */
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <Boxes className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900 text-sm">
                            Belum Ada Produk
                          </p>
                          <p className="text-xs text-slate-500">
                            Silakan tambahkan produk pertama Anda untuk mulai
                            mengelola inventaris sewa.
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            router.push("/admin/inventory/product/create")
                          }
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Tambah Produk Baru
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* DATA LIST */
                  products.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* PRODUCT DETAIL */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-400">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5" />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-medium text-slate-900 text-sm">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                                {item.code || `PROD-${item.id}`}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-[11px] text-slate-500">
                                Stok:{" "}
                                <strong className="text-slate-800 font-semibold">
                                  {item.stock}
                                </strong>{" "}
                                unit
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="py-3.5 px-6 text-slate-600">
                        {item.category?.name ? (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-700 font-medium">
                            {item.category.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">-</span>
                        )}
                      </td>

                      {/* PRICE */}
                      <td className="py-3.5 px-6 font-semibold text-slate-900">
                        Rp {Number(item.price).toLocaleString("id-ID")}
                        <span className="text-[10px] text-slate-400 font-normal block">
                          / hari
                        </span>
                      </td>

                      {/* STOCK STATUS */}
                      <td className="py-3.5 px-6">
                        {item.stock > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Tersedia
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Habis
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* EDIT BUTTON */}
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/inventory/product/${item.id}/edit`,
                              )
                            }
                            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Edit Produk"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => setSelectedProduct(item)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* DELETE CONFIRMATION */}
        <AlertDialog
          open={!!selectedProduct}
          onOpenChange={(open) => {
            if (!open && !deleting) {
              setSelectedProduct(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus produk?</AlertDialogTitle>

              <AlertDialogDescription>
                Yakin ingin menghapus produk{" "}
                <span className="font-semibold text-slate-700">
                  &quot;{selectedProduct?.name}&quot;
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {deleting ? "Menghapus..." : "Hapus Produk"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
