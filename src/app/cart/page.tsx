/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import axiosInstance from "@/lib/api/axios";
import { Trash2, ShoppingBag, CalendarDays } from "lucide-react";
import { CartItem } from "@/lib/query/carts.model";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setCartItems(
        res.data?.data?.cartItems ?? res.data?.data?.cart_items ?? [],
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchCart();
  }, [router, token]);

  const handleRemove = async (id: number) => {
    setRemovingId(id);
    try {
      await axiosInstance.delete(`/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.subtotal),
    0,
  );

  const totalDays = cartItems.reduce(
    (acc, item) => acc + (item.duration || 0),
    0,
  );

  return (
    <main
      className="min-h-screen pt-28 pb-24"
      style={{ background: "#0a0a0a", color: "#fff" }}
    >
      {/* AMBIENT */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 15% 0%, rgba(74,222,128,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 85% 100%, rgba(74,222,128,0.04) 0%, transparent 60%)",
        }}
      />

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-1.5 h-7 rounded-full"
              style={{
                background: "linear-gradient(180deg, #4ade80 0%, #16a34a 100%)",
              }}
            />
            <p
              className="text-[10px] font-bold uppercase tracking-[0.4em]"
              style={{ color: "#4ade80" }}
            >
              Rental Cart
            </p>
          </div>

          <h1
            className="font-black uppercase italic leading-[0.85] mb-3"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
          >
            Your
            <br />
            <span
              style={{
                WebkitTextStroke: "2px rgba(255,255,255,0.2)",
                color: "transparent",
              }}
            >
              Cart
            </span>
          </h1>

          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            Review peralatan rental sebelum melanjutkan pembayaran
          </p>
        </motion.div>

        {/* LOADING */}
        {loading ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: "rgba(255,255,255,0.04)", height: 200 }}
                />
              ))}
            </div>
            <div
              className="rounded-2xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)", height: 320 }}
            />
          </div>
        ) : cartItems.length === 0 ? (
          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-7"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <ShoppingBag
                size={40}
                style={{ color: "rgba(255,255,255,0.2)" }}
              />
            </div>
            <h2
              className="text-2xl font-bold mb-2.5"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Keranjang Masih Kosong
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Belum ada produk yang ditambahkan ke keranjang
            </p>
            <button
              onClick={() => router.push("/product")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-[0.2em] transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "#0a0a0a",
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Jelajahi Produk
            </button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30, scale: 0.97 }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    className="overflow-hidden"
                    style={{
                      borderRadius: "1.5rem",
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* IMAGE */}
                      <div
                        className="relative w-full sm:w-48 flex-shrink-0 overflow-hidden"
                        style={{ minHeight: 192 }}
                      >
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          style={{ minHeight: 192 }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to right, transparent 60%, rgba(17,17,17,0.5) 100%)",
                          }}
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <p
                              className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5"
                              style={{ color: "#4ade80" }}
                            >
                              {item.product.category?.name ||
                                "Outdoor Equipment"}
                            </p>
                            <h2
                              className="text-xl font-black leading-tight"
                              style={{ color: "#fff" }}
                            >
                              {item.product.name}
                            </h2>
                            <p
                              className="text-xs mt-1"
                              style={{ color: "rgba(255,255,255,0.35)" }}
                            >
                              {item.quantity} unit
                            </p>
                          </div>

                          {/* DELETE */}
                          <button
                            onClick={() => handleRemove(item.id)}
                            disabled={removingId === item.id}
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-40"
                            style={{
                              background: "rgba(239,68,68,0.1)",
                              border: "1px solid rgba(239,68,68,0.2)",
                              color: "#f87171",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(239,68,68,0.2)";
                              e.currentTarget.style.borderColor =
                                "rgba(239,68,68,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(239,68,68,0.1)";
                              e.currentTarget.style.borderColor =
                                "rgba(239,68,68,0.2)";
                            }}
                          >
                            {removingId === item.id ? (
                              <span
                                className="w-3.5 h-3.5 rounded-full"
                                style={{
                                  border: "1.5px solid rgba(248,113,113,0.3)",
                                  borderTop: "1.5px solid #f87171",
                                  animation: "spin 0.8s linear infinite",
                                  display: "inline-block",
                                }}
                              />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>

                        {/* DETAILS GRID */}
                        <div
                          className="grid grid-cols-3 gap-3 p-4 rounded-xl mb-4"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <div>
                            <p
                              className="text-[10px] uppercase tracking-[0.2em] mb-1"
                              style={{ color: "rgba(255,255,255,0.3)" }}
                            >
                              Durasi
                            </p>
                            <p
                              className="text-sm font-bold"
                              style={{ color: "rgba(255,255,255,0.8)" }}
                            >
                              {item.duration} Hari
                            </p>
                          </div>
                          <div>
                            <p
                              className="text-[10px] uppercase tracking-[0.2em] mb-1"
                              style={{ color: "rgba(255,255,255,0.3)" }}
                            >
                              Per Hari
                            </p>
                            <p
                              className="text-sm font-bold"
                              style={{ color: "rgba(255,255,255,0.8)" }}
                            >
                              Rp{" "}
                              {Number(item.product.price).toLocaleString(
                                "id-ID",
                              )}
                            </p>
                          </div>
                          <div>
                            <p
                              className="text-[10px] uppercase tracking-[0.2em] mb-1"
                              style={{ color: "rgba(255,255,255,0.3)" }}
                            >
                              Unit
                            </p>
                            <p
                              className="text-sm font-bold"
                              style={{ color: "rgba(255,255,255,0.8)" }}
                            >
                              {item.quantity}x
                            </p>
                          </div>
                        </div>

                        {/* DATE + SUBTOTAL */}
                        <div className="flex items-end justify-between gap-4">
                          <div
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            <CalendarDays
                              size={13}
                              style={{
                                color: "rgba(255,255,255,0.35)",
                                flexShrink: 0,
                              }}
                            />
                            <span
                              className="text-xs"
                              style={{ color: "rgba(255,255,255,0.45)" }}
                            >
                              {item.start_date} — {item.end_date}
                            </span>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p
                              className="text-[10px] uppercase tracking-[0.15em] mb-0.5"
                              style={{ color: "rgba(255,255,255,0.3)" }}
                            >
                              Subtotal
                            </p>
                            <p
                              className="text-xl font-black"
                              style={{ color: "#4ade80" }}
                            >
                              Rp {Number(item.subtotal).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ORDER SUMMARY */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div
                className="lg:sticky lg:top-28 rounded-2xl p-6"
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* TITLE */}
                <div className="flex items-center gap-2 mb-7">
                  <div
                    className="w-1 h-5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(180deg, #4ade80 0%, #16a34a 100%)",
                    }}
                  />
                  <h2
                    className="font-bold text-sm uppercase tracking-[0.2em]"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Ringkasan Pesanan
                  </h2>
                </div>

                {/* ITEMS LIST */}
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
                          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span
                          className="text-xs truncate"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          {item.product.name}
                        </span>
                      </div>
                      <span
                        className="text-xs font-semibold flex-shrink-0"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        Rp {Number(item.subtotal).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* STATS */}
                <div
                  className="grid grid-cols-2 gap-3 p-4 rounded-xl mb-6"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {[
                    {
                      label: "Total Item",
                      value: `${cartItems.length} produk`,
                    },
                    { label: "Total Hari", value: `${totalDays} hari` },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p
                        className="text-[10px] uppercase tracking-[0.2em] mb-1"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {s.label}
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div
                  className="flex items-center justify-between pt-5 mb-7"
                  style={{ borderTop: "1px dashed rgba(255,255,255,0.1)" }}
                >
                  <span
                    className="text-sm font-bold uppercase tracking-[0.15em]"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Grand Total
                  </span>
                  <motion.span
                    key={totalPrice}
                    initial={{ opacity: 0.5, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black"
                    style={{ color: "#4ade80" }}
                  >
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </motion.span>
                </div>

                {/* CHECKOUT BUTTON */}
                <button
                  onClick={() => router.push("/checkout")}
                  className="relative w-full h-14 rounded-xl font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-200 active:scale-[0.99]"
                  style={{
                    background:
                      "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    color: "#0a0a0a",
                    border: "1px solid rgba(74,222,128,0.3)",
                  }}
                >
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2.5s infinite",
                    }}
                  />
                  <span className="relative flex items-center justify-center gap-2.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.75L21 12m0 0-3.75 3.25M21 12H3"
                      />
                    </svg>
                    Checkout Rental
                  </span>
                </button>

                {/* CONTINUE SHOPPING */}
                <button
                  onClick={() => router.push("/product")}
                  className="w-full h-11 mt-3 rounded-xl text-xs font-medium uppercase tracking-[0.2em] transition-all duration-200"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                  }}
                >
                  Lanjut Belanja
                </button>

                {/* TRUST NOTE */}
                <p
                  className="text-center text-xs mt-4"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  Pembayaran aman &amp; terenkripsi
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </main>
  );
}
