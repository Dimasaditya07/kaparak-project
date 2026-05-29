// src/app/admin/layout.tsx
import Sidebar from "@/components/layout/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#050505] font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex bg-white rounded-l-[2.5rem] overflow-hidden shadow-2xl relative mt-4 mb-4 mr-4">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
