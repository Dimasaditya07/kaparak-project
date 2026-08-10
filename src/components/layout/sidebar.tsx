/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { adminNavItems } from "@/lib/query/navItems";
import { getAdminNotificationCount } from "@/lib/query/adminNotification";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [notificationCount, setNotificationCount] = useState({
    reservation: 0,
    payment: 0,
    total: 0,
  });

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  /**
   * =========================================================
   * ACTIVE MENU
   * =========================================================
   */
  useEffect(() => {
    const activeMenu = adminNavItems.find((item) => {
      if (!item.subItems) return false;

      return item.subItems.some((sub) => pathname.startsWith(sub.href || ""));
    });

    if (activeMenu) {
      setOpenMenu(activeMenu.name);
    } else {
      setOpenMenu(null);
    }
  }, [pathname]);

  /**
   * =========================================================
   * ADMIN NOTIFICATION
   * =========================================================
   */
  const fetchNotificationCount = async () => {
    try {
      const data = await getAdminNotificationCount();

      setNotificationCount(data);
    } catch (error) {
      console.error("Gagal mengambil jumlah notifikasi admin:", error);
    }
  };

  /**
   * Ambil notifikasi saat Sidebar pertama kali dibuka
   * dan refresh setiap 10 detik.
   */
  useEffect(() => {
    // Ambil pertama kali
    fetchNotificationCount();

    // Refresh otomatis setiap 10 detik
    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 5000);

    // Dengarkan perubahan notifikasi dari halaman lain
    const handleNotificationUpdate = () => {
      fetchNotificationCount();
    };

    window.addEventListener(
      "admin-notifications-updated",
      handleNotificationUpdate,
    );

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "admin-notifications-updated",
        handleNotificationUpdate,
      );
    };
  }, []);

  /**
   * =========================================================
   * LOGOUT
   * =========================================================
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    router.push("/");
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#050505]">
      {/* =====================================================
          LOGO
      ===================================================== */}
      <div className="flex h-20 items-center justify-center">
        <Link href="/admin/dashboard">
          <Image
            src="/images/kaparak3.png"
            alt="KAPARAK Logo"
            width={160}
            height={60}
            className="relative z-10 object-contain brightness-0 invert transition-all duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}
      <nav className="flex flex-1 flex-col justify-between overflow-y-auto bg-[#050505] px-3 py-4 shadow-[0_0_40px_rgba(0,0,0,0.45)]">
        {/* MENU */}
        <div className="flex flex-col gap-1">
          {adminNavItems.map((item) => {
            const hasSubItems = !!item.subItems;

            const isActive = hasSubItems
              ? item.subItems!.some((sub) => pathname === sub.href)
              : pathname === item.href;

            const isOpen = openMenu === item.name;

            return (
              <div key={item.name}>
                {/* =================================================
                    MENU UTAMA
                ================================================= */}
                {hasSubItems ? (
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`flex w-full items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
                      isActive || isOpen
                        ? "bg-green-500/10 text-green-400"
                        : "text-gray-400 hover:bg-green-500/10 hover:text-green-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.Icon className="h-5 w-5" />

                      <span className="text-sm font-medium">{item.name}</span>
                    </div>

                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={`flex items-center gap-3 rounded-2xl px-5 py-3 transition-all duration-300 ${
                      isActive
                        ? "bg-green-500/10 text-green-400"
                        : "text-gray-400 hover:bg-green-500/10 hover:text-green-400"
                    }`}
                  >
                    <item.Icon className="h-5 w-5" />

                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                )}

                {/* =================================================
                    SUBMENU
                ================================================= */}
                <AnimatePresence>
                  {hasSubItems && isOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 ml-6 flex flex-col gap-1 border-l border-white/10 pl-4">
                        {item.subItems!.map((sub) => {
                          const isSubActive = pathname === sub.href;

                          /**
                           * Deteksi jenis notifikasi berdasarkan URL.
                           */
                          const isReservation =
                            sub.href?.includes("/reservation") ||
                            sub.href?.includes("/reservations");

                          const isPayment =
                            sub.href?.includes("/payment") ||
                            sub.href?.includes("/payments");

                          /**
                           * Tentukan jumlah badge.
                           */
                          const badgeCount = isReservation
                            ? notificationCount.reservation
                            : isPayment
                              ? notificationCount.payment
                              : 0;

                          return (
                            <Link
                              key={sub.name}
                              href={sub.href || "#"}
                              className={`flex items-center justify-between py-2 text-sm transition-all duration-200 ${
                                isSubActive
                                  ? "text-green-400"
                                  : "text-gray-500 hover:text-green-400"
                              }`}
                            >
                              <span>{sub.name}</span>

                              {badgeCount > 0 && (
                                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                                  {badgeCount > 99 ? "99+" : badgeCount}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            LOGOUT
        ===================================================== */}
        <div className="mt-4 border-t border-white/5 pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-2xl px-5 py-3 text-gray-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>

                <span className="text-sm font-medium">Keluar</span>
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Keluar dari akun?</AlertDialogTitle>

                <AlertDialogDescription>
                  Apakah Anda yakin ingin keluar dari halaman admin KAPARAK?
                  Anda perlu login kembali untuk mengakses dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  Ya, Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </nav>
    </aside>
  );
}
