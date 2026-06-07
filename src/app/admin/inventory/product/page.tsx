/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import { motion } from "framer-motion";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/query/product";

import { getCategories } from "@/lib/query/category";

import { CategoryItem } from "@/lib/query/category.model";

import { ProductItem } from "@/lib/query/product.model";

const inter = Inter({
  subsets: ["latin"],
});

export default function ProductPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // MODAL
  const [openModal, setOpenModal] = useState(false);

  // EDIT MODE
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // FORM
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("available");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    try {
      const response = await getProducts();

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await getCategories();

      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  // RESET FORM
  function resetForm() {
    setName("");
    setCode("");
    setStock(0);
    setPrice(0);

    setCategoryId("");
    setDescription("");
    setStatus("available");

    setImage(null);

    setSelectedId(null);

    setIsEdit(false);

    setOpenModal(false);
  }

  // CREATE PRODUCT
  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("code", code);

      formData.append("stock", stock.toString());

      formData.append("category_id", categoryId);
      formData.append("description", description);
      formData.append("status", status);

      formData.append("price", price.toString());

      if (image instanceof Blob) {
        formData.append("image", image);
      }

      await createProduct(formData);

      await fetchProducts();

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
  function handleOpenEdit(product: ProductItem) {
    setIsEdit(true);

    setSelectedId(product.id);

    setName(product.name);
    setCode(product.code);
    setStock(product.stock);
    setPrice(Number(product.price));

    setCategoryId(String(product.category_id));

    setDescription(product.description);

    setStatus(product.status);

    setOpenModal(true);
  }

  // UPDATE PRODUCT
  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedId) return;

    try {
      const formData = new FormData();

      formData.append("name", name);

      formData.append("code", code);

      formData.append("stock", stock.toString());

      formData.append("price", price.toString());

      formData.append("category_id", categoryId);

      formData.append("description", description);

      formData.append("status", status);

      if (image) {
        formData.append("image", image);
      }

      await updateProduct(selectedId, formData);

      await fetchProducts();

      resetForm();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log(error);
      }
    }
  }

  // DELETE PRODUCT
  async function handleDelete(id: number) {
    const confirmDelete = confirm("Yakin ingin menghapus product?");

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);

      await fetchProducts();
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
              Product Inventory
            </h1>

            <p className="text-slate-500 mt-1 text-sm">
              Kelola semua produk rental dan ketersediaan stok Anda
            </p>
          </div>

          {/* BUTTON OPEN MODAL */}
          <button
            onClick={() => {
              resetForm();
              setOpenModal(true);
            }}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-emerald-600/20 active:scale-95 font-medium text-sm"
          >
            <Plus size={18} />
            Tambah Produk
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="py-4 px-6 font-medium">Produk</th>

                  <th className="py-4 px-6 font-medium">Kode</th>

                  <th className="py-4 px-6 font-medium">Category</th>

                  <th className="py-4 px-6 font-medium">Harga Sewa</th>

                  <th className="py-4 px-6 font-medium">Status</th>

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
                        <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-4 w-28 bg-slate-200 rounded-md"></div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-8 w-8 bg-slate-200 rounded-lg ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  // EMPTY
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Package size={48} strokeWidth={1} className="mb-4" />

                        <p className="text-slate-600 font-medium">
                          Belum ada produk
                        </p>

                        <p className="text-sm">
                          Silakan tambahkan produk baru untuk memulai.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // DATA
                  products.map((item, index) => (
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
                      {/* PRODUCT */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src={item.image_url ?? ""}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div>
                            <p className="font-medium text-slate-900 text-sm">
                              {item.name}
                            </p>

                            <p className="text-xs text-slate-500 mt-0.5">
                              Stok: {item.stock} unit
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CODE */}
                      <td className="py-4 px-6">
                        <span className="text-xs text-gray-900 font-medium tracking-wide">
                          {item.code}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-sm text-slate-700">
                          {item.category?.name || "-"}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-slate-900">
                          Rp {Number(item.price).toLocaleString("id-ID")}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-6">
                        {item.stock > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                            Tersedia
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                            Habis
                          </span>
                        )}
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
            className="bg-white w-full max-w-xl h-[90vh] rounded-3xl p-8 relative overflow-y-auto"
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
              {isEdit ? "Edit Product" : "Tambah Product"}
            </h2>

            {/* FORM */}
            <form
              onSubmit={isEdit ? handleUpdateProduct : handleCreateProduct}
              className="space-y-5"
            >
              {/* NAME */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Nama Product
                </label>

                <input
                  type="text"
                  placeholder="Masukkan nama product"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 border border-slate-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* CODE */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Kode Product
                </label>

                <input
                  type="text"
                  placeholder="PRD-001"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-14 border border-slate-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Category
                </label>

                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-14 border border-slate-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Pilih Category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* STOCK */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Stock
                </label>

                <input
                  type="number"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full h-14 border border-slate-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Description
                </label>

                <textarea
                  placeholder="Masukkan description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black min-h-[120px]"
                  required
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Harga Sewa
                </label>

                <input
                  type="number"
                  placeholder="100000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full h-14 border border-slate-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-14 border border-slate-200 rounded-2xl px-5 outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="available">Available</option>

                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              {/* IMAGE */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Upload Image
                </label>

                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      setImage(e.target.files[0]);
                    }
                  }}
                  className="w-full border border-slate-200 rounded-2xl p-4"
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
                  {isEdit ? "Update Product" : "Simpan Product"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
