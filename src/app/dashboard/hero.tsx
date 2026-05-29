"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

export default function Hero() {
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setCurrentDate(new Date());
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const today = useMemo(() => currentDate?.getDate() || 1, [currentDate]);

  const formatNum = (num: number): string => {
    if (num < 1 || num > 31) return "";
    return num.toString().padStart(2, "0");
  };

  return (
    <section className="relative h-screen w-full flex flex-col justify-center px-10 md:px-20 text-white overflow-hidden bg-black font-sans">
      <Image
        src="/images/kaparakbg.jpg"
        alt="Kaparak Outdoor"
        fill
        priority
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-black/30"></div>

      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end md:items-center">
        <div className="w-full md:w-2/3">
          <motion.h1
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 10, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-[7rem] font-black leading-[0.85] uppercase tracking-tighter"
          >
            KAPARAK
            <br />
            <span className="text-transparent stroke-text font-mono">OUTDOOR</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 max-w-md text-base md:text-xl text-gray-300 leading-relaxed font-normal tracking-wide italic border-l-2 border-green-500 pl-4"
          >
            Siap Menjelajah, Tanpa Ribet. Stok real-time, praktis & cepat untuk
            area Sumatra Barat .
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10"
          >
            <button className="group relative flex items-center gap-0 overflow-hidden font-sans text-[11px] font-bold uppercase tracking-[0.2em]">
              {/* BAGIAN UTAMA TOMBOL */}
              <span className="relative z-10 border border-white/20 bg-white/5 px-8 py-4 text-white backdrop-blur-sm transition-all duration-500 group-hover:border-primary group-hover:bg-primary">
                Lihat Peralatan
              </span>

              {/* BAGIAN ICON PANAH */}
              <span className="relative z-10 flex h-12.25 items-center bg-primary px-5 text-white transition-all duration-500 group-hover:bg-green-500 group-hover:text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>

              {/* EFEK FLAR SAAT HOVER */}
              <div className="absolute inset-0 z-0 h-full w-full translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
            </button>
          </motion.div>
        </div>

        {/* FONT BARU: Indikator tanggal menggunakan font-mono (JetBrains Mono/Space Mono) */}
        <div className="hidden md:flex flex-col items-center gap-4 text-gray-500 font-mono tracking-widest">
          <span className="text-sm opacity-20">{formatNum(today - 2)}</span>
          <span className="text-sm opacity-50">{formatNum(today - 1)}</span>

          <div className="flex items-center gap-4">
            <motion.span
              key={today}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-light text-white"
            >
              {formatNum(today)}
            </motion.span>
            <div className="w-12 h-px bg-white/30"></div>
          </div>

          <span className="text-sm opacity-50">{formatNum(today + 1)}</span>
          <span className="text-sm opacity-20">{formatNum(today + 2)}</span>
        </div>
      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
        }
        @media (min-width: 768px) {
          .stroke-text {
            -webkit-text-stroke: 2px white;
          }
        }
      `}</style>
    </section>
  );
}
