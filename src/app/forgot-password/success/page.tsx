"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordSuccess() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
      style={{ background: "#0a0a0a", color: "#fff" }}
    >
      {/* AMBIENT GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0">
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
            bottom: "-10%",
            left: "-5%",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="relative overflow-hidden text-center"
          style={{
            borderRadius: "2rem",
            background: "#111",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 80px rgba(74,222,128,0.1)",
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
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: "rgba(74,222,128,0.2)", margin: -14 }}
                />
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="relative w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(74,222,128,0.25), rgba(34,197,94,0.1))",
                    border: "1px solid rgba(74,222,128,0.3)",
                    boxShadow:
                      "0 0 30px rgba(74,222,128,0.18), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="w-9 h-9"
                    style={{ color: "#4ade80" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        delay: 0.4,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                    />
                  </motion.svg>
                </motion.div>
              </div>
            </div>

            {/* EYEBROW */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
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
                Check Your Inbox
              </span>
            </motion.div>

            {/* TITLE */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="font-black uppercase italic leading-[0.9] mb-5"
              style={{ fontSize: "clamp(1.9rem, 5.5vw, 2.4rem)" }}
            >
              Link Berhasil
              <br />
              <span style={{ color: "#4ade80" }}>Dikirim!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Silakan cek email Anda dan ikuti tautan yang kami kirimkan untuk
              melakukan reset password.
            </motion.p>

            {/* DIVIDER */}
            <div
              className="my-8 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)",
              }}
            />

            {/* BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
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
            </motion.div>
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
    </div>
  );
}
