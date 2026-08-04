/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "@/lib/api/axios";
import { AxiosError } from "axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") ?? "");
    setEmail(params.get("email") ?? "");
  }, []);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/login?reset=success");
      }, 1200);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message ?? "Reset password gagal.");
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
              Reset
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
              Buat password baru untuk akun KAPARAK Anda.
            </p>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center py-6"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{
                      background: "rgba(74,222,128,0.12)",
                      border: "1px solid rgba(74,222,128,0.3)",
                    }}
                  >
                    <svg
                      className="w-7 h-7"
                      style={{ color: "#4ade80" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <p className="font-bold text-lg mb-1">
                    Password Berhasil Diperbarui
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Mengarahkan ke halaman login...
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* EMAIL (READONLY) */}
                  <div>
                    <label
                      className="block text-[10px] font-bold uppercase tracking-[0.25em] mb-2"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full h-12 rounded-xl px-4 text-sm outline-none"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    />
                  </div>

                  {/* NEW PASSWORD */}
                  <div>
                    <label
                      className="block text-[10px] font-bold uppercase tracking-[0.25em] mb-2"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 8 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full h-12 rounded-xl pl-4 pr-11 text-sm outline-none transition-all duration-200"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#fff",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(74,222,128,0.5)";
                          e.currentTarget.style.background =
                            "rgba(74,222,128,0.05)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(255,255,255,0.1)";
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.05)";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label
                      className="block text-[10px] font-bold uppercase tracking-[0.25em] mb-2"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      Konfirmasi Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ulangi password baru"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required
                      className="w-full h-12 rounded-xl px-4 text-sm outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(74,222,128,0.5)";
                        e.currentTarget.style.background =
                          "rgba(74,222,128,0.05)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.1)";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)";
                      }}
                    />
                  </div>

                  {/* ERROR */}
                  {error && (
                    <div
                      className="rounded-xl px-4 py-3 text-xs"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#f87171",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full h-13 mt-2 rounded-xl font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 disabled:opacity-50"
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
                      {loading ? "Menyimpan..." : "Reset Password"}
                    </span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {!success && (
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
            )}
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
