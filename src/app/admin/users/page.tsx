"use client";

import { motion } from "framer-motion";
import {
  Users,
  Search,
  MoreHorizontal,
  Mail,
  ShieldCheck,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Calendar,
  Pencil,
  Trash2,
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

  // State Search & Pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

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

  // Reset page ke 1 saat pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Format Tanggal Aman
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  // Filter Users
  const filteredUsers = users.filter((u) => {
    const searchLower = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower) ||
      u.id?.toString().toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div
      className={`${inter.className} min-h-screen bg-slate-50/50 p-6 md:p-10 antialiased text-slate-950`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              User Management
            </h1>
            <p className="text-sm text-slate-500">
              Manage and view registered customer accounts and their
              transactions.
            </p>
          </div>
        </div>

        {/* SHADCN CARD CONTAINER */}
        <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
          {/* CARD HEADER & TOOLBAR */}
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900">
                User Directory
              </h2>
              <p className="text-xs text-slate-500">
                Showing {filteredUsers.length} total users in system
              </p>
            </div>

            {/* SHADCN-STYLE INPUT */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by name, email, or ID..."
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b border-slate-100 transition-colors bg-slate-50/50 text-slate-500 text-xs font-medium">
                  <th className="h-10 px-6 text-left align-middle font-medium">
                    User
                  </th>
                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Email
                  </th>
                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Role
                  </th>
                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Transactions
                  </th>
                  <th className="h-10 px-6 text-left align-middle font-medium">
                    Joined Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* LOADING SKELETON */}
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-200 shrink-0"></div>
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-28 bg-slate-200 rounded"></div>
                            <div className="h-2.5 w-16 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-3.5 w-36 bg-slate-200 rounded"></div>
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-3.5 w-20 bg-slate-200 rounded"></div>
                      </td>
                      <td className="p-4 px-6">
                        <div className="h-3.5 w-24 bg-slate-200 rounded"></div>
                      </td>
                      <td className="p-4 px-6 text-right">
                        <div className="h-8 w-8 bg-slate-200 rounded-md ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : paginatedUsers.length === 0 ? (
                  /* EMPTY STATE */
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 text-slate-500">
                        <Users className="h-8 w-8 stroke-[1.5] text-slate-400" />
                        <p className="text-sm font-medium text-slate-900">
                          No users found
                        </p>
                        <p className="text-xs text-slate-500">
                          {search
                            ? `No matches for "${search}"`
                            : "There are no users registered yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* DATA ROWS */
                  paginatedUsers.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                    >
                      {/* USER INFO */}
                      <td className="p-4 px-6 align-middle">
                        <div className="flex items-center gap-3">
                          {/* SHADCN AVATAR */}
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700">
                            {item.name
                              ? item.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm leading-none">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 font-mono">
                              #{item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="p-4 px-6 align-middle text-slate-600">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          {item.email}
                        </div>
                      </td>

                      {/* ROLE - SHADCN BADGE STYLE */}
                      <td className="p-4 px-6 align-middle">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            item.role === "admin"
                              ? "bg-slate-900 text-slate-50 ring-slate-900"
                              : "bg-slate-100 text-slate-700 ring-slate-200"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>

                      {/* TOTAL TRANSAKSI */}
                      <td className="p-4 px-6 align-middle">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span className="font-medium text-slate-900">
                            {item.reservations_count ?? 0}
                          </span>
                          <span className="text-slate-500">orders</span>
                        </div>
                      </td>

                      {/* JOINED DATE */}
                      <td className="p-4 px-6 align-middle text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          {formatDate(item.created_at)}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* SHADCN-STYLE FOOTER & PAGINATION */}
          {!loading && filteredUsers.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <p className="text-xs text-slate-500">
                Page{" "}
                <span className="font-medium text-slate-900">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900">{totalPages}</span>
              </p>

              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex h-8 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                  Previous
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  className="inline-flex h-8 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-50 transition-colors"
                >
                  Next
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
