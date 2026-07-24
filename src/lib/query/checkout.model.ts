import { CartItem } from "./carts.model";

export interface CheckoutSummary {
  cart_items: CartItem[];
  subtotal: number;
  discount: number;
  grand_total: number;
  eligible_discount: boolean;
  purchase_count: number;
}