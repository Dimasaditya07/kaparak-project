/* eslint-disable @next/next/no-img-element */
"use client";

import Navbar from "@/components/layout/navbar";
import { getCart } from "@/lib/query/carts";
import { CartItem } from "@/lib/query/carts.model";
import { useEffect, useState } from "react";
import { ShieldCheck, ArrowRight, ShoppingBag } from "lucide-react";
import axiosInstance from "@/lib/api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getCart();
        setCartItems(cart.cart_items ?? []);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.subtotal),
    0,
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleCheckout = async () => {
    try {
      const res = await axiosInstance.post("/checkout");

      window.snap.pay(res.data.snap_token, {
        onSuccess: () => {
          window.location.href = "/success";
        },
        onPending: () => {
          window.location.href = "/success?status=pending";
        },
        onError: () => {
          window.location.href = "/failed";
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main
      className="min-h-screen pt-28 pb-24"
      style={{ background: "#0a0a0a", color: "#fff" }}
    >
      {/* AMBIENT */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 15% 0%, rgba(74,222,128,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 85% 100%, rgba(74,222,128,0.04) 0%, transparent 60%)",
        }}
      />

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-5">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.4em]"
            style={{ color: "#4ade80" }}
          >
            Checkout
          </p>

          <h1
            className="font-black uppercase italic"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
          >
            Confirm
            <br />
            <span
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.2)",
                color: "transparent",
              }}
            >
              Order
            </span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.35)" }}>
            Review items sebelum pembayaran
          </p>
        </motion.div>

        {loading ? (
          <div
            className="rounded-2xl animate-pulse"
            style={{ height: 300, background: "rgba(255,255,255,0.04)" }}
          />
        ) : cartItems.length === 0 ? (
          <div className="text-center py-28">
            <ShoppingBag size={40} style={{ color: "rgba(255,255,255,0.2)" }} />
            <h2 className="mt-4 text-xl font-bold text-white/60">
              Keranjang kosong
            </h2>
            <button
              onClick={() => router.push("/product")}
              className="mt-6 px-6 py-3 rounded-xl font-bold uppercase tracking-wider"
              style={{
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                color: "#000",
              }}
            >
              Belanja dulu
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl p-5"
                    style={{
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.product.image_url}
                        className="w-24 h-24 object-cover rounded-xl"
                      />

                      <div className="flex-1">
                        <p className="text-xs text-green-400 uppercase tracking-widest">
                          {item.product.category?.name}
                        </p>

                        <h3 className="font-bold text-lg">
                          {item.product.name}
                        </h3>

                        <p className="text-xs text-white/40">
                          Qty {item.quantity} • {item.duration} hari
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-white/40">Subtotal</p>
                        <p className="font-bold text-green-400">
                          Rp {Number(item.subtotal).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* RIGHT */}
            <div
              className="lg:sticky lg:top-28 rounded-2xl p-6"
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 className="font-bold uppercase tracking-widest text-sm mb-6 text-white/70">
                Ringkasan
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="border-t border-white/10 my-5 pt-4 flex justify-between">
                <span className="uppercase text-white/50 text-xs">Total</span>
                <span className="text-green-400 font-black text-xl">
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 mb-5">
                <ShieldCheck className="text-green-400" />
                <p className="text-xs text-white/50">
                  Pembayaran aman via Midtrans
                </p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full h-12 rounded-xl font-bold uppercase tracking-widest"
                style={{
                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                  color: "#000",
                }}
              >
                Pay Now <ArrowRight className="inline ml-2" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
