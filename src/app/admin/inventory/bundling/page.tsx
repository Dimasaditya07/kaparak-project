"use client";

import { motion } from "framer-motion";
import {
  PackageSearch,
  Plus,
  CalendarCheck2,
  Clock3,
  CircleCheckBig,
} from "lucide-react";

export default function Bundling() {
  const bundles = [
    {
      name: "Paket Camping Basic",
      items: "Tenda + Sleeping Bag + Matras",
      price: "Rp120.000",
      status: "Available",
    },
    {
      name: "Paket Hiking Pro",
      items: "Carrier + Sepatu + Trekking Pole",
      price: "Rp180.000",
      status: "Booked",
    },
    {
      name: "Paket Family Camp",
      items: "Tenda 6P + Kompor + Lampu",
      price: "Rp250.000",
      status: "Available",
    },
    {
      name: "Paket Adventure",
      items: "Tenda + Carrier + Cooking Set",
      price: "Rp320.000",
      status: "Maintenance",
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] p-10">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Bundling Inventory
          </h1>

          <p className="text-gray-500 mt-1">
            Kelola paket bundling perlengkapan outdoor
          </p>
        </div>

        <button className="bg-emerald-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
          <Plus size={18} />
          Tambah Bundling
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bundling</p>
              <h2 className="text-3xl font-black text-gray-900 mt-2">24</h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <PackageSearch className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Booked</p>
              <h2 className="text-3xl font-black text-gray-900 mt-2">8</h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <CalendarCheck2 className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <h2 className="text-3xl font-black text-gray-900 mt-2">12</h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CircleCheckBig className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Maintenance</p>
              <h2 className="text-3xl font-black text-gray-900 mt-2">4</h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Clock3 className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* CARD */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bundles.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all"
          >
            {/* TOP */}
            <div className="flex items-start justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <PackageSearch className="text-emerald-600" />
              </div>

              <span
                className={`px-4 py-1 rounded-full text-xs font-bold ${
                  item.status === "Available"
                    ? "bg-emerald-100 text-emerald-700"
                    : item.status === "Booked"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* CONTENT */}
            <h3 className="text-2xl font-black text-gray-900">{item.name}</h3>

            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              {item.items}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Harga Rental</p>

                <h4 className="text-xl font-black text-emerald-600 mt-1">
                  {item.price}
                </h4>
              </div>

              <button className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:scale-105 transition-all">
                Detail
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
