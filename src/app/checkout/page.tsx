/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import Navbar from "@/components/layout/navbar";
import { getCheckoutSummary, checkout } from "@/lib/query/checkout";
import { CartItem } from "@/lib/query/carts.model";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Package as PackageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Info tampilan yang seragam, apapun jenis item-nya (produk satuan atau paket)
// Disamakan dengan helper di cart/page.tsx
type CartItemDisplay = {
  type: "product" | "package";
  name: string;
  imageUrl: string | null;
  subLabel: string;
};

function getCartItemDisplay(item: CartItem): CartItemDisplay {
  if (item.package) {
    return {
      type: "package",
      name: item.package.name,
      imageUrl: item.package.image_url ?? null,
      subLabel: `Paket · ${item.package.packageItems?.length ?? 0} Barang`,
    };
  }

  if (item.product) {
    return {
      type: "product",
      name: item.product.name,
      imageUrl: item.product.image_url ?? null,
      subLabel: item.product.category?.name || "Outdoor Equipment",
    };
  }

  return {
    type: "product",
    name: "Item tidak dikenal",
    imageUrl: null,
    subLabel: "—",
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [eligibleDiscount, setEligibleDiscount] = useState(false);

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const data = await getCheckoutSummary();

        setCartItems(data.cart_items);
        setDiscount(data.discount);
        setGrandTotal(data.grand_total);
        setEligibleDiscount(data.eligible_discount);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckout();
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.subtotal),
    0,
  );
  useEffect(() => {
    setGrandTotal(subtotal);
  }, [subtotal]);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleCheckout = async () => {
    try {
      const res = await checkout();

      window.snap.pay(res.snap_token, {
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
            Konfirmasi
            <br />
            <span
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.2)",
                color: "transparent",
              }}
            >
              Pesanan
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
                {cartItems.map((item) => {
                  const display = getCartItemDisplay(item);

                  return (
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
                        {display.imageUrl ? (
                          <img
                            src={display.imageUrl}
                            className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                          />
                        ) : (
                          <div
                            className="w-24 h-24 rounded-xl flex-shrink-0 flex items-center justify-center"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              color: "rgba(255,255,255,0.2)",
                            }}
                          >
                            <PackageIcon size={28} />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-green-400 uppercase tracking-widest">
                            {display.subLabel}
                          </p>

                          <h3 className="font-bold text-lg truncate">
                            {display.name}
                          </h3>

                          <p className="text-xs text-white/40">
                            Qty {item.quantity} • {item.duration} hari
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-white/40">Subtotal</p>
                          <p className="font-bold text-green-400">
                            Rp {Number(item.subtotal).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
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

                {eligibleDiscount && discount > 0 && (
                  <>
                    <div className="flex justify-between text-green-400">
                      <span>Diskon Loyalitas (10%)</span>
                      <span>- Rp {discount.toLocaleString("id-ID")}</span>
                    </div>

                    <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3">
                      <p className="text-xs text-green-300">
                        Selamat! kamu mendapatkan diskon 10% Karena Anda telah
                        melakukan 3x penyewaan di KAPARAK OUTDOOR, pembelian
                        ke-4 dan seterusnya dengan total di atas Rp150.000 kamu
                        mendapatkan diskon 10%.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-white/10 my-5 pt-4 flex justify-between">
                <span className="uppercase text-white/50 text-xs">Total</span>

                <span className="text-green-400 font-black text-xl">
                  Rp {grandTotal.toLocaleString("id-ID")}
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
