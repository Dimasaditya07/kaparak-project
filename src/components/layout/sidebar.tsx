"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { adminNavItems } from "@/lib/query/navItems";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  useEffect(() => {
    adminNavItems.forEach((item) => {
      if (item.subItems) {
        const isChildActive = item.subItems.some((sub) =>
          pathname.startsWith(sub.href || ""),
        );

        if (isChildActive) {
          setOpenMenus((prev) => ({
            ...prev,
            [item.name]: true,
          }));
        }
      }
    });
  }, [pathname]);

  const handleLogout = () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("role");

      router.push("/");
    }
  };

  return (
    <aside className="w-72 h-screen bg-[#050505] border-r border-[#050505] p-5 flex flex-col">
      {/* LOGO */}
      <div className="pt-10 pb-12 flex justify-center">
        <Link href="/" className="group relative">
          <div className="absolute inset-0 bg-green-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full" />

          <Image
            src="/images/kaparak3.png"
            alt="KAPARAK Logo"
            width={160}
            height={60}
            className="relative z-10 object-contain brightness-0 invert transition-all duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="bg-[#0d0d0d] border border-white/5 rounded-4xl px-3 py-4 flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.45)]">
        {/* MENU */}
        <div className="flex flex-col gap-1">
          {adminNavItems.map((item) => {
            const hasSubItems = !!item.subItems;

            const isActive = hasSubItems
              ? item.subItems!.some((sub) => pathname === sub.href)
              : pathname === item.href;

            const isOpen = openMenus[item.name];

            return (
              <div key={item.name}>
                {hasSubItems ? (
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300 ${
                      isActive || isOpen
                        ? "bg-green-500/10 text-green-400"
                        : "text-gray-400 hover:bg-white/ hover:text-green-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.Icon className="w-5 h-5" />

                      <span className="text-sm font-medium">{item.name}</span>
                    </div>

                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
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
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-green-500/10 text-green-400"
                        : "text-gray-400 hover:bg-green-500/10  hover:text-green-400"
                    }`}
                  >
                    <item.Icon className="w-5 h-5" />

                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                )}

                {/* SUBMENU */}
                <AnimatePresence>
                  {hasSubItems && isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 ml-6 flex flex-col gap-1 border-l border-white/10 pl-4">
                        {item.subItems!.map((sub) => {
                          const isSubActive = pathname === sub.href;

                          return (
                            <Link
                              key={sub.name}
                              href={sub.href || "#"}
                              className={`py-2 text-sm transition-all duration-200 ${
                                isSubActive
                                  ? "text-green-400"
                                  : "text-gray-500 hover:text-green-400"
                              }`}
                            >
                              {sub.name}
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

        {/* LOGOUT */}
        <div className="pt-4 mt-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>

            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
