import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  // Langsung arahkan ke /admin/dashboard
  redirect("/admin/dashboard");
}