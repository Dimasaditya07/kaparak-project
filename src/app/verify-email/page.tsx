"use client";

import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <MailCheck className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-3">Verifikasi Email</h1>

        <p className="text-slate-600 leading-7">
          Kami telah mengirimkan email verifikasi ke:
        </p>

        <p className="font-semibold text-green-600 mt-2">{email}</p>

        <p className="mt-6 text-sm text-slate-500">
          Silakan buka email tersebut kemudian tekan tombol
          <strong> Verify Email Address</strong>.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Setelah berhasil diverifikasi Anda akan otomatis diarahkan ke halaman
          Login.
        </p>

        <div className="mt-8">
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </main>
  );
}
