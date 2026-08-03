import axiosInstance from "@/lib/api/axios";
import { ReportsSummary } from "./reports.model";

export async function getReportsSummary(): Promise<ReportsSummary> {
  const res = await axiosInstance.get("/admin/reports/summary");
  return res.data?.data ?? res.data;
}