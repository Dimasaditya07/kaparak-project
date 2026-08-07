export interface MonthlyRevenue {
  label: string;
  total: number;
}

export interface LatestTransaction {
  id: number;
  code: string;
  customer: string;
  status: string;
  total: number;
}

export interface MonthlyReportDetail {
  month: string;
  year: number;
  total_revenue: number;
  total_transactions: number;
  transactions: LatestTransaction[];
}

export interface ReportsSummary {
  total_revenue: number;
  total_reservations: number;
  total_products: number;
  active_users: number;
  monthly_revenue: MonthlyRevenue[];
  best_month: MonthlyRevenue | null;
  top_item: string;
  latest_transactions: LatestTransaction[];
}