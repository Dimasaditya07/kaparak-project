import axiosInstance from "@/lib/api/axios";
import { DashboardSummary } from "./dashboard.model";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await axiosInstance.get("/admin/dashboard/summary");
  return res.data?.data ?? res.data;
}