"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleLoginHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const name = searchParams.get("name");

    if (!token) return;

    localStorage.setItem("token", token);

    if (role) {
      localStorage.setItem("role", role);
    }

    if (name) {
      localStorage.setItem("name", name);
    }

    // Hapus query parameter agar URL kembali bersih
    router.replace("/");
  }, [router, searchParams]);

  return null;
}
