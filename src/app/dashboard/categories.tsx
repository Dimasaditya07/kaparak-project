"use client";

import { motion } from "framer-motion";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
});

// Pastikan mengganti path gambar dengan asset yang sesuai di folder public Anda
export const categories = [
  { name: "Tenda", place: "1st Category", img: "/images/cat-tenda.jpg" },
  { name: "Carrier", place: "2nd Category", img: "/images/cat-carrier.jpg" },
  { name: "Masak", place: "3rd Category", img: "/images/cat-masak.jpg" },
  {
    name: "Penerangan",
    place: "4th Category",
    img: "/images/cat-penerangan.jpg",
  },
  {
    name: "Aksesoris",
    place: "5th Category",
    img: "/images/cat-aksesoris.jpg",
  },
];

export default function Categories() {
  return (
    <section className="relative py-24 px-10 bg-white text-black">
      <div className="absolute top-0 left-0 w-full h-20 bg-linear-to-b from-black via-black/70 to-transparent backdrop-blur-[2px]"></div>
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-16">
          <p
            className={` ${bebas.className}text-[10px] uppercase tracking-[0.5em] text-green-500 mb-2`}
          >
            Equipment Guide
          </p>
          <h2
            className={`${bebas.className}text-3xl md:text-4xl font-black uppercase tracking-tighter italic`}
          >
            Kategori{" "}
            <span className="text-green-500 stroke-text-thin">Peralatan</span>
          </h2>
          <div className="w-12 h-0.5 bg-green-600 mx-auto mt-6"></div>
        </div>

        {/* GRID (Mengikuti layout 4-5 kolom vertikal pada desain) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-full">
          {categories.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden h-100 cursor-pointer"
            >
              {/* IMAGE BACKGROUND */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${item.img})` }}
              >
                {/* DARK OVERLAY (Sesuai desain yang gelap di bawah) */}
                <div className="absolute inset-0 border bg-linear-to-t from-black via-black/20 to-transparent opacity-80"></div>
              </div>

              {/* TEXT CONTENT (Diposisikan di bawah seperti desain) */}
              <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                <p className="text-[10px] uppercase tracking-widest font-bold mb-1 group-hover:text-green-500 transition-colors">
                  {item.place}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-300 font-light">
                  {item.name}
                </p>
              </div>

              {/* BORDER HOVER EFFECT */}
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-300"></div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM DECORATION LINE (Garis tipis di desain) */}
        <div className="mt-20 flex justify-between items-center opacity-20">
          <div className="h-px w-1/3 bg-white"></div>
          <div className="h-px w-1/4 bg-white"></div>
        </div>
      </div>
    </section>
  );
}
