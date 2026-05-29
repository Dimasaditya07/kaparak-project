"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";

export default function ContactPage() {
  // Animasi untuk list informasi
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white font-sans selection:bg-green-500 selection:text-white pt-32 pb-24 overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-linear-to-b from-green-900/10 to-black z-0 pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-5%] w-125 h-125 bg-primary/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-150 h-150 bg-green-950/20 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* --- BAGIAN KIRI: INFORMASI KONTAK --- */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-green-500 mb-4 font-bold">
                Get In Touch
              </p>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.9]">
                Hubungi <br />
                <span className="text-transparent stroke-text-thin">Kami</span>
              </h1>
              <p className="font-sans text-sm md:text-base text-gray-400 mt-6 leading-relaxed max-w-md">
                Punya pertanyaan tentang peralatan, ketersediaan, atau butuh
                panduan rute pendakian? Jangan ragu untuk menghubungi tim
                KAPARAK.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Info: Alamat */}
              <motion.div
                variants={itemVariants}
                className="flex gap-6 items-start group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 group-hover:border-green-500 transition-colors duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    Basecamp Location
                  </h4>
                  <p className="font-sans text-base text-white font-medium leading-relaxed">
                    Jl. Khatib Sulaiman No. 89 <br />
                    Padang, Sumatera Barat 25133
                  </p>
                </div>
              </motion.div>

              {/* Info: Kontak */}
              <motion.div
                variants={itemVariants}
                className="flex gap-6 items-start group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 group-hover:border-green-500 transition-colors duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.89-1.438-5.18-3.72-6.62-6.62l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    Direct Contact
                  </h4>
                  <p className="font-sans text-base text-white font-medium leading-relaxed">
                    +62 812 3456 7890 (WhatsApp)
                    <br />
                    hello@kaparak.com
                  </p>
                </div>
              </motion.div>

              {/* Info: Jam Operasional */}
              <motion.div
                variants={itemVariants}
                className="flex gap-6 items-start group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 group-hover:border-green-500 transition-colors duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    Operational Hours
                  </h4>
                  <p className="font-sans text-base text-white font-medium leading-relaxed">
                    Senin - Jumat: 08:00 - 21:00 WIB
                    <br />
                    Sabtu - Minggu: 07:00 - 22:00 WIB
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* --- BAGIAN KANAN: CONTACT FORM --- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="backdrop-blur-xl bg-white/3 border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              {/* Efek cahaya halus di dalam form */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>

              <form className="space-y-6 relative z-10">
                {/* GRID NAMA & EMAIL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500 ml-1 group-focus-within:text-green-500 transition-colors">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500 ml-1 group-focus-within:text-green-500 transition-colors">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                {/* INPUT SUBJECT */}
                <div className="space-y-2 group">
                  <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500 ml-1 group-focus-within:text-green-500 transition-colors">
                    Subjek Pertanyaan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ketersediaan Tenda Kapasitas 4 Orang"
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all"
                  />
                </div>

                {/* TEXTAREA PESAN */}
                <div className="space-y-2 group">
                  <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500 ml-1 group-focus-within:text-green-500 transition-colors">
                    Pesan Lengkap
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tuliskan detail pertanyaan atau kebutuhan sewa alatmu di sini..."
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all resize-none"
                  ></textarea>
                </div>

                {/* BUTTON SUBMIT */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-600 text-white font-black uppercase tracking-[0.3em] text-[11px] py-4.5 rounded-2xl shadow-xl hover:bg-white hover:text-black transition-all duration-300 italic mt-4 flex items-center justify-center gap-3 group"
                >
                  Kirim Pesan
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                    />
                  </svg>
                </motion.button>

                <p className="font-mono text-[9px] text-gray-500 text-center uppercase tracking-widest mt-4">
                  Atau hubungi kami via{" "}
                  <Link
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    className="text-green-500 border-b border-green-500 hover:text-white transition-colors"
                  >
                    WhatsApp
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>

        {/* --- MAP PLACEHOLDER SECTION (Opsional tapi mempercantik) --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 rounded-[2.5rem] overflow-hidden border border-white/10 h-100 relative bg-zinc-900 flex items-center justify-center group"
        >
          {/* Ini adalah placeholder. Nanti bisa diganti iframe Google Maps */}
          <div className="absolute inset-0 bg-[url('/images/map-placeholder.jpg')] bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-all duration-700"></div>

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="font-sans text-2xl font-black uppercase tracking-tight text-white italic">
              Basecamp Kaparak
            </h3>
            <p className="font-mono text-[10px] text-green-400 uppercase tracking-widest mt-2">
              Open In Google Maps
            </p>
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
