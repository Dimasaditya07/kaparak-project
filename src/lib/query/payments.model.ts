export type PaymentStatus = "pending" | "paid" | "failed";

export interface Payment {
  id: number;
  reservation_id: number;
  order_id: string | null;
  snap_token: string | null;
  transaction_id: string | null;
  payment_method: string;
  amount: number;
  proof: string | null;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}