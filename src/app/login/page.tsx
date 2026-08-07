"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { UserIcon } from "@/components/icons/UserIcon";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setVerified(params.get("verified") === "1");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/login", {
        email,
        password,
      });

      const { token, role, name } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("role", role);

      toast.success("Login berhasil!", {
        description: `Selamat datang kembali, ${name}.`,
      });

      // Beri sedikit waktu agar toast terlihat
      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 500);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      if (
        error.response?.status === 403 &&
        error.response.data?.message === "Email belum diverifikasi."
      ) {
        toast.warning("Email belum diverifikasi", {
          description: "Silakan verifikasi email terlebih dahulu.",
        });

        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }, 500);

        return;
      }

      toast.error("Login gagal", {
        description:
          error.response?.data?.message ??
          "Pastikan email dan kata sandi yang kamu masukkan benar.",
      });
    } finally {
      setLoading(false);
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut" as const,
      },
    },
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
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="w-full md:w-1/2 text-white text-center md:text-left"
        >
          <h1 className="text-5xl md:text-[7.5rem] font-black uppercase tracking-tight leading-[0.8] mb-8">
            JELAJAHI
            <br />
            <span className="text-transparent text-8xl stroke-text-thin italic">
              CAKRAWALA
            </span>
          </h1>

          <div className="space-y-4 max-w-sm mx-auto md:mx-0 border-l-2 border-green-500 pl-6">
            <p className="font-sans text-sm md:text-lg text-gray-200 font-medium leading-relaxed italic">
              Wujudkan Destinasi Impianmu Menjadi Kenyataan.
            </p>

            <p className="font-sans text-[10px] text-gray-400 uppercase tracking-[0.3em] leading-loose opacity-60">
              Mulailah perjalananmu dan temukan pengalaman luar biasa di setiap
              sudut petualangan.
            </p>
          </div>
        </motion.div>

        {/* BAGIAN KANAN: KOTAK LOGIN */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="w-full md:max-w-112.5"
        >
          <div className="backdrop-blur-3xl bg-white/8 border border-white/20 p-8 md:p-12 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
            {/* LOGO */}
            <motion.div
              variants={itemVariants}
              className="mb-10 flex justify-center"
            >
              <Link href="/">
                <Image
                  src="/images/kaparak3.png"
                  alt="Logo KAPARAK"
                  width={140}
                  height={50}
                  className="object-contain brightness-0 invert"
                />
              </Link>
            </motion.div>

            {/* JUDUL */}
            <motion.h4
              variants={itemVariants}
              className="text-4xl md:text-3xl font-black uppercase tracking-tight leading-[0.8] mb-6 text-center text-white"
            >
              Login
            </motion.h4>

            {/* FORM */}
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* INPUT EMAIL */}
              <motion.div variants={itemVariants} className="space-y-1">
                <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-300 ml-1">
                  Alamat Email
                </label>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    className="w-full bg-white border-none px-6 py-4 pl-12 rounded-2xl text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                  />
                </div>
              </motion.div>

              {/* INPUT PASSWORD */}
              <motion.div variants={itemVariants} className="space-y-1">
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full bg-white border-none px-6 py-4 pl-12 rounded-2xl text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                  />
                </div>

                {/* LUPA PASSWORD */}
                <div className="text-right mt-1">
                  <Link
                    href="/forgot-password"
                    className="font-mono text-[9px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
              </motion.div>

              {/* TOMBOL MASUK */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 text-white font-black uppercase tracking-[0.3em] text-[11px] py-4 rounded-2xl shadow-xl hover:bg-white hover:text-black transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Login"}
              </motion.button>
            </form>

            {/* PESAN VERIFIKASI */}
            {verified && (
              <div className="mt-5 rounded-xl bg-green-500/15 border border-green-500/30 p-4 text-sm text-green-200">
                Email berhasil diverifikasi. Silakan masuk ke akun Anda.
              </div>
            )}

            {/* LINK REGISTRASI */}
            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="font-sans text-[11px] text-gray-400 uppercase tracking-widest">
                Belum punya akun?{" "}
                <Link
                  href="/registration"
                  className="text-white font-bold border-b border-green-500 hover:text-green-500 transition-colors ml-1 pb-0.5"
                >
                  Buat Akun
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* STYLE UNTUK TEXT STROKE */}
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
