"use client";

import { motion } from "framer-motion";
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

  const MAP_LINK =
    "https://www.google.com/maps/place/Kaparak+outdoor+padang/@-0.9219294,100.3659311,17z/data=!3m1!4b1!4m6!3m5!1s0x2fd4b93d0bbc8d01:0xe5d061bb99c8819a!8m2!3d-0.9219294!4d100.368506!16s%2Fg%2F11jz9mqq2m";

  return (
    <main className="relative min-h-screen w-full bg-black text-white font-sans selection:bg-green-500 selection:text-white pt-32 pb-24 overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-linear-to-b from-green-900/10 to-black z-0 pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-5%] w-125 h-125 bg-primary/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-150 h-150 bg-green-950/20 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-stretch">
          {/* --- BAGIAN KIRI: INFORMASI KONTAK --- */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-12"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-green-500 mb-4 font-bold">
                  Hubungi Kami
                </p>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.9]">
                  Hubungi <br />
                  <span className="text-transparent stroke-text-thin">
                    Kami
                  </span>
                </h1>
                <p className="font-sans text-sm md:text-base text-gray-400 mt-6 leading-relaxed max-w-md">
                  Punya pertanyaan tentang peralatan, ketersediaan, atau butuh
                  panduan rute pendakian? Kunjungi Basecamp KAPARAK atau hubungi
                  tim kami.
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
                      Lokasi Basecamp
                    </h4>
                    <p className="font-sans text-base text-white font-medium leading-relaxed">
                      Kaparak Outdoor Padang <br />
                      Padang, Sumatera Barat
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
                      Kontak
                    </h4>
                    <p className="font-sans text-base text-white font-medium leading-relaxed">
                      +62 812 3456 7890 (WhatsApp)
                      <br />
                      kaparak@gmail.com
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
          </div>

          {/* --- BAGIAN KANAN: MAP LOKASI KAPARAK OUTDOOR PADANG --- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 flex"
          >
            <div className="w-full h-full min-h-[450px] lg:min-h-[550px] backdrop-blur-xl bg-white/3 border border-white/10 p-4 md:p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
              {/* Efek cahaya halus di dalam container map */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>

              {/* Header Peta */}
              <div className="flex justify-between items-center px-2 mb-4 relative z-10">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-green-500 font-bold">
                    Location Map
                  </h3>
                  <p className="font-sans text-sm font-semibold text-white">
                    Kaparak Outdoor Padang
                  </p>
                </div>
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-green-400 border border-white/10 hover:border-green-500/50 bg-white/5 px-3 py-1.5 rounded-full transition-all"
                >
                  Buka di Maps ↗
                </a>
              </div>

              {/* Embed Google Maps Presisi sesuai link Kaparak outdoor padang */}
              <div className="w-full flex-1 rounded-[1.8rem] overflow-hidden border border-white/10 relative z-10 min-h-[350px]">
                <iframe
                  title="Lokasi Kaparak Outdoor Padang"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.313460831681!2d100.3659311!3d-0.9219294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b93d0bbc8d01%3A0xe5d061bb99c8819a!2sKaparak%20outdoor%20padang!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: "invert(90%) hue-rotate(180deg) contrast(1.2)",
                  }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full min-h-87.5"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
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
