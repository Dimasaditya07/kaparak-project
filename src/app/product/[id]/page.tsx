/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useRouter } from "next/navigation";
import { getProductDetail } from "@/lib/query/product";
import { ProductItem } from "@/lib/query/product.model";
import { addToCart } from "@/lib/query/carts";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductDetail(params.id as string);
        setProduct(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const duration = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 ? diff + 1 : 0;
  }, [startDate, endDate]);

  const subtotal = useMemo(() => {
    if (!product) return 0;
    return Number(product.price) * quantity * duration;
  }, [product, quantity, duration]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/login?redirect=/product/${product?.id}`);
      return;
    }
    if (!product) return;
    if (!startDate || !endDate) {
      alert("Pilih tanggal rental terlebih dahulu");
      return;
    }
    try {
      setAdding(true);
      await addToCart({
        product_id: product.id,
        quantity,
        start_date: startDate,
        end_date: endDate,
      });
      setAdded(true);
      setTimeout(() => {
        router.push("/cart");
      }, 800);
    } catch (error) {
      console.error("ADD CART ERROR", error);
      setAdding(false);
    }
  };

  /* ── LOADING STATE ── */
  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col justify-center items-center"
        style={{ background: "#0a0a0a" }}
      >
        <div
          className="w-10 h-10 rounded-full mb-5"
          style={{
            border: "1.5px solid rgba(255,255,255,0.08)",
            borderTop: "1.5px solid #4ade80",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <p
          className="text-xs font-medium uppercase tracking-[0.3em]"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Memuat Produk
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── NOT FOUND STATE ── */
  if (!product) {
    return (
      <div
        className="min-h-screen flex justify-center items-center"
        style={{ background: "#0a0a0a" }}
      >
        <div
          className="text-center p-10 rounded-3xl max-w-sm"
          style={{
            background: "#111",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <svg
              className="w-7 h-7"
              style={{ color: "rgba(255,255,255,0.3)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="font-bold text-lg mb-1.5" style={{ color: "#fff" }}>
            Produk Tidak Ditemukan
          </p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Pastikan kembali URL atau ID produk yang Anda tuju sudah benar.
          </p>
        </div>
      </div>
    );
  }

  const isReady = duration > 0 && product.stock > 0;

  return (
    <div
      className="min-h-screen antialiased"
      style={{ background: "#0a0a0a", color: "#fff" }}
    >
      {/* AMBIENT BG */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 10% 0%, rgba(74,222,128,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(74,222,128,0.04) 0%, transparent 60%)",
        }}
      />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 pb-28">
        {/* BREADCRUMB */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-10"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] transition-colors duration-200 group"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
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
            Kembali
          </button>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
          <span
            className="text-xs uppercase tracking-[0.25em]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            {product.category?.name || "Produk"}
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
          <span
            className="text-xs uppercase tracking-[0.25em] truncate max-w-[180px]"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {product.name}
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ── LEFT: IMAGE ── */}
          <motion.div
            className="lg:col-span-7 lg:sticky lg:top-28"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              className="relative overflow-hidden group"
              style={{
                borderRadius: "2rem",
                background: "#111",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {product.image_url ? (
                <>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    style={{ aspectRatio: "4/5" }}
                  />
                  {/* Overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                    }}
                  />
                  {/* Hover tint */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(74,222,128,0.06) 0%, transparent 60%)",
                    }}
                  />
                </>
              ) : (
                <div
                  className="flex flex-col items-center justify-center"
                  style={{ aspectRatio: "4/5", color: "rgba(255,255,255,0.2)" }}
                >
                  <svg
                    className="w-16 h-16 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5A.75.75 0 0121 3.75v16.5A.75.75 0 0120.25 21H3.75A.75.75 0 013 20.25V3.75A.75.75 0 013.75 3z"
                    />
                  </svg>
                  <span className="text-xs uppercase tracking-wider">
                    No Image
                  </span>
                </div>
              )}

              {/* BOTTOM BADGE OVERLAY */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <div
                  className="px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {product.code}
                </div>
                <div
                  className="px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background:
                      product.stock > 5
                        ? "rgba(74,222,128,0.2)"
                        : product.stock > 0
                          ? "rgba(251,146,60,0.2)"
                          : "rgba(239,68,68,0.2)",
                    border: `1px solid ${product.stock > 5 ? "rgba(74,222,128,0.35)" : product.stock > 0 ? "rgba(251,146,60,0.35)" : "rgba(239,68,68,0.35)"}`,
                    color:
                      product.stock > 5
                        ? "#4ade80"
                        : product.stock > 0
                          ? "#fb923c"
                          : "#f87171",
                  }}
                >
                  {product.stock > 0 ? `Stok ${product.stock}` : "Habis"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: CONTENT ── */}
          <motion.div
            className="lg:col-span-5 space-y-7"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* PRODUCT HEADER */}
            <div
              className="pb-7"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* CATEGORY PILL */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.25em]"
                  style={{
                    background: "rgba(74,222,128,0.12)",
                    border: "1px solid rgba(74,222,128,0.25)",
                    color: "#4ade80",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#4ade80" }}
                  />
                  {product.category?.name || "Outdoor Equipment"}
                </div>
              </div>

              <h1
                className="font-black uppercase italic leading-[0.9] mb-5"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                {product.name}
              </h1>

              {/* PRICE */}
              <div className="flex items-baseline gap-3">
                <span
                  className="text-xs font-medium uppercase tracking-[0.2em]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Mulai dari
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-black text-3xl"
                    style={{ color: "#fff" }}
                  >
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    /hari
                  </span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Deskripsi Produk
              </p>
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}
              >
                {product.description || "Tidak ada deskripsi untuk produk ini."}
              </p>
            </div>

            {/* SPECS ROW */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Kode", value: product.code },
                { label: "Kategori", value: product.category?.name || "-" },
                { label: "Tersedia", value: `${product.stock} unit` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl text-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] mb-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-xs font-bold truncate"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ── RENTAL FORM CARD ── */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div
                  className="w-1 h-5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, #4ade80 0%, #16a34a 100%)",
                  }}
                />
                <h3
                  className="font-bold text-sm uppercase tracking-[0.2em]"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  Atur Periode Rental
                </h3>
              </div>

              <div className="space-y-4">
                {/* DATE GRID */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Tanggal Mulai",
                      value: startDate,
                      setter: setStartDate,
                      min: new Date().toISOString().split("T")[0],
                    },
                    {
                      label: "Tanggal Selesai",
                      value: endDate,
                      setter: setEndDate,
                      min: startDate || new Date().toISOString().split("T")[0],
                    },
                  ].map((field) => (
                    <div key={field.label}>
                      <label
                        className="block text-[10px] font-bold uppercase tracking-[0.25em] mb-2"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {field.label}
                      </label>
                      <input
                        type="date"
                        value={field.value}
                        min={field.min}
                        onChange={(e) => field.setter(e.target.value)}
                        className="w-full h-11 rounded-xl px-3 text-sm font-medium outline-none transition-all duration-200"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: field.value ? "#fff" : "rgba(255,255,255,0.3)",
                          colorScheme: "dark",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(74,222,128,0.5)";
                          e.currentTarget.style.background =
                            "rgba(74,222,128,0.05)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(255,255,255,0.1)";
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.05)";
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* QUANTITY */}
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase tracking-[0.25em] mb-2"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Jumlah Unit
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
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
                          d="M20 12H4"
                        />
                      </svg>
                    </button>

                    <div
                      className="flex-1 h-11 rounded-xl flex items-center justify-center font-bold text-base"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                      }}
                    >
                      {quantity}
                    </div>

                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 disabled:opacity-30"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                      onMouseEnter={(e) => {
                        if (quantity < product.stock) {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.1)";
                          e.currentTarget.style.color = "#fff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* SUMMARY */}
              <div
                className="mt-6 pt-5 space-y-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                {[
                  {
                    label: "Harga per hari",
                    value: `Rp ${Number(product.price).toLocaleString("id-ID")}`,
                  },
                  {
                    label: "Durasi Sewa",
                    value: duration > 0 ? `${duration} Hari` : "—",
                  },
                  { label: "Jumlah Unit", value: `${quantity}x` },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center"
                  >
                    <span
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {row.label}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}

                {/* TOTAL */}
                <div
                  className="flex justify-between items-center pt-4"
                  style={{ borderTop: "1px dashed rgba(255,255,255,0.1)" }}
                >
                  <span
                    className="text-sm font-bold uppercase tracking-[0.15em]"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Total Biaya
                  </span>
                  <motion.span
                    key={subtotal}
                    initial={{ opacity: 0.5, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black"
                    style={{
                      color: isReady ? "#4ade80" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    Rp {subtotal.toLocaleString("id-ID")}
                  </motion.span>
                </div>
              </div>

              {/* CTA BUTTON */}
              <button
                onClick={handleAddToCart}
                disabled={!isReady || adding || added}
                className="relative w-full h-14 mt-6 rounded-xl font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 disabled:cursor-not-allowed"
                style={{
                  background: added
                    ? "rgba(74,222,128,0.15)"
                    : !isReady
                      ? "rgba(255,255,255,0.05)"
                      : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  border: added
                    ? "1px solid rgba(74,222,128,0.4)"
                    : !isReady
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(74,222,128,0.3)",
                  color: added
                    ? "#4ade80"
                    : !isReady
                      ? "rgba(255,255,255,0.25)"
                      : "#0a0a0a",
                }}
              >
                {/* SHIMMER */}
                {isReady && !added && !adding && (
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                      animation: "shimmer 2.5s infinite",
                      backgroundSize: "200% 100%",
                    }}
                  />
                )}

                <span className="relative flex items-center justify-center gap-2.5">
                  {added ? (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Berhasil Ditambahkan!
                    </>
                  ) : adding ? (
                    <>
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{
                          border: "1.5px solid rgba(0,0,0,0.2)",
                          borderTop: "1.5px solid #0a0a0a",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Menambahkan...
                    </>
                  ) : product.stock <= 0 ? (
                    "Stok Habis"
                  ) : duration <= 0 ? (
                    <>
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
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                      </svg>
                      Tentukan Tanggal Rental
                    </>
                  ) : (
                    <>
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
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>
                      Tambah ke Keranjang
                    </>
                  )}
                </span>
              </button>

              {/* NOTE */}
              {isReady && !added && (
                <p
                  className="text-center text-xs mt-3"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Pembayaran dilakukan setelah konfirmasi pesanan
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

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
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.6);
          cursor: pointer;
          opacity: 0.5;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
