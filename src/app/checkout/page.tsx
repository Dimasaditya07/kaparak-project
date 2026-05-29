"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  MapPin,
  Phone,
  User,
  CalendarDays,
  Wallet,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">
          Checkout Reservasi
        </h1>

        <p className="text-gray-500 mt-2">
          Lengkapi data penyewaan dan pembayaran
        </p>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-7">
          {/* CUSTOMER INFO */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <User className="text-emerald-600" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Informasi Penyewa
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Data customer untuk reservasi
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">
                  Nama Lengkap
                </label>

                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">
                  Nomor HP
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    className="w-full h-14 rounded-2xl border border-gray-200 pl-14 pr-5 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-700 block mb-2">
                  Alamat
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-5 top-5 text-gray-400"
                  />

                  <textarea
                    rows={4}
                    placeholder="Masukkan alamat lengkap"
                    className="w-full rounded-2xl border border-gray-200 pl-14 pr-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* RENTAL DATE */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <CalendarDays className="text-blue-600" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Tanggal Rental
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Tentukan jadwal peminjaman
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">
                  Tanggal Pinjam
                </label>

                <input
                  type="date"
                  className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">
                  Tanggal Kembali
                </label>

                <input
                  type="date"
                  className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* PAYMENT */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center">
                <Wallet className="text-yellow-500" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Metode Pembayaran
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Pilih metode pembayaran reservasi
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {["Transfer Bank", "E-Wallet", "Cash On Store"].map(
                (method, i) => (
                  <label
                    key={i}
                    className="flex items-center justify-between border border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-emerald-500 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900">{method}</h3>

                        <p className="text-sm text-gray-500">
                          Pembayaran aman & cepat
                        </p>
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="payment"
                      className="w-5 h-5 accent-emerald-600"
                    />
                  </label>
                ),
              )}
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm sticky top-6">
            <h2 className="text-2xl font-black text-gray-900 mb-7">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-5">
              {/* ITEM */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Tenda Consina 4P</h3>

                  <p className="text-sm text-gray-500 mt-1">1 Item × 3 Hari</p>
                </div>

                <span className="font-bold text-gray-900">Rp255.000</span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Carrier Eiger 60L</h3>

                  <p className="text-sm text-gray-500 mt-1">2 Item × 2 Hari</p>
                </div>

                <span className="font-bold text-gray-900">Rp180.000</span>
              </div>

              {/* TOTAL */}
              <div className="border-t border-dashed border-gray-200 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-bold text-gray-900">Rp435.000</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Biaya Admin</span>

                  <span className="font-bold text-gray-900">Rp5.000</span>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-5 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>

                  <span className="text-3xl font-black text-emerald-600">
                    Rp440K
                  </span>
                </div>
              </div>

              {/* SECURITY */}
              <div className="bg-emerald-50 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="text-emerald-600" />
                </div>

                <div>
                  <h3 className="font-bold text-emerald-700">Reservasi Aman</h3>

                  <p className="text-sm text-emerald-600 mt-1 leading-relaxed">
                    Data reservasi dan pembayaran dilindungi sistem keamanan.
                  </p>
                </div>
              </div>

              {/* BUTTON */}
              <button className="w-full h-14 rounded-2xl bg-emerald-600 text-white font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                Bayar Sekarang
                <ArrowRight size={18} />
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Dengan melanjutkan checkout, Anda menyetujui syarat dan
                ketentuan rental.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
