/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import axiosInstance from "@/lib/api/axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { UserIcon } from "@/components/icons/UserIcon";
import { useRouter, usePathname } from "next/navigation";
import { CartIcon } from "@/components/icons/CartIcon";
import { toast } from "sonner";
import { KaparakAlertDialog } from "@/components/ui/kaparak-alert-dialog";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const isHome = pathname === "/";

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await axiosInstance.get("/cart");

      const items =
        res.data?.data?.cartItems ?? res.data?.data?.cart_items ?? [];

      setCartCount(items.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");

    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);

      fetchCartCount();
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setUserName("");
    setCartCount(0);
    setShowDropdown(false);
    setShowLogoutDialog(false);

    toast.success("Logout berhasil", {
      description: "Kamu telah berhasil keluar dari akun.",
    });

    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-5 md:px-20 transition-all duration-700 font-sans ${
        scrolled || !isHome
          ? "bg-black/60 backdrop-blur-md py-4 md:py-5 border-b border-white/5"
          : "bg-transparent py-4 md:py-5 border-b border-white/5"
      }`}
    >
      <div className="relative flex items-center justify-between">
        {/* ==================== LOGO ==================== */}
        <Link
          href="/"
          className="relative z-10 transition-transform hover:scale-105"
        >
          <Image
            src="/images/kaparak3.png"
            alt="KAPARAK Logo"
            width={110}
            height={35}
            className="object-contain w-[90px] md:w-[110px]"
          />
        </Link>

        {/* ==================== DESKTOP MENU ==================== */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-10 text-[11px] uppercase tracking-widest font-semibold text-white/70">
          <Link
            href="/"
            className="hover:text-white transition-colors relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-green-600 transition-all duration-300 group-hover:w-full" />
          </Link>

          <Link
            href="/product"
            className="hover:text-white transition-colors relative group"
          >
            Katalog
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-green-600 transition-all duration-300 group-hover:w-full" />
          </Link>

          <Link
            href="/how-to-rent"
            className="hover:text-white transition-colors relative group"
          >
            Cara Sewa
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-green-600 transition-all duration-300 group-hover:w-full" />
          </Link>

          <Link
            href="/contact"
            className="hover:text-white transition-colors relative group"
          >
            Kontak
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-green-600 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* ==================== DESKTOP RIGHT ==================== */}
        <div className="ml-auto hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <div className="flex items-center gap-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-4">
                {/* USER INFO */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2.5 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm hover:border-green-500 transition"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-white truncate max-w-30">
                      {userName}
                    </span>

                    <svg
                      className={`w-3 h-3 text-white transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#111] border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <Link
                        href="/order-history"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-3 text-sm text-white hover:bg-green-600 transition"
                      >
                        Riwayat Pesanan
                      </Link>
                    </div>
                  )}
                </div>

                {/* CART */}
                <Link href="/cart" className="relative group">
                  <div className="p-2 relative flex items-center justify-center transition-transform group-hover:scale-110">
                    <CartIcon className="w-5 h-5 text-white/70 group-hover:text-green-500 transition-colors duration-300" />

                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-green-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-black shadow-lg">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>

                {/* LOGOUT */}
                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="font-mono text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-red-500 transition-colors relative group"
                >
                  Logout
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-500 transition-all duration-300 group-hover:w-full" />
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="block">
              <button className="group relative flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-white px-7 py-3 overflow-hidden transition-all duration-500">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-green-500/50 transition-colors duration-500" />

                <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/10 transition-colors duration-500" />

                <div className="relative flex items-center gap-2.5">
                  <UserIcon className="w-3.5 h-3.5 text-white transition-transform duration-500 group-hover:scale-110" />

                  <span className="relative">
                    Login
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-green-500 transition-all duration-500 group-hover:w-full" />
                  </span>
                </div>
              </button>
            </Link>
          )}
        </div>

        {/* ==================== MOBILE RIGHT ==================== */}
        <div className="ml-auto flex md:hidden items-center gap-3">
          {/* CART MOBILE */}
          {isLoggedIn && (
            <Link href="/cart" className="relative group">
              <div className="p-2 flex items-center justify-center">
                <CartIcon className="w-5 h-5 text-white/80" />

                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-green-600 text-white text-[8px] font-bold flex items-center justify-center rounded-full border border-black">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          )}

          {/* HAMBURGER */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-white"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${
                showMobileMenu ? "rotate-45 translate-y-[4px]" : ""
              }`}
            />

            <span
              className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${
                showMobileMenu ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${
                showMobileMenu ? "-rotate-45 -translate-y-[4px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ==================== MOBILE MENU ==================== */}
      <div
        className={`md:hidden absolute left-0 top-full w-full bg-black/95 backdrop-blur-xl border-t border-white/10 transition-all duration-300 overflow-hidden ${
          showMobileMenu
            ? "max-h-[600px] opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="px-5 py-6 space-y-2">
          {/* MENU NAVIGATION */}
          <Link
            href="/"
            onClick={() => setShowMobileMenu(false)}
            className="flex items-center justify-between px-4 py-4 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              Home
            </span>

            <span className="text-green-500">01</span>
          </Link>

          <Link
            href="/product"
            onClick={() => setShowMobileMenu(false)}
            className="flex items-center justify-between px-4 py-4 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              Katalog
            </span>

            <span className="text-green-500">02</span>
          </Link>

          <Link
            href="/how-to-rent"
            onClick={() => setShowMobileMenu(false)}
            className="flex items-center justify-between px-4 py-4 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              Cara Sewa
            </span>

            <span className="text-green-500">03</span>
          </Link>

          <Link
            href="/contact"
            onClick={() => setShowMobileMenu(false)}
            className="flex items-center justify-between px-4 py-4 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              Kontak
            </span>

            <span className="text-green-500">04</span>
          </Link>

          {/* DIVIDER */}
          <div className="my-4 border-t border-white/10" />

          {/* USER SECTION */}
          {isLoggedIn ? (
            <div className="space-y-2">
              {/* USER NAME */}
              <div className="px-4 py-3">
                <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-1">
                  Login sebagai
                </p>

                <p className="font-mono text-sm font-bold text-white uppercase tracking-wider truncate">
                  {userName}
                </p>
              </div>

              {/* ORDER HISTORY */}
              <Link
                href="/order-history"
                onClick={() => setShowMobileMenu(false)}
                className="block px-4 py-4 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition font-mono text-xs uppercase tracking-[0.2em]"
              >
                Riwayat Pesanan
              </Link>

              {/* LOGOUT */}
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowLogoutDialog(true);
                }}
                className="w-full text-left px-4 py-4 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition font-mono text-xs uppercase tracking-[0.2em]"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-mono text-xs uppercase tracking-[0.2em] font-bold"
            >
              <UserIcon className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>

      {/* LOGOUT DIALOG */}
      <KaparakAlertDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Keluar dari akun?"
        description="Apakah kamu yakin ingin keluar dari akun KAPARAK?"
        cancelText="Tetap di sini"
        actionText="Logout"
        onAction={handleLogout}
        destructive
      />
    </nav>
  );
}
