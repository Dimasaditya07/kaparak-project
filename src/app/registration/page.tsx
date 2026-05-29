"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@/components/icons/UserIcon";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { AxiosError } from "axios";

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
        password_confirmation: passwordConfirmation, // Sesuai standar validasi Laravel
      });

      // Ambil data dari response (auto login setelah daftar)
      const { token, role, name: userName } = response.data;

      // Simpan ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", userName);

      alert("Registrasi berhasil! Selamat datang di Kaparak.");

      // Arahkan ke dashboard customer
      router.push("/login");
    } catch (err) {
      const error = err as AxiosError<{ message?: string; errors?: unknown }>;
      console.error("Register Error:", error);

      // Tampilkan pesan error (misal: email sudah dipakai)
      alert(
        error.response?.data?.message || "Registrasi gagal, silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden bg-black font-sans">
      {/* 1. BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bgkaparak2.jpg"
          alt="Adventure Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 md:bg-transparent md:bg-linear-to-r md:from-black/80 md:via-black/40 md:to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 text-white text-center md:text-left"
        >
          <h1 className="text-5xl md:text-[7.5rem] font-black uppercase tracking-tight leading-[0.8] mb-8">
            JOIN THE <br />
            <span className="text-transparent stroke-text-thin italic">
              ADVENTURE
            </span>
          </h1>

          <div className="space-y-4 max-w-sm mx-auto md:mx-0 border-l-2 border-green-500 pl-6">
            <p className="font-sans text-sm md:text-lg text-gray-200 font-medium leading-relaxed italic">
              Your Journey Starts Right Here.
            </p>
            <p className="font-sans text-[10px] text-gray-400 uppercase tracking-[0.3em] leading-loose opacity-60">
              Create an account to access premium outdoor gear and start
              exploring the horizons.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="w-full md:max-w-112.5" /* Sedikit lebih lebar untuk menampung grid password */
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
                  alt="KAPARAK Logo"
                  width={120}
                  height={40}
                  className="object-contain brightness-0 invert"
                />
              </Link>
            </motion.div>

            <motion.h4
              variants={itemVariants}
              className="text-4xl md:text-3xl font-black uppercase tracking-tight leading-[0.8] mb-6 text-center text-white"
            >
              Register
            </motion.h4>

            <form className="space-y-3" onSubmit={handleRegister}>
              {/* INPUT NAMA LENGKAP */}
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-300 ml-1">
                  Full Name
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
                    placeholder="John Doe"
                    className="w-full bg-white border-none px-6 py-3.5 pl-12 rounded-2xl text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                  />
                </div>
              </motion.div>

              {/* INPUT EMAIL */}
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {/* Ikon Amplop / Mail */}
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
                    placeholder="email@example.com"
                    className="w-full bg-white border-none px-6 py-3.5 pl-12 rounded-2xl text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                  />
                </div>
              </motion.div>

              {/* GRID UNTUK PASSWORD & CONFIRM PASSWORD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-300 ml-1">
                    Password
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

                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-300 ml-1">
                    Confirm
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

              {/* TERMS CHECKBOX */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 pt-2 pb-1 pl-1"
              >
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 accent-green-600 bg-white/10 border-white/20 rounded cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="font-mono text-[9px] text-gray-300 uppercase tracking-widest cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="text-white border-b border-green-500 hover:text-green-500 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </label>
              </motion.div>

              {/* BUTTON REGISTER */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 text-white font-black uppercase tracking-[0.3em] text-[11px] py-4 mt-2 rounded-2xl shadow-xl hover:bg-white hover:text-black transition-all"
              >
                Create Account
              </motion.button>

              {/* DIVIDER */}
              <motion.div
                variants={itemVariants}
                className="relative flex items-center gap-4 py-2"
              >
                <div className="grow h-px bg-white/10"></div>
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  or
                </span>
                <div className="grow h-px bg-white/10"></div>
              </motion.div>

              {/* GOOGLE SIGN IN */}
              <motion.button
                variants={itemVariants}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-mono text-[10px] uppercase tracking-widest py-4 rounded-2xl transition-all"
              >
                <GoogleIcon className="w-4 h-4" />{" "}
                {/* Memanggil GoogleIcon disini */}
                Sign in with Google
              </motion.button>
            </form>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="font-sans text-[11px] text-gray-400 uppercase tracking-widest">
                Already an explorer?{" "}
                <Link
                  href="/login" // Pastikan arah link sesuai dengan file login kamu
                  className="text-white font-bold border-b border-green-500 hover:text-green-500 transition-colors ml-1"
                >
                  Sign In
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
