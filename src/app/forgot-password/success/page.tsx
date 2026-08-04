import Link from "next/link";

export default function ForgotPasswordSuccess() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-green-600">✓</h1>

        <h2 className="text-2xl font-semibold mt-5">Link berhasil dikirim</h2>

        <p className="text-gray-500 mt-3">
          Silakan cek email Anda untuk melakukan reset password.
        </p>

        <Link
          href="/login"
          className="inline-block mt-8 bg-green-600 text-white px-5 py-3 rounded-lg"
        >
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
}
