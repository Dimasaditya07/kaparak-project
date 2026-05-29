"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";

const steps = [
  {
    id: "01",
    title: "Pilih Equipment",
    desc: "Jelajahi galeri peralatan kami. Pilih tenda, carrier, atau alat masak yang sesuai dengan kebutuhan dan durasi petualanganmu.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Reservasi & DP",
    desc: "Hubungi admin via WhatsApp untuk cek ketersediaan. Lakukan pembayaran Down Payment (DP) minimal 50% untuk mengamankan alat.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Pick Up / Delivery",
    desc: "Ambil peralatan di Basecamp Kaparak. Cek kondisi alat bersama admin sebelum dibawa. Opsi pengiriman via kurir tersedia untuk area tertentu.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Pengembalian",
    desc: "Kembalikan alat sesuai tanggal yang disepakati. Alat akan dicek ulang. Keterlambatan atau kerusakan akan dikenakan denda sesuai S&K.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ),
  },
];

const rules = [
  {
    title: "Jaminan Identitas",
    desc: "Penyewa wajib menitipkan e-KTP asli atau SIM asli yang masih berlaku selama masa sewa berlangsung.",
  },
  {
    title: "Denda Keterlambatan",
    desc: "Keterlambatan pengembalian akan dikenakan denda sebesar harga sewa alat per hari.",
  },
  {
    title: "Kerusakan & Kehilangan",
    desc: "Segala bentuk kerusakan (robek, patah, bolong) atau kehilangan alat menjadi tanggung jawab penuh penyewa untuk mengganti rugi.",
  },
];

export default function HowToRent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white font-sans selection:bg-green-500 selection:text-white pt-32 pb-24 overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-linear-to-b from-green-900/10 to-black z-0 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-125 h-125 bg-primary/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-150 h-150 bg-green-950/20 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10">
        {/* --- HEADER SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-green-500 mb-4 font-bold">
            Rental Protocol
          </p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.9]">
            Cara <br />
            <span className="text-transparent stroke-text-thin">Sewa</span>
          </h1>
          <div className="w-16 h-0.5 bg-green-500 mx-auto mt-8"></div>
        </motion.div>

        {/* --- TIMELINE SECTION (STEP-BY-STEP) --- */}
        <div className="relative mb-32">
          {/* Garis Vertikal Tengah (Desktop) / Kiri (Mobile) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2"></div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-16"
          >
            {steps.map((step, index) => {
              // Menentukan apakah card berada di sisi kiri atau kanan (hanya untuk desktop)
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.id}
                  variants={itemVariants}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Bagian Kosong untuk menyeimbangkan Grid Desktop */}
                  <div className="hidden md:block w-1/2"></div>

                  {/* Lingkaran Indikator */}
                  <div className="absolute left-6 md:left-1/2 w-12 h-12 bg-black border-2 border-green-500 rounded-full flex items-center justify-center -translate-x-1/2 z-10 shadow-[0_0_20px_rgba(25,98,43,0.5)]">
                    <span className="text-green-500">{step.icon}</span>
                  </div>

                  {/* Card Konten */}
                  <div className="w-full md:w-1/2 pl-16 md:pl-0">
                    <div
                      className={`bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:border-green-500/30 transition-colors duration-500 ${isEven ? "md:text-right" : "md:text-left"}`}
                    >
                      <p className="font-mono text-[40px] font-black text-white/10 leading-none mb-4">
                        {step.id}
                      </p>
                      <h3 className="font-sans text-2xl font-black uppercase tracking-wide text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="font-sans text-sm text-gray-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* --- SYARAT & KETENTUAN SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="font-sans text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white mb-2">
              Syarat & <span className="text-green-500">Ketentuan</span>
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
              Wajib dibaca sebelum menyewa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rules.map((rule, idx) => (
              <div
                key={idx}
                className="bg-black/50 border border-white/5 p-8 rounded-2xl hover:bg-white/5 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <span className="font-mono text-[10px] text-green-500 font-bold">
                    0{idx + 1}
                  </span>
                </div>
                <h4 className="font-sans text-lg font-bold text-white mb-3 uppercase tracking-wide">
                  {rule.title}
                </h4>
                <p className="font-sans text-sm text-gray-400 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* --- BOTTOM CTA --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 p-12 md:p-16 text-center"
        >
          {/* Efek Garis/Cahaya di dalam CTA */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-green-500 to-transparent opacity-50"></div>

          <h2 className="font-sans text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-white mb-6">
            Siap Memulai <br className="md:hidden" />{" "}
            <span className="text-transparent stroke-text-thin">
              Petualangan?
            </span>
          </h2>
          <p className="font-sans text-gray-400 mb-10 max-w-lg mx-auto">
            Jangan biarkan rencana mendakimu tertunda karena tidak ada alat.
            Amankan equipment terbaikmu sekarang.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/categories"
              className="w-full sm:w-auto px-10 py-4 bg-green-600 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-full hover:bg-white hover:text-black transition-all duration-300 italic shadow-[0_0_30px_rgba(25,98,43,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] text-center"
            >
              Lihat Katalog Alat
            </Link>
            <Link
              href="https://wa.me/6281234567890"
              target="_blank"
              className="w-full sm:w-auto px-10 py-4 bg-transparent text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300 italic text-center"
            >
              Hubungi Admin
            </Link>
          </div>
        </motion.div>
      </div>

      {/* STYLE UNTUK TEXT STROKE */}
      <style jsx>{`
        .stroke-text-thin {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.4);
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
