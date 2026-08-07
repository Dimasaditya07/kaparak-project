/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Package as PackageIcon,
  Upload,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { getProducts } from "@/lib/query/product";
import { ProductItem } from "@/lib/query/product.model";
import { getPackage, updatePackage } from "@/lib/query/package";
import { PackageItem } from "@/lib/query/package.model";
import { toast } from "sonner";

type PackageFormItem = {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function EditPackagePage() {
  const router = useRouter();
  const params = useParams();

  const [pkg, setPkg] = useState<PackageItem | null>(null);
  const [loadingPkg, setLoadingPkg] = useState(true);

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

  useEffect(() => {
    if (params.id) fetchPackageDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function fetchProducts() {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchPackageDetail() {
    try {
      const res = await getPackage(Number(params.id));
      const data = res.data;

      setPkg(data);
      setForm({
        code: data.code,
        name: data.name,
        description: data.description ?? "",
        package_price: data.package_price?.toString() ?? "",
        status: data.status,
        image: null,
      });
      setPackageItems(
        (data.packageItems ?? []).map((pi) => ({
          product_id: pi.product_id,
          name: pi.product.name,
          price: Number(pi.product.price),
          quantity: pi.quantity,
        })),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPkg(false);
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
      toast.warning("Produk sudah ada di dalam paket.");
      return;
    }

    setPackageItems([
      ...packageItems,
      {
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: qty > 0 ? qty : 1,
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
    if (!e.target.files || e.target.files.length === 0) return;
    setForm({ ...form, image: e.target.files[0] });
  };

  const normalPrice = packageItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const saving = normalPrice - Number(form.package_price || 0);

  const handleSubmit = async () => {
    if (!pkg) return;

    if (packageItems.length === 0) {
      toast.warning("Minimal pilih 1 produk untuk paket ini.");
      return;
    }

    if (!form.code || !form.name || !form.package_price) {
      toast.error("Lengkapi kode, nama, dan harga paket terlebih dahulu.");
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
      await updatePackage(pkg.id, payload);
      toast.success("Paket berhasil diperbarui.");
      router.push("/admin/inventory/package");
    } catch (error: any) {
      console.error(error);
      const message =
        error.response?.data?.message ??
        "Terjadi kesalahan saat menyimpan paket.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const previewImageUrl = form.image
    ? URL.createObjectURL(form.image)
    : (pkg?.image_url ?? null);

  if (loadingPkg) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 font-sans text-slate-950">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-96 bg-slate-200 rounded-xl animate-pulse" />
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
            Data paket yang ingin diubah tidak tersedia atau ID tidak valid.
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BACK BUTTON & HEADER */}
        <div>
          <button
            onClick={() => router.push("/admin/inventory/package")}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Paket
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Edit Paket Bundling
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Perbarui informasi, harga, dan kombinasi produk untuk paket ini.
              </p>
            </div>
          </div>
        </div>

        {/* MAIN FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* CARD 1: INFORMASI UTAMA & GAMBAR */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-semibold text-slate-900 text-base">
                Informasi Utama
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kode unik dan detail rincian paket bundling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* KODE PAKET */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Kode Paket <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="PKT-001"
                  className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                />
              </div>

              {/* NAMA PAKET */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Nama Paket <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Paket Camping Starter"
                  className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* DESKRIPSI */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Deskripsi Paket
              </label>
              <textarea
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tuliskan deskripsi lengkap mengenai paket ini..."
                className="w-full p-3 rounded-md border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all leading-relaxed"
              />
            </div>

            {/* STATUS & GAMBAR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
              {/* STATUS */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Status Ketersediaan
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all cursor-pointer"
                >
                  <option value="available">Tersedia</option>
                  <option value="inactive">Habis</option>
                </select>
              </div>

              {/* GAMBAR */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Gambar Sampul Paket
                </label>
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                    {previewImageUrl ? (
                      <img
                        src={previewImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PackageIcon className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      Ganti Gambar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Format PNG, JPG, atau WEBP. Maksimal 2MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: KOMPONEN PRODUK DALAM PAKET */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900 text-base">
                  Komponen Produk
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih barang-barang perlengkapan yang dimasukkan ke dalam
                  paket.
                </p>
              </div>
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                {packageItems.length} Produk
              </span>
            </div>

            {/* SELECTION BAR */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="sm:col-span-6">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all cursor-pointer"
                >
                  <option value="">Pilih Peralatan</option>
                  {products.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - (Rp{" "}
                      {Number(item.price).toLocaleString("id-ID")})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  placeholder="Qty"
                  className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={addProductToPackage}
                  className="w-full h-9 inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-900 text-white text-xs font-medium shadow hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>
            </div>

            {/* TABLE PRODUK TERPILIH */}
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                    <th className="py-2.5 px-4">Nama Produk</th>
                    <th className="py-2.5 px-4">Harga Satuan</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Subtotal</th>
                    <th className="py-2.5 px-4 text-center w-12">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {packageItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-slate-400 font-medium"
                      >
                        Belum ada produk yang ditambahkan ke paket ini.
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
                        <td className="py-3 px-4 text-center font-medium text-slate-900">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-900">
                          Rp{" "}
                          {(item.price * item.quantity).toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => removeProduct(item.product_id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus produk"
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

          {/* CARD 3: RINCIAN KALKULASI HARGA & FOOTER ACTION */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center gap-2">
              <h2 className="font-semibold text-slate-900 text-base">
                Kalkulasi Harga Paket
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              {/* INPUT HARGA PAKET */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Harga Penjualan Paket (Rp){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    name="package_price"
                    value={form.package_price}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* RINGKASAN HEMAT */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Harga Normal</span>
                  <span className="font-medium text-slate-700">
                    Rp {normalPrice.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium">
                    Potongan (Hemat)
                  </span>
                  <span
                    className={`font-semibold ${
                      saving > 0 ? "text-emerald-600" : "text-slate-600"
                    }`}
                  >
                    Rp {saving.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin/inventory/package")}
                className="h-9 px-4 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="h-9 px-5 rounded-md bg-slate-900 text-white text-xs font-medium shadow hover:bg-slate-800 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Update Paket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
