"use client";

import { motion } from "framer-motion";

import { FolderTree, Plus, Edit, Trash2, X } from "lucide-react";

import { useEffect, useState } from "react";

import { Inter } from "next/font/google";

import axios from "axios";

import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/query/category";

import { CategoryItem } from "@/lib/query/category.model";

const inter = Inter({
  subsets: ["latin"],
});

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const [loading, setLoading] = useState(true);

  // MODAL
  const [openModal, setOpenModal] = useState(false);

  // EDIT
  const [isEdit, setIsEdit] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // FORM
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
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

  // CREATE
  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createCategory({
        name,
        slug,
      });

      await fetchCategories();

      resetForm();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log(error);
      }
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

  // UPDATE
  async function handleUpdateCategory(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedId) return;

    try {
      await updateCategory(selectedId, {
        name,
        slug,
      });

      await fetchCategories();

      resetForm();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log(error);
      }
    }
  }

  // DELETE
  async function handleDelete(id: number) {
    const confirmDelete = confirm("Yakin ingin menghapus category?");

    if (!confirmDelete) return;

    try {
      await deleteCategory(id);

      await fetchCategories();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className={`${inter.className} flex-1 min-h-screen bg-slate-50 p-8 lg:p-12 antialiased`}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Category Inventory
            </h1>

            <p className="text-slate-500 mt-1 text-sm">
              Kelola semua kategori produk rental Anda
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => {
              resetForm();
              setOpenModal(true);
            }}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-emerald-600/20 active:scale-95 font-medium text-sm"
          >
            <Plus size={18} />
            Tambah Category
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="py-4 px-6 font-medium">Category</th>

                  <th className="py-4 px-6 font-medium">Slug</th>

                  <th className="py-4 px-6 font-medium text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* LOADING */}
                {loading ? (
                  Array.from({
                    length: 5,
                  }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>

                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-slate-200 rounded-md"></div>

                            <div className="h-3 w-20 bg-slate-200 rounded-md"></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-4 w-28 bg-slate-200 rounded-md"></div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-8 w-20 bg-slate-200 rounded-md ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : categories.length === 0 ? (
                  // EMPTY
                  <tr>
                    <td colSpan={3} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <FolderTree
                          size={48}
                          strokeWidth={1}
                          className="mb-4"
                        />

                        <p className="text-slate-600 font-medium">
                          Belum ada category
                        </p>

                        <p className="text-sm">
                          Silakan tambahkan category baru untuk memulai.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // DATA
                  categories.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* CATEGORY */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            <FolderTree className="text-slate-400" size={20} />
                          </div>

                          <div>
                            <p className="font-medium text-slate-900 text-sm">
                              {item.name}
                            </p>

                            <p className="text-xs text-slate-500 mt-0.5">
                              Category Product
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SLUG */}
                      <td className="py-4 px-6">
                        <span className="text-xs text-gray-900 font-medium tracking-wide">
                          {item.slug}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-yellow-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
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

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5 overflow-y-auto">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="bg-white w-full max-w-xl rounded-3xl p-8 relative"
          >
            {/* CLOSE */}
            <button
              onClick={resetForm}
              className="absolute top-5 right-5 p-2 rounded-xl hover:bg-slate-100 transition-all"
            >
              <X size={18} />
            </button>

            {/* TITLE */}
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              {isEdit ? "Edit Category" : "Tambah Category"}
            </h2>

            {/* FORM */}
            <form
              onSubmit={isEdit ? handleUpdateCategory : handleCreateCategory}
              className="space-y-5"
            >
              {/* NAME */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Nama Category
                </label>

                <input
                  type="text"
                  placeholder="Masukkan nama category"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 border border-slate-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Slug
                </label>

                <input
                  type="text"
                  placeholder="tenda"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full h-14 border border-slate-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* BUTTON */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-black text-white hover:bg-gray-800 transition-all"
                >
                  {isEdit ? "Update Category" : "Simpan Category"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
