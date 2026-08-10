/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { motion } from "framer-motion";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

// Ganti path gambar dengan asset yang sesuai di folder public Anda
const galleryImages = [
  { img: "/images/kaparak.jpg" },
  { img: "/images/kelas.png" },
];

export default function AboutUs() {
  return (
    <section className="relative py-24 px-6 md:px-10 bg-black text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-linear-to-b from-black via-black/70 to-transparent backdrop-blur-[2px]" />

      {/* AMBIENT GLOW */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",
          top: "10%",
          right: "-10%",
          filter: "blur(70px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <p
            className={`${bebas.className} text-[10px] uppercase tracking-[0.5em] text-green-500 mb-2`}
          >
            Our Story
          </p>
          <h2
            className={`${bebas.className} text-3xl md:text-4xl font-black uppercase tracking-tighter italic`}
          >
            Tentang{" "}
            <span className="text-green-500 stroke-text-thin">Kita</span>
          </h2>
          <div className="w-12 h-0.5 bg-green-600 mx-auto mt-6" />
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: IMAGE COLLAGE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative grid grid-cols-2 gap-4 h-100"
          >
            <div className="relative overflow-hidden group h-full mt-8">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${galleryImages[0].img})` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-70" />
              <div className="absolute inset-0 border border-white/10 group-hover:border-green-500/40 transition-all duration-300" />
            </div>

            <div className="relative overflow-hidden group h-full -mt-8">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${galleryImages[1].img})` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-70" />
              <div className="absolute inset-0 border border-white/10 group-hover:border-green-500/40 transition-all duration-300" />
            </div>

            {/* ACCENT CORNER LINE */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 border-b-2 border-l-2 border-green-600/40 pointer-events-none" />
          </motion.div>

          {/* RIGHT: STORY + STATS */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3
              className={`${bebas.className} text-2xl md:text-3xl uppercase italic mb-6 leading-tight`}
            >
              Menemani Setiap
              <br />
              <span className="text-green-500">Langkah Petualangan</span>
            </h3>

            <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-4">
              KAPARAK Outdoor lahir dari kecintaan pada alam dan keinginan
              membuat aktivitas mendaki serta camping lebih mudah dijangkau
              siapa saja. Kami menyediakan peralatan outdoor berkualitas untuk
              disewa, tanpa perlu Anda membeli gear mahal yang jarang terpakai.
            </p>

            <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-8">
              Setiap unit peralatan kami rawat dan periksa secara berkala,
              memastikan Anda berangkat dengan gear yang siap diandalkan di
              medan apa pun — dari tenda, carrier, hingga perlengkapan masak dan
              penerangan.
            </p>

            {/* CTA */}
            <a
              href="/product"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-black bg-green-600 px-6 py-3.5 hover:bg-green-500 transition-colors duration-300"
            >
              Jelajahi Peralatan
              <svg
                className="w-3.5 h-3.5"
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
            </a>
          </motion.div>
        </div>

        {/* BOTTOM DECORATION LINE */}
        <div className="mt-20 flex justify-between items-center opacity-20">
          <div className="h-px w-1/3 bg-white" />
          <div className="h-px w-1/4 bg-white" />
        </div>
      </div>

      <style jsx>{`
        .stroke-text-thin {
          -webkit-text-stroke: 1px rgba(74, 222, 128, 0.6);
        }
      `}</style>
    </section>
  );
}
