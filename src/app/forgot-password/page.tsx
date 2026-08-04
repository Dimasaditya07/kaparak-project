"use client";

import { useState } from "react";
import axios from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await axios.post("/forgot-password", {
        email,
      });

      router.push("/forgot-password/success");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      alert(error.response?.data?.message ?? "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 bg-white rounded-xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold">Forgot Password</h1>

        <p className="text-gray-500">Masukkan email akun Anda.</p>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded-lg p-3"
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white rounded-lg p-3"
        >
          {loading ? "Mengirim..." : "Kirim Link Reset"}
        </button>
      </form>
    </div>
  );
}
