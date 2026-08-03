export interface DashboardStats {
  total_equipment: number;
  active_rentals: number;
  pending_issues: number;
  revenue: number;
}

export interface DashboardSummaryData {
  available_equipment: number;
  pending_approval: number;
  finished_rentals: number;
  total_customers: number;
}

export interface RecentActivity {
  id: number;
  item: string;
  user: string;
  status: string;
}

export interface DashboardSummary {
  stats: DashboardStats;
  summary: DashboardSummaryData;
  recent_activities: RecentActivity[];
}