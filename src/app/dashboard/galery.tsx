"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const galleryImages = [
  {
    src: "/images/kaparakone.jpg",
    title: "Mount Gede",
    user: "@petualang_sejati",
  },
  {
    src: "/images/kaparaktwo.jpg",
    title: "Suryakencana",
    user: "@anak_gunung",
  },
  {
    src: "/images/kaparakthre.jpg",
    title: "Camping Ground",
    user: "@kaparak_user",
  },
  {
    src: "/images/kaparakone.jpg",
    title: "Merbabu Peak",
    user: "@explorer_indo",
  },
  { src: "/images/kaparaktwo.jpg", title: "Lake View", user: "@nature_lover" },
  {
    src: "/images/kaparakthre.jpg",
    title: "Forest Camp",
    user: "@mibers_family",
  },
];

export default function Galery() {
  // Gandakan array untuk menciptakan ilusi infinite scroll tanpa putus
  const marqueeImages = [...galleryImages, ...galleryImages];

  return (
    <section className="relative py-24 px-0 md:px-10 text-black overflow-hidden">
      {/* 1. BACKGROUND IMAGE SECTION */}
      <Image
        src="/images/bgkaparak2.jpg" // Ganti dengan path gambar background Anda
        alt="Kaparak Adventure Background"
        fill // Memenuhi seluruh section
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40" // Opacity rendah agar tidak mengganggu
        priority={false} // Tidak perlu priority karena bukan Hero
      />

      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-white to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-white to-transparent z-10"></div>

      {/* 3. CONTENT (Wajib diberi z-20 agar berada di atas background & overlay) */}
      <div className="relative z-20">
        {/* HEADER SECTION - Ditambahkan padding agar sejajar dengan batas layar meski kontainer full width */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-12 gap-6 px-10 md:px-0">
          <div className="max-w-xl">
            <h2 className="font-sans text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
              Galery of kaparak{" "}
              <span className="text-transparent stroke-text-thin">Moments</span>
            </h2>
          </div>
          <p className="font-sans text-[11px] uppercase tracking-widest text-black-300 max-w-50 leading-relaxed border-r border-green-600 pr-4 text-right">
            Cerita perjalanan mereka bersama Kaparak Outdoor.
          </p>
        </div>

        {/* HORIZONTAL INFINITE MARQUEE */}
        <div className="overflow-hidden relative w-full flex items-center mt-10">
          <motion.div
            className="flex gap-4 w-max"
            animate={{ x: ["0%", "-50%"] }} // Bergeser sampai setengah dari total lebar (karena item digandakan 2x)
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30, // Semakin besar angkanya, semakin lambat bergeraknya. Sesuaikan selera!
            }}
          >
            {marqueeImages.map((item, index) => (
              <div
                key={index}
                // shrink-0 penting agar gambar tidak terlipat mengecil. Lebar dan tinggi dibuat tetap/fixed.
                className="relative group overflow-hidden shrink-0 w-70 sm:w-[320px] md:w-100 rounded-sm bg-zinc-900 border border-white/5"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  width={400}
                  height={500}
                  className="w-full h-87.5 md:h-112.5 object-cover grayscale-50 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />

                {/* OVERLAY ON HOVER */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <p className="font-mono text-[9px] text-green-500 uppercase tracking-widest mb-1">
                    {item.user}
                  </p>
                  <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-white">
                    {item.title}
                  </h3>
                  <div className="w-0 group-hover:w-full h-px bg-green-600 mt-2 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div className="mt-16 text-center max-w-7xl mx-auto px-10 md:px-0">
          <button className="font-mono text-[10px] uppercase tracking-[0.3em] text-black-300 hover:text-white transition-colors border-b border-gray-700 pb-2">
            Lihat Lebih Banyak di Instagram →
          </button>
        </div>
      </div>
    </section>
  );
}
