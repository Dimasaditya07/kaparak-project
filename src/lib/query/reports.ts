import axiosInstance from "@/lib/api/axios";
import { ReportsSummary, MonthlyReportDetail } from "./reports.model";

export async function getReportsSummary(): Promise<ReportsSummary> {
  const res = await axiosInstance.get("/admin/reports/summary");
  return res.data?.data ?? res.data;
}

export async function getMonthlyReport(
  year: number,
  month: number,
): Promise<MonthlyReportDetail> {
  const res = await axiosInstance.get("/admin/reports/monthly", {
    params: { year, month },
  });
  return res.data?.data ?? res.data;
}