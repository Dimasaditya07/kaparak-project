/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");

    // ADMIN tidak boleh masuk halaman customer
    if (role === "admin") {
      router.replace("/admin");
      return;
    }

    setChecking(false);
  }, [router]);

  // Jangan tampilkan landing page sebelum role selesai dicek
  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0a0a" }}
      >
        <div
          className="w-10 h-10 rounded-full"
          style={{
            border: "1.5px solid rgba(255,255,255,0.08)",
            borderTop: "1.5px solid #4ade80",
            animation: "spin 0.9s linear infinite",
          }}
        />

        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
