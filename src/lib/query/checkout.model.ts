import { CartItem } from "./carts.model";

export interface CheckoutSummary {
  cart_items: CartItem[];
  subtotal: number;
  discount: number;
  grand_total: number;
  eligible_discount: boolean;
  purchase_count: number;
}

export interface PendingPayment {
  reservation_id: number;
  code: string;
  snap_token: string;
  total: number;
  created_at: string;
}