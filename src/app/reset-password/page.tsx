"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "@/lib/api/axios";
import { AxiosError } from "axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await axios.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      alert("Password berhasil diperbarui.");

      router.push("/login?reset=success");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      alert(error.response?.data?.message ?? "Reset password gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-5"
      >
        <h1 className="text-3xl font-bold">Reset Password</h1>

        <p className="text-gray-500 text-sm">
          Buat password baru untuk akun Anda.
        </p>

        <input
          type="email"
          value={email}
          disabled
          className="w-full border rounded-lg p-3 bg-gray-100"
        />

        <input
          type="password"
          placeholder="Password Baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          className="w-full border rounded-lg p-3"
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white rounded-lg py-3"
        >
          {loading ? "Menyimpan..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
