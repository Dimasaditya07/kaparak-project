"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post("/forgot-password", { email });
      router.push("/forgot-password/success");
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr.response?.data?.message ?? "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
      style={{ background: "#0a0a0a", color: "#fff" }}
    >
      {/* AMBIENT BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute"
          style={{
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)",
            top: "-10%",
            left: "-10%",
            filter: "blur(60px)",
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
            right: "-5%",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="relative overflow-hidden"
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

          <div className="p-9">
            {/* EYEBROW */}
            <div className="flex items-center gap-3 mb-5">
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
                Account Recovery
              </span>
            </div>

            {/* TITLE */}
            <h1
              className="font-black uppercase italic leading-[0.9] mb-3"
              style={{ fontSize: "clamp(2rem, 6vw, 2.5rem)" }}
            >
              Forgot
              <br />
              <span
                style={{
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.25)",
                  color: "transparent",
                }}
              >
                Password
              </span>
            </h1>

            <p
              className="text-sm mb-8"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Masukkan email akun Anda, kami akan kirimkan link untuk reset
              password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL */}
              <div>
                <label
                  className="block text-[10px] font-bold uppercase tracking-[0.25em] mb-2"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-12 rounded-xl px-4 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(74,222,128,0.5)";
                    e.currentTarget.style.background = "rgba(74,222,128,0.05)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                />
              </div>

              {/* ERROR */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl px-4 py-3 text-xs overflow-hidden"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      color: "#f87171",
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full mt-2 rounded-xl font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 disabled:opacity-50"
                style={{
                  height: 52,
                  background: loading
                    ? "rgba(255,255,255,0.06)"
                    : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: loading ? "rgba(255,255,255,0.4)" : "#0a0a0a",
                  border: "1px solid rgba(74,222,128,0.3)",
                }}
              >
                {!loading && (
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2.5s infinite",
                    }}
                  />
                )}
                <span className="relative">
                  {loading ? "Mengirim..." : "Kirim Link Reset"}
                </span>
              </button>
            </form>

            <p
              className="text-center text-xs mt-6"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Sudah ingat password?{" "}
              <a
                href="/login"
                className="font-medium"
                style={{ color: "#4ade80" }}
              >
                Kembali ke Login
              </a>
            </p>
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
