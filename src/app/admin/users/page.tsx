"use client";

import { motion } from "framer-motion";
import {
  Users,
  Search,
  Edit,
  Trash2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

import { getUsers } from "@/lib/query/users";
import { UserItem } from "@/lib/query/users.model";

const inter = Inter({
  subsets: ["latin"],
});

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await getUsers();

      setUsers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`${inter.className} flex-1 min-h-screen bg-slate-50 p-8 lg:p-12 antialiased`}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              User Management
            </h1>

            <p className="text-slate-500 mt-1 text-sm">
              Kelola seluruh pengguna website rental outdoor
            </p>
          </div>

          <div className="bg-black text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm">
            <Users size={18} />
            <span className="text-sm font-medium">
              Total User {users.length}
            </span>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* TOPBAR */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                User List
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Semua data customer yang terdaftar
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full sm:w-[280px]">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search user..."
                className="w-full h-11 rounded-xl border border-slate-200 pl-11 pr-4 outline-none focus:ring-2 focus:ring-black text-sm"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="py-4 px-6 font-medium">Username</th>

                  <th className="py-4 px-6 font-medium">Email</th>

                  <th className="py-4 px-6 font-medium">Role</th>

                  <th className="py-4 px-6 font-medium">
                    Tanggal Bergabung
                  </th>

                  <th className="py-4 px-6 font-medium text-right">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* LOADING */}
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={i}
                      className="animate-pulse"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-200"></div>

                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-slate-200 rounded-md"></div>

                            <div className="h-3 w-20 bg-slate-200 rounded-md"></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-4 w-40 bg-slate-200 rounded-md"></div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-4 w-28 bg-slate-200 rounded-md"></div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-8 w-16 bg-slate-200 rounded-lg ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  // EMPTY
                  <tr>
                    <td
                      colSpan={5}
                      className="py-16 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Users
                          size={48}
                          strokeWidth={1}
                          className="mb-4"
                        />

                        <p className="text-slate-600 font-medium">
                          Belum ada user
                        </p>

                        <p className="text-sm">
                          Data user akan muncul di sini.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // DATA
                  users.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* USER */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center shrink-0">
                            {item.name.charAt(0)}
                          </div>

                          <div>
                            <p className="font-medium text-slate-900 text-sm">
                              {item.name}
                            </p>

                            <p className="text-xs text-slate-500 mt-0.5">
                              ID: #{item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Mail size={15} />

                          {item.email}
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            item.role === "admin"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          <ShieldCheck
                            size={12}
                            className="mr-1"
                          />

                          {item.role}
                        </span>
                      </td>

                      {/* CREATED */}
                      <td className="py-4 px-6">
                        <span className="text-sm text-slate-600">
                          {new Date(
                            item.created_at
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>

                          <button className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}