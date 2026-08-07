/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") ?? "");
  }, []);

  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
      style={{ background: "#0a0a0a", color: "#fff" }}
    >
      {/* AMBIENT BG */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(50px)",
        }}
      />

      <div
        className="absolute"
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",
          top: "-10%",
          right: "-5%",
          filter: "blur(60px)",
        }}
      />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div
          className="relative overflow-hidden text-center"
          style={{
            borderRadius: "2rem",
            background: "#111",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* TOP ACCENT BAR */}
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #22c55e, #4ade80, #22c55e, transparent)",
            }}
          />

          <div className="p-10">
            {/* ICON */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "rgba(74,222,128,0.2)",
                    margin: -14,
                  }}
                />

                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(74,222,128,0.25), rgba(34,197,94,0.1))",
                    border: "1px solid rgba(74,222,128,0.3)",
                    boxShadow:
                      "0 0 30px rgba(74,222,128,0.18), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <svg
                    className="w-9 h-9"
                    style={{ color: "#4ade80" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 15.75l1.5 1.5 3-3.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* EYEBROW */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="w-1.5 h-6 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, #4ade80 0%, #16a34a 100%)",
                }}
              />

              <span
                className="text-[10px] font-bold uppercase tracking-[0.35em]"
                style={{ color: "#4ade80" }}
              >
                Satu Langkah Lagi
              </span>
            </div>

            {/* TITLE */}
            <h1
              className="font-black uppercase italic leading-[0.9] mb-5"
              style={{ fontSize: "clamp(2rem, 6vw, 2.5rem)" }}
            >
              Verifikasi
              <br />
              <span
                style={{
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.25)",
                  color: "transparent",
                }}
              >
                Email
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Kami telah mengirimkan email verifikasi ke alamat berikut:
            </p>

            {/* EMAIL BADGE */}
            <div
              className="inline-flex mt-4 mb-6 px-4 py-2 rounded-xl"
              style={{
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.2)",
              }}
            >
              <p
                className="font-bold text-sm break-all"
                style={{ color: "#4ade80" }}
              >
                {email || "Email tidak ditemukan"}
              </p>
            </div>

            {/* DIVIDER */}
            <div
              className="mb-6 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)",
              }}
            />

            {/* INSTRUCTION */}
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Silakan buka email tersebut, kemudian tekan tombol{" "}
              <span className="font-semibold" style={{ color: "#fff" }}>
                Verifikasi Email
              </span>
              .
            </p>

            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Setelah email berhasil diverifikasi, Anda dapat masuk menggunakan
              akun yang telah dibuat.
            </p>

            {/* BUTTON */}
            <div className="mt-8">
              <Link
                href="/login"
                className="relative inline-flex items-center justify-center gap-2.5 w-full h-13 rounded-xl font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-200 active:scale-[0.99]"
                style={{
                  height: 52,
                  background:
                    "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: "#0a0a0a",
                  border: "1px solid rgba(74,222,128,0.3)",
                  boxShadow: "0 8px 24px rgba(74,222,128,0.2)",
                }}
              >
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2.5s infinite",
                  }}
                />

                <span className="relative">Kembali ke Login</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }

          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </main>
  );
}
