/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { AxiosError } from "axios";
import { UserIcon } from "@/components/icons/UserIcon";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeInOut" as const },
    },
  };

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana di frontend
    if (password !== passwordConfirmation) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      // Kirim data ke API backend Laravel
      const response = await axios.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      // Ambil data dari response
      const { token, role, name: userName } = response.data;

      // Simpan ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", userName);

      alert("Registrasi berhasil! Selamat datang di KAPARAK.");

      // Arahkan ke halaman verifikasi email
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const error = err as AxiosError<{
        message?: string;
        errors?: unknown;
      }>;

      console.error("Register Error:", error);

      alert(
        error.response?.data?.message || "Registrasi gagal, silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden bg-black font-sans">
      {/* KEMBALI KE BERANDA */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 left-6 md:top-8 md:left-8 z-30"
      >
        <Link
          href="/"
          className="group flex items-center gap-3 px-4 py-2.5 rounded-full backdrop-blur-xl transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <span
            className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 group-hover:-translate-x-0.5"
            style={{
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.2)",
            }}
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
              style={{ color: "#4ade80" }}
            />
          </span>

          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Kembali ke Beranda
          </span>
        </Link>
      </motion.div>

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bgkaparak2.jpg"
          alt="Latar Belakang Petualangan"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40 md:bg-transparent md:bg-linear-to-r md:from-black/80 md:via-black/40 md:to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12">
        {/* BAGIAN KIRI: BRANDING & TEKS */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 text-white text-center md:text-left"
        >
          <h1 className="text-4xl md:text-[7.5rem] font-black uppercase tracking-tight leading-[0.8] mb-8">
            MULAI <br />
            <span className="text-transparent text-7xl stroke-text-thin italic">
              PETUALANGANMU
            </span>
          </h1>

          <div className="space-y-4 max-w-sm mx-auto md:mx-0 border-l-2 border-green-500 pl-6">
            <p className="font-sans text-sm md:text-lg text-gray-200 font-medium leading-relaxed italic">
              Perjalananmu Dimulai dari Sini.
            </p>

            <p className="font-sans text-[10px] text-gray-400 uppercase tracking-[0.3em] leading-loose opacity-60">
              Buat akun untuk mendapatkan akses ke berbagai perlengkapan outdoor
              berkualitas dan mulai menjelajahi berbagai petualangan.
            </p>
          </div>
        </motion.div>

        {/* BAGIAN KANAN: FORM REGISTRASI */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="w-full md:max-w-112.5"
        >
          <div className="backdrop-blur-3xl bg-white/8 border border-white/20 p-8 md:p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
            {/* LOGO */}
            <motion.div
              variants={itemVariants}
              className="mb-8 flex justify-center"
            >
              <Link href="/">
                <Image
                  src="/images/kaparak3.png"
                  alt="Logo KAPARAK"
                  width={120}
                  height={40}
                  className="object-contain brightness-0 invert"
                />
              </Link>
            </motion.div>

            {/* JUDUL */}
            <motion.h4
              variants={itemVariants}
              className="text-4xl md:text-3xl font-black uppercase tracking-tight leading-[0.8] mb-6 text-center text-white"
            >
              Registrasi
            </motion.h4>

            <form className="space-y-3" onSubmit={handleRegister}>
              {/* INPUT NAMA LENGKAP */}
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-300 ml-1">
                  Nama Lengkap
                </label>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap"
                    className="w-full bg-white border-none px-6 py-3.5 pl-12 rounded-2xl text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                  />
                </div>
              </motion.div>

              {/* INPUT EMAIL */}
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-300 ml-1">
                  Alamat Email
                </label>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {/* IKON EMAIL */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    className="w-full bg-white border-none px-6 py-3.5 pl-12 rounded-2xl text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                  />
                </div>
              </motion.div>

              {/* PASSWORD & KONFIRMASI PASSWORD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PASSWORD */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-300 ml-1">
                    Kata Sandi
                  </label>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                    </div>

                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-none px-6 py-3.5 pl-12 rounded-2xl text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                    />
                  </div>
                </motion.div>

                {/* KONFIRMASI PASSWORD */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-300 ml-1">
                    Konfirmasi
                  </label>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                    </div>

                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={8}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full bg-white border-none px-6 py-3.5 pl-12 rounded-2xl text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                    />
                  </div>
                </motion.div>
              </div>

              {/* TOMBOL REGISTRASI */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 text-white font-black uppercase tracking-[0.3em] text-[11px] py-4 mt-2 rounded-2xl shadow-xl hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
              </motion.button>
            </form>

            {/* LINK LOGIN */}
            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="font-sans text-[11px] text-gray-400 uppercase tracking-widest">
                Sudah memiliki akun?{" "}
                <Link
                  href="/login"
                  className="text-white font-bold border-b border-green-500 hover:text-green-500 transition-colors ml-1"
                >
                  Masuk
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .stroke-text-thin {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);
        }

        @media (min-width: 768px) {
          .stroke-text-thin {
            -webkit-text-stroke: 2px rgba(255, 255, 255, 0.4);
          }
        }
      `}</style>
    </main>
  );
}
