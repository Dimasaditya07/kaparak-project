import Sidebar from "@/components/layout/sidebar";
import AdminGuard from "@/components/auth/AdminGuard";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0a0a0a] flex">
        <Sidebar />

        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={false}
          duration={3000}
        />

        <main className="flex-1 flex bg-white rounded-l-[2.5rem] overflow-hidden shadow-2xl relative mt-4 mb-4 mr-4">
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}
