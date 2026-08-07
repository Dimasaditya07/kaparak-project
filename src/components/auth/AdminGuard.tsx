/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Belum login
    if (!token) {
      router.replace("/login");
      return;
    }

    // Bukan admin
    if (role !== "admin") {
      router.replace("/");
      return;
    }

    // Admin
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center">
          {/* Logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-green-500/10 blur-2xl scale-150" />

            <Image
              src="/images/kaparak3.png"
              alt="KAPARAK"
              width={160}
              height={60}
              priority
              className="relative z-10 object-contain brightness-0 invert opacity-90"
            />
          </div>

          {/* Loader */}
          <div
            className="w-8 h-8 rounded-full animate-spin"
            style={{
              border: "2px solid rgba(255,255,255,0.08)",
              borderTopColor: "#4ade80",
            }}
          />

          <p className="mt-5 text-[10px] uppercase tracking-[0.35em] text-white/30">
            Memeriksa akses
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
