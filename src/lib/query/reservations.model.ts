export interface User {
  id: number;
  name: string;
  email?: string;
}

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "picked_up"
  | "returned"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "paid"
  | "failed"
  | "refunded";

export interface Reservation {
  id: number;
  user_id: number;
  code: string;
  total: number;
  pickup_date: string;
  return_date: string;
  status: ReservationStatus;
  payment_status: PaymentStatus;
  note: string | null;
  created_at: string;
  updated_at: string;

  user?: User;
}

export interface ReservationResponse {
  data: Reservation[];
}