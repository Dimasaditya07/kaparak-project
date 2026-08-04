/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const CONFETTI_COLORS = [
  "#4ade80",
  "#22c55e",
  "#86efac",
  "#ffffff",
  "#facc15",
  "#fb923c",
  "#a3e635",
  "#34d399",
];

function Confetti() {
  const [pieces, setPieces] = useState<
    {
      id: number;
      x: number;
      color: string;
      size: number;
      delay: number;
      dur: number;
      shape: string;
    }[]
  >([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 4 + Math.random() * 8,
        delay: Math.random() * 3,
        dur: 3 + Math.random() * 4,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      })),
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0.8, 0],
            rotate: Math.random() > 0.5 ? 720 : -540,
            x: [`${p.x}vw`, `${p.x + (Math.random() * 10 - 5)}vw`],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 5,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.shape === "rect" ? p.size * 2 : p.size,
            borderRadius: p.shape === "circle" ? "50%" : 2,
            background: p.color,
            top: 0,
          }}
        />
      ))}
    </div>
  );
}

function CountUp({
  target,
  duration = 1500,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toString().padStart(6, "0")}</>;
}

export default function PaymentStatusPage() {
  const [statusParam, setStatusParam] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setStatusParam(params.get("status")?.toLowerCase() ?? null);
    setOrderId(params.get("order_id"));
  }, []);

  // Evaluasi Status Pembayaran
  const isFailed =
    statusParam === "failed" ||
    statusParam === "deny" ||
    statusParam === "cancel" ||
    statusParam === "expire";
  const isPending = statusParam === "pending";
  const isSuccess = !isPending && !isFailed; // Default dianggap paid jika tidak pending/failed

  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Konfigurasi Warna berdasarkan status
  const theme = isFailed
    ? {
        main: "#ef4444",
        light: "#f87171",
        glowRadial: "rgba(239,68,68,0.18)",
        shadow: "rgba(239,68,68,0.12)",
        border: "rgba(239,68,68,0.3)",
        bgSubtle: "rgba(239,68,68,0.06)",
        gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      }
    : isPending
      ? {
          main: "#eab308",
          light: "#facc15",
          glowRadial: "rgba(234,179,8,0.18)",
          shadow: "rgba(234,179,8,0.12)",
          border: "rgba(234,179,8,0.3)",
          bgSubtle: "rgba(234,179,8,0.06)",
          gradient: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
        }
      : {
          main: "#22c55e",
          light: "#4ade80",
          glowRadial: "rgba(74,222,128,0.18)",
          shadow: "rgba(74,222,128,0.12)",
          border: "rgba(74,222,128,0.3)",
          bgSubtle: "rgba(74,222,128,0.06)",
          gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
      style={{ background: "#0a0a0a" }}
    >
      {/* AMBIENT GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            background: `radial-gradient(circle, ${theme.glowRadial} 0%, transparent 70%)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 400,
            height: 400,
            background: `radial-gradient(circle, ${theme.glowRadial} 0%, transparent 70%)`,
            top: "-10%",
            right: "-5%",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 350,
            height: 350,
            background: `radial-gradient(circle, ${theme.glowRadial} 0%, transparent 70%)`,
            bottom: "-10%",
            left: "-5%",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* CONFETTI — hanya muncul jika berhasil */}
      {isSuccess && <Confetti />}

      {/* CARD */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md"
          >
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: "2.25rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(32px)",
                boxShadow: `0 40px 80px ${theme.shadow}, 0 0 0 1px ${theme.border}`,
              }}
            >
              {/* SHINE */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
                }}
              />

              {/* TOP ACCENT BAR */}
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.main}, ${theme.light}, ${theme.main}, transparent)`,
                }}
              />

              <div className="p-10 text-center">
                {/* ICON */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* OUTER RING */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: theme.glowRadial,
                        margin: -16,
                      }}
                    />
                    {/* MIDDLE RING */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, delay: 0.4, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: theme.glowRadial,
                        margin: -8,
                      }}
                    />

                    {/* ICON CIRCLE */}
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.3,
                        duration: 0.6,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="relative w-24 h-24 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${theme.glowRadial}, transparent)`,
                        border: `1px solid ${theme.border}`,
                        boxShadow: `0 0 30px ${theme.shadow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                      }}
                    >
                      {isPending ? (
                        <motion.svg
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-11 h-11"
                          style={{ color: theme.light }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                          />
                        </motion.svg>
                      ) : isFailed ? (
                        <motion.svg
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5, duration: 0.4 }}
                          className="w-12 h-12"
                          style={{ color: theme.light }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                              delay: 0.5,
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                          />
                        </motion.svg>
                      ) : (
                        <motion.svg
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          className="w-12 h-12"
                          style={{ color: theme.light }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                              delay: 0.5,
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                          />
                        </motion.svg>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* STATUS BADGE */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center mb-4"
                >
                  <span
                    className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.35em]"
                    style={{
                      background: theme.bgSubtle,
                      border: `1px solid ${theme.border}`,
                      color: theme.light,
                    }}
                  >
                    {isPending
                      ? "⏳ PENDING"
                      : isFailed
                        ? "✕ FAILED"
                        : "✓ PAID"}
                  </span>
                </motion.div>

                {/* TITLE */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="font-black uppercase italic leading-[0.9] mb-3"
                  style={{
                    fontSize: "clamp(2rem, 6vw, 2.75rem)",
                    color: "#fff",
                  }}
                >
                  {isPending ? (
                    <>
                      Sedang
                      <br />
                      <span
                        style={{
                          WebkitTextStroke: "1.5px rgba(255,255,255,0.25)",
                          color: "transparent",
                        }}
                      >
                        Diproses
                      </span>
                    </>
                  ) : isFailed ? (
                    <>
                      Pembayaran
                      <br />
                      <span style={{ color: theme.light }}>Gagal!</span>
                    </>
                  ) : (
                    <>
                      Pembayaran
                      <br />
                      <span style={{ color: theme.light }}>Berhasil!</span>
                    </>
                  )}
                </motion.h1>

                {/* DESCRIPTION FOR FAILED STATUS */}
                {isFailed && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className="text-xs font-medium leading-relaxed mb-6 px-2"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Transaksi Anda tidak dapat diproses atau telah dibatalkan.
                    Stok barang yang sempat dipesan telah dikembalikan.
                  </motion.p>
                )}

                {/* ORDER NUMBER */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  className="mb-8 p-4 rounded-2xl"
                  style={{
                    background: theme.bgSubtle,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.3em] mb-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Nomor Transaksi
                  </p>
                  <p
                    className="font-black text-xl tracking-widest"
                    style={{
                      color: theme.light,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    #{orderId ? orderId : <CountUp target={847291} />}
                  </p>
                </motion.div>

                {/* DIVIDER */}
                <div
                  className="mb-8 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)",
                  }}
                />

                {/* BUTTONS */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-3"
                >
                  {/* MAIN BUTTON */}
                  {isFailed ? (
                    <a
                      href="/cart"
                      className="relative flex items-center justify-center gap-2.5 w-full h-13 rounded-xl font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-200 active:scale-[0.99]"
                      style={{
                        height: 52,
                        background: theme.gradient,
                        color: "#ffffff",
                        border: `1px solid ${theme.border}`,
                        boxShadow: `0 8px 24px ${theme.shadow}`,
                      }}
                    >
                      <span
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 2.5s infinite",
                        }}
                      />
                      <svg
                        className="w-4 h-4 relative"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                      <span className="relative">Coba Pembayaran Lagi</span>
                    </a>
                  ) : (
                    <a
                      href="/"
                      className="relative flex items-center justify-center gap-2.5 w-full h-13 rounded-xl font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-200 active:scale-[0.99]"
                      style={{
                        height: 52,
                        background: theme.gradient,
                        color: "#0a0a0a",
                        border: `1px solid ${theme.border}`,
                        boxShadow: `0 8px 24px ${theme.shadow}`,
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
                      <svg
                        className="w-4 h-4 relative"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>
                      <span className="relative">Kembali ke Beranda</span>
                    </a>
                  )}

                  {/* SECONDARY BUTTON */}
                  <a
                    href="/product"
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl text-xs font-medium uppercase tracking-[0.2em] transition-all duration-200"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.35)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.18)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                    }}
                  >
                    Jelajahi Produk Lainnya
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
