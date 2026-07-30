/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { Package, Plus, Edit, Trash2, X, Eye } from "lucide-react";
import { getProducts } from "@/lib/query/product";
import { ProductItem } from "@/lib/query/product.model";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from "@/lib/query/package";

import { PackageItem } from "@/lib/query/package.model";

const inter = Inter({
  subsets: ["latin"],
});

export default function PackagePage() {
  const router = useRouter();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductItem[]>([]);

  const [selectedProduct, setSelectedProduct] = useState("");

  const [qty, setQty] = useState(1);

  const [packageItems, setPackageItems] = useState<
    {
      product_id: number;
      name: string;
      price: number;
      quantity: number;
    }[]
  >([]);

  // modal
  const [openModal, setOpenModal] = useState(false);

  // edit
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchPackages();
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

  function resetForm() {
    setOpenModal(false);
    setIsEdit(false);
    setSelectedId(null);
  }

  const handleSubmit = async () => {
    try {
      if (packageItems.length === 0) {
        alert("Minimal pilih 1 produk");
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

      if (isEdit && selectedId) {
        await updatePackage(selectedId, payload);
      } else {
        await createPackage(payload);
      }

      await fetchPackages();

      resetForm();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan package");
    }
  };

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Yakin ingin menghapus paket?");

    if (!confirmDelete) return;

    try {
      await deletePackage(id);
      fetchPackages();
    } catch (error) {
      console.log(error);
    }
  }

  function removeProduct(id: number) {
    setPackageItems(packageItems.filter((item) => item.product_id !== id));
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

  function handleOpenEdit(item: PackageItem) {
    setSelectedId(item.id);
    setIsEdit(true);
    setOpenModal(true);
  }

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    package_price: "",
    status: "available",
    image: null as File | null,
  });

  const normalPrice = packageItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const saving = normalPrice - Number(form.package_price || 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  return (
    <div
      className={`${inter.className} flex-1 min-h-screen bg-slate-50 p-8 lg:p-12`}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Package Inventory
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              Kelola seluruh paket bundling
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setOpenModal(true);
            }}
            className="bg-black text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-all"
          >
            <Plus size={18} />
            Tambah Package
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="py-4 px-6 text-left">Package</th>

                  <th className="py-4 px-6 text-left">Harga Normal</th>

                  <th className="py-4 px-6 text-left">Harga Paket</th>

                  <th className="py-4 px-6 text-left">Status</th>

                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-6">
                        <div className="h-10 bg-slate-200 rounded" />
                      </td>

                      <td className="p-6">
                        <div className="h-6 bg-slate-200 rounded" />
                      </td>

                      <td className="p-6">
                        <div className="h-6 bg-slate-200 rounded" />
                      </td>

                      <td className="p-6">
                        <div className="h-6 bg-slate-200 rounded" />
                      </td>

                      <td className="p-6">
                        <div className="h-8 bg-slate-200 rounded" />
                      </td>
                    </tr>
                  ))
                ) : packages.length == 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20">
                      <div className="flex justify-center">
                        <img src="/images/empty.png" className="w-80" />
                      </div>
                    </td>
                  </tr>
                ) : (
                  packages.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      className="border-b last:border-none hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="text-slate-400" size={24} />
                            )}
                          </div>

                          <div>
                            <p className="font-semibold">{item.name}</p>

                            <p className="text-xs text-gray-500">{item.code}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6">
                        Rp {Number(item.normal_price).toLocaleString("id-ID")}
                      </td>

                      <td className="px-6 font-semibold text-green-600">
                        Rp {Number(item.package_price).toLocaleString("id-ID")}
                      </td>

                      <td className="px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "available"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/inventory/package/${item.id}`)
                            }
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={17} />
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
        {openModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
            <div
              className="
      relative
      w-full
      max-w-4xl
      max-h-[92vh]
      bg-white
      rounded-[2rem]
      shadow-2xl
      flex
      flex-col
      overflow-hidden
    "
            >
              {/* HEADER */}
              <div className="sticky top-0 z-20 bg-white border-b px-8 py-6">
                <button
                  onClick={resetForm}
                  className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={22} />
                </button>

                <h2 className="text-3xl font-black text-gray-900">
                  {isEdit ? "Edit Package" : "Tambah Package"}
                </h2>

                <p className="text-gray-500 mt-2">
                  Kelola paket bundling perlengkapan outdoor.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Kode Paket
                    </label>

                    <input
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      placeholder="PKT-001"
                      className="w-full mt-2 rounded-xl border border-gray-300 px-4 h-12 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Nama Paket
                    </label>

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Camping Basic"
                      className="w-full mt-2 rounded-xl border border-gray-300 px-4 h-12 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="text-sm font-semibold text-gray-700">
                    Deskripsi
                  </label>

                  <textarea
                    rows={4}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Isi deskripsi paket"
                    className="w-full mt-2 rounded-xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="text-sm font-semibold">Harga Paket</label>

                    <input
                      name="package_price"
                      type="number"
                      value={form.package_price}
                      onChange={handleChange}
                      placeholder="150000"
                      className="w-full mt-2 rounded-xl border border-gray-300 px-4 h-12"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Status</label>

                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,

                          status: e.target.value,
                        })
                      }
                      className="w-full mt-2 rounded-xl border border-gray-300 px-4 h-12"
                    >
                      <option value="available">Available</option>

                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="text-sm font-semibold">Gambar Paket</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="block mt-3"
                  />

                  {form.image && (
                    <div className="mt-5">
                      <img
                        src={URL.createObjectURL(form.image)}
                        className="w-48 h-48 rounded-2xl object-cover border"
                      />
                    </div>
                  )}
                  <hr className="my-8" />
                  <h3 className="text-lg font-bold mb-5">Produk Dalam Paket</h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="border rounded-xl h-12 px-4"
                    >
                      <option value="">Pilih Produk</option>

                      {products.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="border rounded-xl h-12 px-4"
                    />

                    <button
                      onClick={addProductToPackage}
                      className="bg-emerald-600 rounded-xl text-white"
                    >
                      Tambah Produk
                    </button>
                  </div>
                  <div className="mt-6 border rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="py-3">Produk</th>

                          <th>Harga</th>

                          <th>Qty</th>

                          <th>Subtotal</th>

                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        {packageItems.map((item) => (
                          <tr key={item.product_id} className="border-t">
                            <td className="p-4">{item.name}</td>

                            <td>
                              Rp
                              {item.price.toLocaleString("id-ID")}
                            </td>

                            <td>{item.quantity}</td>

                            <td>
                              Rp
                              {(item.price * item.quantity).toLocaleString(
                                "id-ID",
                              )}
                            </td>

                            <td>
                              <button
                                onClick={() => removeProduct(item.product_id)}
                                className="text-red-500"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-8 rounded-2xl bg-slate-50 border p-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Harga Normal</span>

                    <span className="font-bold">
                      Rp {normalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between mt-3">
                    <span className="text-gray-500">Harga Paket</span>

                    <span className="font-bold text-emerald-600">
                      Rp
                      {Number(form.package_price || 0).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between mt-3">
                    <span className="text-gray-500">Hemat</span>

                    <span className="font-bold text-red-500">
                      Rp {saving.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                <div className="border-t bg-white px-8 py-5 flex justify-end gap-4">
                  <button
                    onClick={resetForm}
                    className="px-6 h-12 rounded-xl border hover:bg-gray-50"
                  >
                    Batal
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="px-8 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    {isEdit ? "Update Package" : "Simpan Package"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
