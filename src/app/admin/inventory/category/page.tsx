"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
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

import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/query/category";
import { CategoryItem } from "@/lib/query/category.model";

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // MODAL
  const [openModal, setOpenModal] = useState(false);

  // EDIT
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // FORM
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(
    null,
  );

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // RESET FORM
  function resetForm() {
    setName("");
    setSlug("");
    setSelectedId(null);
    setIsEdit(false);
    setOpenModal(false);
  }

  // AUTO GENERATE SLUG
  function handleNameChange(val: string) {
    setName(val);
    if (!isEdit) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  }

  // CREATE / UPDATE SUBMIT
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit && selectedId) {
        await updateCategory(selectedId, { name, slug });
        toast.success("Kategori berhasil diperbarui.", {
          description: `"${name}" telah diperbarui.`,
        });
      } else {
        await createCategory({ name, slug });
        toast.success("Kategori berhasil ditambahkan.", {
          description: `"${name}" telah ditambahkan ke daftar kategori.`,
        });
      }
      await fetchCategories();
      resetForm();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);

        toast.error("Gagal menyimpan kategori.", {
          description:
            error.response?.data?.message || "Terjadi kesalahan pada server.",
        });
      } else {
        console.error(error);

        toast.error("Gagal menyimpan kategori.", {
          description: "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  // OPEN EDIT
  function handleOpenEdit(category: CategoryItem) {
    setIsEdit(true);
    setSelectedId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setOpenModal(true);
  }

  // DELETE
  async function handleDelete() {
    if (!selectedCategory) return;

    setDeleting(true);

    try {
      await deleteCategory(selectedCategory.id);

      toast.success("Kategori berhasil dihapus.", {
        description: `"${selectedCategory.name}" telah dihapus dari daftar kategori.`,
      });

      setSelectedCategory(null);
      await fetchCategories();
    } catch (error) {
      console.error(error);

      toast.error("Gagal menghapus kategori.", {
        description: "Terjadi kesalahan saat menghapus data kategori.",
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
              Kelola Kategori
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola daftar kategori produk untuk mengelompokkan Alat Anda.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setOpenModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Kategori
          </button>
        </div>

        {/* TABLE CARD */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-6">Informasi Kategori</th>
                  <th className="py-3 px-6">Slug URL</th>
                  <th className="py-3 px-6 text-right w-28">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* LOADING SKELETON */}
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-100 rounded-lg shrink-0" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-32 bg-slate-100 rounded" />
                            <div className="h-2.5 w-20 bg-slate-100 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="h-3 w-24 bg-slate-100 rounded" />
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="h-7 w-16 bg-slate-100 rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : categories.length === 0 ? (
                  /* EMPTY STATE */
                  <tr>
                    <td colSpan={3} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <FolderTree className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900 text-sm">
                            Belum Ada Kategori
                          </p>
                          <p className="text-xs text-slate-500">
                            Silakan tambahkan kategori produk baru untuk
                            mengelompokkan inventaris Anda.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            resetForm();
                            setOpenModal(true);
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Tambah Kategori
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* DATA LIST */
                  categories.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* CATEGORY INFO */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                            <FolderTree className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              ID: {item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SLUG */}
                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          {item.slug}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none"
                            title="Edit Kategori"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedCategory(item)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Kategori"
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
      </div>

      {/* SHADCN MODAL DIALOG */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* MODAL CONTAINER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="font-semibold text-slate-900 text-base">
                    {isEdit ? "Edit Kategori" : "Tambah Kategori Baru"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isEdit
                      ? "Perbarui detail nama dan slug kategori."
                      : "Buat nama kategori baru untuk pengelompokkan barang."}
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* NAME FIELD */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Nama Kategori <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Tenda & Camp"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                  />
                </div>

                {/* SLUG FIELD */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Slug URL <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="tenda-camp"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-md border border-slate-200 font-mono text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                  />
                </div>

                {/* FOOTER ACTIONS */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="h-9 px-4 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-9 px-4 rounded-md bg-slate-900 text-white text-xs font-medium shadow hover:bg-slate-800 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isEdit ? "Update" : "Simpan"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={!!selectedCategory}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setSelectedCategory(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kategori?</AlertDialogTitle>

            <AlertDialogDescription>
              Yakin ingin menghapus kategori{" "}
              <span className="font-semibold text-slate-700">
                &quot;{selectedCategory?.name}&quot;
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
              {deleting ? "Menghapus..." : "Hapus Kategori"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
