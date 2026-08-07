/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ImagePlus, Loader2, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import { createProduct } from "@/lib/query/product";
import { getCategories } from "@/lib/query/category";
import { CategoryItem } from "@/lib/query/category.model";

export default function CreateProductPage() {
  const router = useRouter();

  // STATES
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // FORM STATES
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [stock, setStock] = useState<number | "">(0);
  const [price, setPrice] = useState<number | "">(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("available");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
    }
  }

  // HANDLE IMAGE PREVIEW
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleRemoveImage() {
    setImage(null);
    setImagePreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("code", code);
      formData.append("stock", stock.toString());
      formData.append("price", price.toString());
      formData.append("category_id", categoryId);
      formData.append("description", description);
      formData.append("status", status);

      if (image instanceof Blob) {
        formData.append("image", image);
      }

      await createProduct(formData);

      toast.success("Produk berhasil ditambahkan.", {
        description: `"${name}" telah ditambahkan ke inventaris.`,
      });

      router.push("/admin/inventory/product");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);

        toast.error("Gagal menambahkan produk.", {
          description:
            error.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan produk.",
        });
      } else {
        console.error(error);

        toast.error("Gagal menambahkan produk.", {
          description: "Terjadi kesalahan saat menyimpan data produk.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans antialiased text-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER SECTION (IDENTIK DENGAN TAMBAH PACKAGE) */}
        <div>
          <button
            type="button"
            onClick={() => router.push("/admin/inventory/product")}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Produk
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Tambah Produk
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Buat dan kelola unit peralatan outdoor baru ke dalam sistem
                inventaris.
              </p>
            </div>
          </div>
        </div>

        {/* MAIN FORM CARD */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            {/* INFORMASI PRODUK */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900 uppercase">
                  Informasi Produk
                </h2>
              </div>

              {/* NAMA PRODUK */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Nama Produk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tenda Arpenaz 4.1 Family"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                />
              </div>

              {/* KODE & KATEGORI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Kode Produk / SKU <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="PRD-001"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-md border border-slate-200 font-mono text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* HARGA, STOK & STATUS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Harga Sewa / Hari (Rp){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="100000"
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    required
                    className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Stok <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={stock}
                    onChange={(e) =>
                      setStock(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    required
                    className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                  >
                    <option value="available">Tersedia</option>
                    <option value="unavailable">Habis</option>
                  </select>
                </div>
              </div>

              {/* DESKRIPSI */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Deskripsi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder="Tuliskan spesifikasi atau deskripsi rinci tentang produk..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-3 rounded-md border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all resize-y"
                />
              </div>
            </div>

            {/* FOTO PRODUK */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block">
                Foto Produk
              </label>

              {imagePreview ? (
                <div className="relative w-full max-w-xs rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group">
                  <img
                    src={imagePreview}
                    alt="Preview produk"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full backdrop-blur-sm transition-colors cursor-pointer"
                    title="Hapus foto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 rounded-lg hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-9 h-9 mb-2 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <ImagePlus className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      Klik untuk unggah gambar
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PNG, JPG, atau WEBP (Maks. 2MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/admin/inventory/product")}
              className="h-9 px-4 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-9 px-5 rounded-md bg-slate-900 text-white text-xs font-medium shadow hover:bg-slate-800 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan Produk</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
