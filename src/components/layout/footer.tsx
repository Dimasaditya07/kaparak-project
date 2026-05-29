"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-10 border-t border-white/5 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-primary/5 blur-[150px] rounded-full z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* KOLOM 1: BRAND */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/kaparak3.png"
                alt="KAPARAK Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>
            <p className="font-sans text-[12px] text-gray-400 leading-relaxed tracking-wide uppercase italic">
              Penyedia layanan sewa peralatan outdoor premium untuk area Sumatra
              Barat. Siap menjelajah, tanpa ribet.
            </p>
          </div>

          {/* KOLOM 2: QUICK LINKS */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.4em] text-green-500 mb-8">
              Explore
            </h4>
            <ul className="flex flex-col gap-4 font-sans text-[11px] uppercase tracking-widest text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Kategori
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Cara Sewa
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Paket Hemat
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Cek Ketersediaan
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: CONTACT */}
          <div>
            <h4 className="font-sans text-[10px] uppercase tracking-[0.4em] text-green-500 mb-8">
              Get in Touch
            </h4>
            <ul className="flex flex-col gap-4 font-sans text-[11px] uppercase tracking-widest text-gray-400">
              <li>WhatsApp: +62 812-3456-7890</li>
              <li>Email: hello@kaparak.com</li>
              <li>Instagram: @kaparak.outdoor</li>
              <li className="normal-case leading-relaxed">
                Jl. Raya Outdoor No. 123, Tangerang, Banten
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-sans text-[9px] text-gray-600 uppercase tracking-widest">
            © 2026 KAPARAK OUTDOOR. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 font-sans text-[9px] text-gray-600 uppercase tracking-widest">
            <Link href="#" className="hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
