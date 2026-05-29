"use client";

import { motion } from "framer-motion";
import { UserIcon } from "@/components/icons/UserIcon";

const testimonials = [
  {
    quote:
      "Alatnya bener-bener bersih dan terawat. Tenda kapasitas 4 yang saya sewa kerasa kayak baru keluar dari toko.",
    author: "Andika Pratama",
    role: "Pendaki Santai",
    avatar: "/images/avatar1.jpg",
  },
  {
    quote:
      "Sangat terbantu dengan stok real-time. Booking jam 10 malam, besok paginya gear sudah siap di pickup. Gak ribet!",
    author: "Siti Sarah",
    role: "Backpacker",
    avatar: "/images/avatar2.jpg",
  },
  {
    quote:
      "Carrier-nya premium semua. Bikin perjalanan ke Merbabu kemarin jadi lebih nyaman di punggung. Top lah Kaparak!",
    author: "Rizky Fauzi",
    role: "Mountain Guide",
    avatar: "/images/avatar3.jpg",
  },
];

export default function Testimoni() {
  return (
    <section className="py-24 px-10 bg-white text-black relative overflow-hidden">
      {/* DEKORASI BACKGROUND (BLURRY DOTS) */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-green-900/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 blur-[150px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-sans text-[10px] uppercase tracking-[0.5em] text-green-500 mb-4"
          >
            Voices of Explorers
          </motion.p>
          <h2 className="font-sans text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
            Apa Kata{" "}
            <span className="text-green-500 stroke-text-thin">Mereka?</span>
          </h2>
        </div>

        {/* TESTIMONIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative p-8 border border-black/10 bg-white/2 backdrop-blur-md hover:border-green-500/30 transition-all duration-500 group"
            >
              {/* QUOTE ICON */}
              <div className="text-green-500 mb-6 opacity-50 group-hover:opacity-100 transition-opacity">
                <svg
                  width="30"
                  height="24"
                  viewBox="0 0 30 24"
                  fill="currentColor"
                >
                  <path d="M0 24V11.31C0 4.65 3.93 0 10.65 0V4.41C7.17 4.41 5.34 6.66 5.34 9.39H10.65V24H0ZM19.35 24V11.31C19.35 4.65 23.28 0 30 0V4.41C26.52 4.41 24.69 6.66 24.69 9.39H30V24H19.35Z" />
                </svg>
              </div>

              <p className="font-sans text-sm md:text-base leading-relaxed text-gray-700 mb-8 italic">
                {testi.quote}
              </p>

              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-green-500/20">
                  <UserIcon className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-sans text-[11px] font-bold uppercase tracking-widest text-gray-900">
                    {testi.author}
                  </h4>
                  <p className="font-sans text-[9px] text-gray-500 uppercase tracking-wider">
                    {testi.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
