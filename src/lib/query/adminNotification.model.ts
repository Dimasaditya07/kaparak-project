export interface AdminNotificationCount {
  reservation: number;
  payment: number;
  total: number;
}

export interface AdminNotificationReservation {
  id: number;
  code: string;
  user_id: number;
  total: number;
  status: string;
  payment_status: string;
  pickup_date: string;
  return_date: string;
  created_at: string;
  updated_at: string;
}

export interface AdminNotificationPayment {
  id: number;
  reservation_id: number;
  order_id: string;
  payment_method: string;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminNotification {
  id: number;
  admin_id: number;

  type: "reservation" | "payment";

  title: string;
  message: string;

  reservation_id: number | null;
  payment_id: number | null;

  is_read: boolean;

  reservation?: AdminNotificationReservation | null;
  payment?: AdminNotificationPayment | null;

  created_at: string;
  updated_at: string;
}

export interface AdminNotificationPagination {
  current_page: number;
  data: AdminNotification[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
    page: number | null;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}