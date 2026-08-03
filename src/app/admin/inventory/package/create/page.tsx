/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Package as PackageIcon,
} from "lucide-react";
import { getProducts } from "@/lib/query/product";
import { ProductItem } from "@/lib/query/product.model";
import { createPackage } from "@/lib/query/package";

type PackageFormItem = {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function CreatePackagePage() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [packageItems, setPackageItems] = useState<PackageFormItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<{
    code: string;
    name: string;
    description: string;
    package_price: string;
    status: string;
    image: File | null;
  }>({
    code: "",
    name: "",
    description: "",
    package_price: "",
    status: "available",
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  function addProductToPackage() {
    if (!selectedProduct) return;

    const product = products.find(
      (item) => item.id === Number(selectedProduct),
    );

    if (!product) return;

    const exists = packageItems.find((item) => item.product_id === product.id);

    if (exists) {
      alert("Produk sudah dipilih");
      return;
    }

    setPackageItems([
      ...packageItems,
      {
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: qty,
      },
    ]);

    setSelectedProduct("");
    setQty(1);
  }

  function removeProduct(id: number) {
    setPackageItems(packageItems.filter((item) => item.product_id !== id));
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setForm({ ...form, image: e.target.files[0] });
  };

  const normalPrice = packageItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const saving = normalPrice - Number(form.package_price || 0);

  const handleSubmit = async () => {
    if (packageItems.length === 0) {
      alert("Minimal pilih 1 produk");
      return;
    }

    if (!form.code || !form.name || !form.package_price) {
      alert("Lengkapi kode, nama, dan harga paket terlebih dahulu");
      return;
    }

    const payload = {
      code: form.code,
      name: form.name,
      description: form.description,
      image: form.image,
      package_price: Number(form.package_price),
      status: form.status as "available" | "inactive",
      products: packageItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    setSubmitting(true);

    try {
      await createPackage(payload);
      router.push("/admin/inventory/package");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan package");
    } finally {
      setSubmitting(false);
    }
  };

  const previewImageUrl = form.image ? URL.createObjectURL(form.image) : null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 font-sans antialiased text-slate-950">
      {/* Container diperlebar ke max-w-6xl */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* BACK BUTTON & HEADER */}
        <div>
          <button
            onClick={() => router.push("/admin/inventory/package")}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Paket
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Tambah Package
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Buat dan kelola paket bundling perlengkapan outdoor baru.
              </p>
            </div>
          </div>
        </div>

        {/* MAIN FORM CARD */}
        <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            {/* INFORMASI UTAMA PAKET */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight border-b border-slate-100 pb-3 text-slate-900">
                Informasi Paket
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kode Paket */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-slate-700">
                    Kode Paket <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g. PKT-001"
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  />
                </div>

                {/* Nama Paket */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-slate-700">
                    Nama Paket <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Camping Family Basic"
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-slate-700">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tuliskan deskripsi lengkap mengenai paket bundling ini..."
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Harga Paket */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-slate-700">
                    Harga Paket (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="package_price"
                    type="number"
                    value={form.package_price}
                    onChange={handleChange}
                    placeholder="150000"
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-slate-700">
                    Status Availability
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  >
                    <option value="available">Tersedia</option>
                    <option value="inactive">Habis</option>
                  </select>
                </div>
              </div>

              {/* Gambar Paket */}
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium leading-none text-slate-700">
                  Gambar Paket
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white shadow-sm hover:bg-slate-100 h-9 px-4 py-2 transition-colors">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="hidden"
                    />
                  </label>
                  {form.image && (
                    <span className="text-xs text-slate-500 truncate max-w-xs">
                      {form.image.name}
                    </span>
                  )}
                </div>

                {previewImageUrl && (
                  <div className="mt-3">
                    <div className="relative w-36 h-36 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
                      <img
                        src={previewImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PRODUK DALAM PAKET */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold tracking-tight border-b border-slate-100 pb-3 text-slate-900">
                Isi Perlengkapan Paket
              </h2>

              {/* Form Tambah Item */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-slate-50/70 p-4 rounded-lg border border-slate-200/80">
                <div className="md:col-span-6 space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Pilih Produk
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  >
                    <option value="">Pilih Item Equipment</option>
                    {products.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (Rp{" "}
                        {Number(item.price).toLocaleString("id-ID")})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Jumlah (Qty)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  />
                </div>

                <div className="md:col-span-3">
                  <button
                    type="button"
                    onClick={addProductToPackage}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-md text-sm font-medium bg-black text-white shadow hover:bg-emerald-700 h-9 px-4 py-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Tabel Produk Pilihan */}
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                      <th className="py-3 px-4 text-left">Produk</th>
                      <th className="py-3 px-4 text-left">Harga Satuan</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      <th className="py-3 px-4 text-left">Subtotal</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {packageItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-8 text-slate-400 text-sm"
                        >
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <PackageIcon className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                            <span>
                              Belum ada produk yang ditambahkan ke paket.
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      packageItems.map((item) => (
                        <tr
                          key={item.product_id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-slate-900">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            Rp {item.price.toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-slate-900">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            Rp{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "id-ID",
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => removeProduct(item.product_id)}
                              className="inline-flex items-center justify-center rounded-md p-1.5 text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Hapus item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RINGKASAN KALKULASI HARGA */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 space-y-3 max-w-md ml-auto">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
                Ringkasan Kalkulasi
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Harga Normal</span>
                <span className="font-semibold text-slate-900">
                  Rp {normalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Harga Paket Bundling</span>
                <span className="font-bold text-emerald-600">
                  Rp {Number(form.package_price || 0).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                <span className="text-slate-600">Hemat Pelanggan</span>
                <span className="font-semibold text-rose-600">
                  Rp {saving > 0 ? saving.toLocaleString("id-ID") : 0}
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="border-t border-slate-200 bg-slate-50/50 px-6 md:px-8 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/inventory/package")}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white shadow-sm hover:bg-slate-100 h-9 px-4 py-2 transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90 h-9 px-5 py-2 transition-colors disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan Package"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
