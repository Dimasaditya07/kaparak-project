import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function VerifyEmailSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 p-10">
        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 size={56} className="text-green-600" />
          </div>
        </div>

        <h1 className="mt-8 text-center text-3xl font-bold text-gray-900">
          Email Berhasil Diverifikasi 🎉
        </h1>

        <p className="mt-4 text-center text-gray-600 leading-7">
          Selamat! Email akun <span className="font-semibold">KAPARAK</span>{" "}
          Anda telah berhasil diverifikasi.
        </p>

        <p className="mt-2 text-center text-gray-500">
          Sekarang Anda sudah dapat login dan mulai melakukan penyewaan
          perlengkapan outdoor.
        </p>

        <div className="mt-10">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl bg-[#19622B] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#144d21]"
          >
            Login Sekarang
          </Link>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-[#19622B] hover:underline"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
