"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Tenda Consina Magnum 4",
      category: "Camping Tent",
      price: 85000,
      qty: 1,
      days: 3,
      image: "/images/tenda.jpg",
    },
    {
      id: 2,
      name: "Carrier Eiger 60L",
      category: "Hiking Carrier",
      price: 45000,
      qty: 2,
      days: 2,
      image: "/images/carrier.jpg",
    },
  ]);

  const increaseQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty > 1 ? item.qty - 1 : 1,
            }
          : item,
      ),
    );
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty * item.days,
    0,
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center">
          <ShoppingCart className="text-emerald-600" size={30} />
        </div>

        <div>
          <h1 className="text-4xl font-black text-gray-900">
            Keranjang Reservasi
          </h1>

          <p className="text-gray-500 mt-1">
            Review perlengkapan sebelum checkout
          </p>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">
          {cartItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row gap-5">
                {/* IMAGE */}
                <div className="relative w-full lg:w-55 h-45 rounded-[1.5rem] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      {item.category}
                    </span>

                    <h2 className="text-2xl font-black text-gray-900 mt-4">
                      {item.name}
                    </h2>

                    <div className="flex items-center gap-2 mt-3 text-gray-500">
                      <CalendarDays size={16} />

                      <span className="text-sm">{item.days} Hari Rental</span>
                    </div>

                    <h3 className="text-emerald-600 font-black text-2xl mt-5">
                      Rp{item.price.toLocaleString("id-ID")}
                    </h3>

                    <p className="text-sm text-gray-400">/ hari</p>
                  </div>

                  {/* ACTION */}
                  <div className="flex flex-wrap items-center justify-between gap-5 mt-6">
                    {/* QTY */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
                      >
                        <Minus size={18} />
                      </button>

                      <span className="text-xl font-black w-8 text-center">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center hover:scale-105 transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* DELETE */}
                    <button className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-all">
                      <Trash2 size={18} />

                      <span className="text-sm font-semibold">Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm sticky top-6">
            <h2 className="text-2xl font-black text-gray-900 mb-7">
              Ringkasan Checkout
            </h2>

            <div className="space-y-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {item.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {item.qty} x {item.days} Hari
                    </p>
                  </div>

                  <span className="font-bold text-gray-900 text-sm">
                    Rp
                    {(item.price * item.qty * item.days).toLocaleString(
                      "id-ID",
                    )}
                  </span>
                </div>
              ))}

              <div className="border-t border-dashed border-gray-200 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-bold text-gray-900">
                    Rp{total.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-500">Biaya Admin</span>

                  <span className="font-bold text-gray-900">Rp5.000</span>
                </div>

                <div className="border-t border-dashed border-gray-200 mt-5 pt-5 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>

                  <span className="text-3xl font-black text-emerald-600">
                    Rp
                    {(total + 5000).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button className="w-full h-14 rounded-2xl bg-emerald-600 text-white font-bold hover:scale-[1.02] transition-all mt-4 flex items-center justify-center gap-2">
                Checkout Sekarang
                <ArrowRight size={18} />
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Pastikan tanggal reservasi dan jumlah alat sudah benar sebelum
                checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
