"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/query/product";
import { ProductItem } from "@/lib/query/product.model";

export default function Product() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();

      // karena response pagination
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  return (
    <main className="relative min-h-screen w-full bg-white text-white font-sans pt-35 pb-24 overflow-hidden">
      <Navbar />

      <div className="relative z-20 max-w-6xl mx-auto px-6 md:px-10">
        {/* HEADER */}
        <div className="relative mb-24 py-12 px-6 md:px-12 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/kaparakbg.jpg"
              alt="Header Background"
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-[0.4em] text-green-500 mb-6">
              Equipment Directory
            </p>

            <h1 className="text-6xl md:text-[8rem] font-black uppercase italic leading-[0.85]">
              Explore
              <br />
              <span className="text-transparent stroke-text-thin">
                Our Gear
              </span>
            </h1>
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="text-center text-gray-400">Loading products...</div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="group relative overflow-hidden rounded-[2rem] bg-gray-650 border border-white/10"
                >
                  {/* IMAGE CONTAINER */}
                  <div className="relative aspect-4/5 overflow-hidden">
                    <Image
                      src="/images/cat-tenda.jpg"
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-1800 ease-out group-hover:scale-110"
                    />

                    {/* DARK OVERLAY */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-black/10" />

                    {/* TOP BADGE */}
                    <div className="absolute top-5 left-5 flex items-center gap-2">
                      <div className="backdrop-blur-xl bg-white/10 border border-white/10 px-3 py-1 rounded-full">
                        <span className="text-[10px] tracking-[0.25em] uppercase text-white/70 font-medium">
                          {product.code}
                        </span>
                      </div>
                    </div>

                    {/* STOCK */}
                    <div className="absolute top-5 right-5">
                      <div className="backdrop-blur-xl bg-black/40 border border-white/10 px-3 py-1 rounded-full">
                        <span className="text-[10px] uppercase tracking-wider text-white/70">
                          Stock {product.stock}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {/* CATEGORY */}
                      <p className="text-[11px] uppercase tracking-[0.3em] text-green-400 mb-3">
                        Outdoor Equipment
                      </p>

                      {/* TITLE */}
                      <h3 className="text-2xl font-bold text-white leading-tight mb-3 transition-colors duration-300 group-hover:text-green-400">
                        {product.name}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="text-sm text-white/60 line-clamp-2 leading-relaxed mb-6">
                        {product.description}
                      </p>

                      {/* FOOTER */}
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-white/40 mb-1">
                            Rental Price
                          </p>

                          <h4 className="text-2xl font-bold text-white">
                            Rp {Number(product.price).toLocaleString("id-ID")}
                          </h4>
                        </div>

                        {/* BUTTON */}
                        <div className="w-11 h-11 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-green-500 transition-all duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-white"
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
                      </div>
                    </div>

                    {/* PREMIUM BORDER GLOW */}
                    <div className="absolute inset-0 rounded-[2rem] border border-white/5 group-hover:border-green-500/30 transition-colors duration-500" />

                    {/* LIGHT EFFECT */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-linear-to-tr from-green-500/10 via-transparent to-transparent" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .stroke-text-thin {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
        }

        @media (min-width: 768px) {
          .stroke-text-thin {
            -webkit-text-stroke: 2px rgba(255, 255, 255, 0.3);
          }
        }
      `}</style>
    </main>
  );
}
