/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import { useEffect, useState, useMemo } from "react";
import { getProducts } from "@/lib/query/product";
import { ProductItem } from "@/lib/query/product.model";
import { getPackages } from "@/lib/query/package";
import { PackageItem, PackageProduct } from "@/lib/query/package.model";

type Tab = "product" | "paket";

// Harga item berdasarkan tab aktif
const getItemPrice = (tab: Tab, item: any): number =>
  tab === "product" ? Number(item.price) : Number(item.package_price);

// Menghitung persentase diskon paket
const getDiscountPercent = (pkg: PackageItem): number => {
  if (!pkg.normal_price || pkg.normal_price <= 0) return 0;

  return Math.round((pkg.discount_amount / pkg.normal_price) * 100);
};

// Rentang harga
const PRICE_RANGES = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "Di bawah Rp 50.000", min: 0, max: 50000 },
  { label: "Rp 50.000 – 150.000", min: 50000, max: 150000 },
  { label: "Rp 150.000 – 300.000", min: 150000, max: 300000 },
  { label: "Di atas Rp 300.000", min: 300000, max: Infinity },
];

export default function Product() {
  const [activeTab, setActiveTab] = useState<Tab>("product");

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState(0);

  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchPackages();
  }, []);

  // =========================
  // FETCH PRODUK
  // =========================
  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.log("Gagal mengambil produk:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // =========================
  // FETCH PAKET
  // =========================
  const fetchPackages = async () => {
    try {
      const response = await getPackages();
      setPackages(response.data);
    } catch (error) {
      console.log("Gagal mengambil paket:", error);
    } finally {
      setLoadingPackages(false);
    }
  };

  // =========================
  // GANTI TAB
  // =========================
  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    setSortBy("newest");
    setPriceRange(0);
    setSearch("");
    setSortOpen(false);
  };

  const loading = activeTab === "product" ? loadingProducts : loadingPackages;

  // =========================
  // DATA AKTIF
  // =========================
  const activeList: (ProductItem | PackageItem)[] =
    activeTab === "product"
      ? products
      : packages.filter((p) => p.status === "available");

  // =========================
  // FILTER & SORT
  // =========================
  const filtered = useMemo(() => {
    let result = [...activeList] as any[];

    // PENCARIAN
    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.code?.toLowerCase().includes(q),
      );
    }

    // FILTER HARGA
    const range = PRICE_RANGES[priceRange];

    result = result.filter((item) => {
      const price = getItemPrice(activeTab, item);

      return price >= range.min && price <= range.max;
    });

    // SORTING
    switch (sortBy) {
      case "price_asc":
        result.sort(
          (a, b) => getItemPrice(activeTab, a) - getItemPrice(activeTab, b),
        );
        break;

      case "price_desc":
        result.sort(
          (a, b) => getItemPrice(activeTab, b) - getItemPrice(activeTab, a),
        );
        break;

      case "stock_desc":
        result.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));
        break;

      case "discount_desc":
        result.sort(
          (a, b) => (b.discount_amount ?? 0) - (a.discount_amount ?? 0),
        );
        break;

      default:
        break;
    }

    return result;
  }, [activeList, activeTab, search, sortBy, priceRange]);

  // =========================
  // JUMLAH FILTER AKTIF
  // =========================
  const activeFilterCount =
    (priceRange !== 0 ? 1 : 0) + (sortBy !== "newest" ? 1 : 0);

  // =========================
  // ANIMASI GRID
  // =========================
  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  // =========================
  // DETAIL URL
  // =========================
  const detailHref = (id: string | number) =>
    activeTab === "product" ? `/product/${id}` : `/package/${id}`;

  return (
    <main
      className="relative min-h-screen w-full font-sans overflow-hidden"
      style={{
        background: "#0a0a0a",
        color: "#fff",
      }}
    >
      <Navbar />

      {/* BACKGROUND EFFECT */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% -10%, rgba(74,222,128,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 110%, rgba(74,222,128,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pt-32 pb-28">
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}
        <div
          className="relative mb-10 rounded-[2rem] overflow-hidden"
          style={{
            minHeight: 320,
          }}
        >
          <Image
            src="/images/kaparakbg.jpg"
            alt="Latar Belakang Peralatan Outdoor"
            fill
            className="object-cover"
            priority
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.65) 100%)",
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            }}
          />

          <div
            className="relative z-10 p-10 md:p-14 flex flex-col justify-end h-full"
            style={{
              minHeight: 320,
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-1.5 h-8 rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, #4ade80 0%, #16a34a 100%)",
                  }}
                />

                <span
                  className="text-xs font-semibold uppercase tracking-[0.35em]"
                  style={{
                    color: "#4ade80",
                  }}
                >
                  Peralatan Outdoor
                </span>
              </div>

              <h1
                className="font-black uppercase italic leading-[0.85] mb-6"
                style={{
                  fontSize: "clamp(3.5rem, 8vw, 7rem)",
                }}
              >
                Jelajahi
                <br />
                <span
                  style={{
                    WebkitTextStroke: "2px rgba(255,255,255,0.25)",
                    color: "transparent",
                  }}
                >
                  Peralatan
                </span>
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 15,
                  maxWidth: 480,
                }}
              >
                Lengkapi petualanganmu dengan peralatan outdoor berkualitas.
                Sewa satuan atau pilih paket hemat untuk perjalanan yang lebih
                sempurna.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ========================= */}
        {/* TAB PRODUK / PAKET */}
        {/* ========================= */}
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.5,
          }}
          className="flex items-center justify-between flex-wrap gap-4 mb-8"
        >
          <div
            className="relative inline-flex p-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {[
              {
                key: "product" as Tab,
                label: "Produk",
              },
              {
                key: "paket" as Tab,
                label: "Paket",
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className="relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300"
                style={{
                  color:
                    activeTab === tab.key
                      ? "#0a0a0a"
                      : "rgba(255,255,255,0.55)",
                }}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)",
                      zIndex: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 32,
                    }}
                  />
                )}

                <span
                  className="relative"
                  style={{
                    zIndex: 1,
                  }}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* PESAN PAKET HEMAT */}
          {activeTab === "paket" && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs"
              style={{
                background: "rgba(250,204,21,0.1)",
                border: "1px solid rgba(250,204,21,0.25)",
                color: "#facc15",
              }}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Paket lebih hemat dibandingkan sewa satuan
            </div>
          )}
        </motion.div>

        {/* ========================= */}
        {/* PENCARIAN & FILTER */}
        {/* ========================= */}
        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
            duration: 0.5,
          }}
          className="mb-8"
        >
          {/* BILAH PENCARIAN */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            {/* PENCARIAN */}
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{
                  color: "rgba(255,255,255,0.35)",
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>

              <input
                type="text"
                placeholder={
                  activeTab === "product"
                    ? "Cari peralatan..."
                    : "Cari paket sewa..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(74,222,128,0.5)";

                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";

                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* TOMBOL FILTER */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap"
              style={{
                background:
                  showFilters || activeFilterCount > 0
                    ? "rgba(74,222,128,0.12)"
                    : "rgba(255,255,255,0.06)",

                border: `1px solid ${
                  showFilters || activeFilterCount > 0
                    ? "rgba(74,222,128,0.4)"
                    : "rgba(255,255,255,0.1)"
                }`,

                color:
                  showFilters || activeFilterCount > 0
                    ? "#4ade80"
                    : "rgba(255,255,255,0.7)",
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                />
              </svg>
              Filter
              {activeFilterCount > 0 && (
                <span
                  className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold"
                  style={{
                    background: "#4ade80",
                    color: "#0a0a0a",
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* PANEL FILTER */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeInOut",
                }}
                className="overflow-hidden"
              >
                <div
                  className="p-5 rounded-xl mb-4"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-[0.25em] mb-4"
                    style={{
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    Rentang Harga
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range, index) => (
                      <button
                        key={index}
                        onClick={() => setPriceRange(index)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                        style={{
                          background:
                            priceRange === index
                              ? "rgba(74,222,128,0.15)"
                              : "rgba(255,255,255,0.06)",

                          border: `1px solid ${
                            priceRange === index
                              ? "rgba(74,222,128,0.5)"
                              : "rgba(255,255,255,0.08)"
                          }`,

                          color:
                            priceRange === index
                              ? "#4ade80"
                              : "rgba(255,255,255,0.55)",
                        }}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* JUMLAH HASIL */}
          <div className="flex items-center justify-between">
            <p
              className="text-sm"
              style={{
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {loading ? (
                "Memuat..."
              ) : (
                <>
                  Menampilkan{" "}
                  <span
                    className="font-semibold"
                    style={{
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {filtered.length}
                  </span>{" "}
                  dari {activeList.length}{" "}
                  {activeTab === "product" ? "produk" : "paket"}
                </>
              )}
            </p>

            {/* RESET */}
            {(search || priceRange !== 0 || sortBy !== "newest") && (
              <button
                onClick={() => {
                  setSearch("");
                  setPriceRange(0);
                  setSortBy("newest");
                }}
                className="text-xs flex items-center gap-1.5 transition"
                style={{
                  color: "rgba(255,255,255,0.35)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#4ade80")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.35)")
                }
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4l16 16M4 20L20 4"
                  />
                </svg>
                Reset semua filter
              </button>
            )}
          </div>
        </motion.div>

        {/* ========================= */}
        {/* GRID PRODUK / PAKET */}
        {/* ========================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="rounded-[1.75rem] overflow-hidden animate-pulse"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  aspectRatio: "4/5",
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <svg
                className="w-9 h-9"
                style={{
                  color: "rgba(255,255,255,0.25)",
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </div>

            <p
              className="text-lg font-semibold mb-2"
              style={{
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {activeTab === "product"
                ? "Produk tidak ditemukan"
                : "Paket tidak ditemukan"}
            </p>

            <p
              className="text-sm"
              style={{
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Coba ubah kata kunci atau filter yang digunakan
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item: any) => (
                <motion.div key={`${activeTab}-${item.id}`} layout exit="exit">
                  <Link href={detailHref(item.id)}>
                    <motion.div
                      whileHover={{
                        y: -5,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="group relative overflow-hidden cursor-pointer"
                      style={{
                        borderRadius: "1.75rem",
                        background: "#111",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      {/* GAMBAR */}
                      <div
                        className="relative overflow-hidden"
                        style={{
                          aspectRatio: "4/5",
                        }}
                      >
                        <img
                          src={item.image_url ?? item.image ?? ""}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* LAPISAN GELAP */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.3) 100%)",
                          }}
                        />

                        {/* EFEK HOVER */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(74,222,128,0.08) 0%, transparent 60%)",
                          }}
                        />

                        {/* ========================= */}
                        {/* PRODUK */}
                        {/* ========================= */}
                        {activeTab === "product" ? (
                          <>
                            {/* LABEL ATAS */}
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                              <div
                                className="px-2.5 py-1 rounded-full backdrop-blur-sm text-[10px] font-semibold tracking-[0.2em] uppercase"
                                style={{
                                  background: "rgba(0,0,0,0.5)",
                                  border: "1px solid rgba(255,255,255,0.12)",
                                  color: "rgba(255,255,255,0.65)",
                                }}
                              >
                                {item.code}
                              </div>

                              <div
                                className="px-2.5 py-1 rounded-full backdrop-blur-sm text-[10px] font-medium"
                                style={{
                                  background:
                                    item.stock > 5
                                      ? "rgba(74,222,128,0.2)"
                                      : "rgba(251,146,60,0.2)",

                                  border: `1px solid ${
                                    item.stock > 5
                                      ? "rgba(74,222,128,0.3)"
                                      : "rgba(251,146,60,0.3)"
                                  }`,

                                  color: item.stock > 5 ? "#4ade80" : "#fb923c",
                                }}
                              >
                                {item.stock > 0
                                  ? `Stok ${item.stock}`
                                  : "Habis"}
                              </div>
                            </div>

                            {/* INFORMASI PRODUK */}
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                              <p
                                className="text-[10px] font-semibold uppercase tracking-[0.3em] mb-2"
                                style={{
                                  color: "#4ade80",
                                }}
                              >
                                Peralatan Outdoor
                              </p>

                              <h3
                                className="font-bold leading-tight mb-2 transition-colors duration-300 group-hover:text-green-400"
                                style={{
                                  fontSize: "1.2rem",
                                  color: "#fff",
                                }}
                              >
                                {item.name}
                              </h3>

                              <p
                                className="text-xs leading-relaxed mb-5 line-clamp-2"
                                style={{
                                  color: "rgba(255,255,255,0.5)",
                                }}
                              >
                                {item.description}
                              </p>

                              <div className="flex items-end justify-between">
                                <div>
                                  <p
                                    className="text-[10px] uppercase tracking-wider mb-0.5"
                                    style={{
                                      color: "rgba(255,255,255,0.35)",
                                    }}
                                  >
                                    Harga Sewa
                                  </p>

                                  <p
                                    className="font-bold text-xl"
                                    style={{
                                      color: "#fff",
                                    }}
                                  >
                                    Rp{" "}
                                    {Number(item.price).toLocaleString("id-ID")}
                                  </p>
                                </div>

                                <CardArrow />
                              </div>
                            </div>
                          </>
                        ) : (
                          /* ========================= */
                          /* PAKET */
                          /* ========================= */
                          <>
                            {/* LABEL ATAS */}
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                              <div
                                className="px-2.5 py-1 rounded-full backdrop-blur-sm text-[10px] font-semibold tracking-[0.2em] uppercase"
                                style={{
                                  background: "rgba(0,0,0,0.5)",
                                  border: "1px solid rgba(255,255,255,0.12)",
                                  color: "rgba(255,255,255,0.65)",
                                }}
                              >
                                {item.code}
                              </div>

                              {getDiscountPercent(item) > 0 && (
                                <div
                                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                  style={{
                                    background: "#facc15",
                                    color: "#0a0a0a",
                                  }}
                                >
                                  Hemat {getDiscountPercent(item)}%
                                </div>
                              )}
                            </div>

                            {/* INFORMASI PAKET */}
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                              <p
                                className="text-[10px] font-semibold uppercase tracking-[0.3em] mb-2"
                                style={{
                                  color: "#4ade80",
                                }}
                              >
                                Paket Sewa · {item.items?.length ?? 0} Barang
                              </p>

                              <h3
                                className="font-bold leading-tight mb-2 transition-colors duration-300 group-hover:text-green-400"
                                style={{
                                  fontSize: "1.2rem",
                                  color: "#fff",
                                }}
                              >
                                {item.name}
                              </h3>

                              {item.description && (
                                <p
                                  className="text-xs leading-relaxed mb-3 line-clamp-2"
                                  style={{
                                    color: "rgba(255,255,255,0.5)",
                                  }}
                                >
                                  {item.description}
                                </p>
                              )}

                              {/* BARANG DALAM PAKET */}
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {(item.items ?? [])
                                  .slice(0, 3)
                                  .map((po: PackageProduct) => (
                                    <span
                                      key={po.id}
                                      className="px-2 py-1 rounded-md text-[10px]"
                                      style={{
                                        background: "rgba(255,255,255,0.08)",
                                        color: "rgba(255,255,255,0.6)",
                                      }}
                                    >
                                      {po.quantity}× {po.product?.name}
                                    </span>
                                  ))}

                                {(item.items?.length ?? 0) > 3 && (
                                  <span
                                    className="px-2 py-1 rounded-md text-[10px]"
                                    style={{
                                      background: "rgba(255,255,255,0.08)",
                                      color: "rgba(255,255,255,0.4)",
                                    }}
                                  >
                                    +{item.items.length - 3} lainnya
                                  </span>
                                )}
                              </div>

                              {/* HARGA */}
                              <div className="flex items-end justify-between">
                                <div>
                                  <p
                                    className="text-[10px] uppercase tracking-wider mb-0.5"
                                    style={{
                                      color: "rgba(255,255,255,0.35)",
                                    }}
                                  >
                                    Harga Paket
                                  </p>

                                  {item.discount_amount > 0 && (
                                    <p
                                      className="text-xs line-through"
                                      style={{
                                        color: "rgba(255,255,255,0.3)",
                                      }}
                                    >
                                      Rp{" "}
                                      {Number(item.normal_price).toLocaleString(
                                        "id-ID",
                                      )}
                                    </p>
                                  )}

                                  <p
                                    className="font-bold text-xl"
                                    style={{
                                      color: "#fff",
                                    }}
                                  >
                                    Rp{" "}
                                    {Number(item.package_price).toLocaleString(
                                      "id-ID",
                                    )}
                                  </p>
                                </div>

                                <CardArrow />
                              </div>
                            </div>
                          </>
                        )}

                        {/* EFEK GARIS */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            borderRadius: "1.75rem",
                            boxShadow: "inset 0 0 0 1px rgba(74,222,128,0.2)",
                          }}
                        />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* TUTUP DROPDOWN */}
      {sortOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setSortOpen(false);
          }}
        />
      )}
    </main>
  );
}

// =========================
// TOMBOL PANAH
// =========================
function CardArrow() {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "#4ade80";

        (e.currentTarget as HTMLDivElement).style.borderColor = "#4ade80";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(255,255,255,0.08)";

        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.1)";
      }}
    >
      <svg
        className="w-4 h-4"
        style={{
          color: "#fff",
        }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 8.75L21 12m0 0-3.75 3.25M21 12H3"
        />
      </svg>
    </div>
  );
}
