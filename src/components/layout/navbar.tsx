"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserIcon } from "@/components/icons/UserIcon";
import { useRouter, usePathname } from "next/navigation";
import { CartIcon } from "@/components/icons/CartIcon";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");

    if (token && name) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoggedIn(true);
      setUserName(name);
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setUserName("");

    router.push("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-10 md:px-20 transition-all duration-700 font-sans
        ${
          scrolled || !isHome
            ? "bg-black/60 backdrop-blur-md py-5 border-b border-white/5"
            : "bg-transparent py-5 border-b border-white/5"
        }`}
    >
      <div className="relative flex items-center justify-between">
        {/* LEFT - LOGO */}
        <Link
          href="/"
          className="relative z-10 transition-transform hover:scale-105"
        >
          <Image
            src="/images/kaparak3.png"
            alt="KAPARAK Logo"
            width={110}
            height={35}
            className="object-contain"
          />
        </Link>

        {/* CENTER - FIXED MENU */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-10 text-[11px] uppercase tracking-widest font-semibold text-white/70">
          <Link
            href="/"
            className="hover:text-white transition-colors relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/product"
            className="hover:text-white transition-colors relative group"
          >
            Product
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/how-to-rent"
            className="hover:text-white transition-colors relative group"
          >
            Cara Sewa
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/contact"
            className="hover:text-white transition-colors relative group"
          >
            Kontak
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* RIGHT - LOGIN / USER */}
        <div className="ml-auto flex items-center gap-6">
          {isLoggedIn ? (
            <div className="flex items-center gap-6 animate-in fade-in duration-500">
              {/* USER INFO */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-white truncate max-w-30">
                    {userName}
                  </span>
                </div>

                <Link href="/cart" className="relative group">
                  <div className="p-2 relative flex items-center justify-center transition-transform group-hover:scale-110">
                    <CartIcon className="w-5 h-5 text-white/70 group-hover:text-green-500 transition-colors duration-300" />

                    <span className="absolute top-0.5 right-0 bg-green-600 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full border border-black">
                      0
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="font-mono text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-red-500 transition-colors relative group"
                >
                  Logout
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="block">
              <button className="group relative flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-white px-7 py-3 overflow-hidden transition-all duration-500">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-green-500/50 transition-colors duration-500"></div>

                <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/10 transition-colors duration-500"></div>

                <div className="relative flex items-center gap-2.5">
                  <UserIcon className="w-3.5 h-3.5 text-white transition-transform duration-500 group-hover:scale-110" />
                  <span className="relative">
                    Login
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-green-500 transition-all duration-500 group-hover:w-full"></span>
                  </span>
                </div>
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
