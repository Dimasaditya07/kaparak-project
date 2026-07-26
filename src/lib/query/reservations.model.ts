import { PackageItem } from "./package.model";
import { Review } from "./review.model";

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

export interface ReservationProduct {
  id: number;
  code: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  category?: { name: string } | null;
}

export interface ReservationItem {
  id: number;
  reservation_id: number;
  product_id: number | null;
  package_id: number | null;
  quantity: number;
  price: number;
  subtotal: number;

  // Hanya salah satu yang terisi, tergantung item-nya produk satuan atau paket
  product?: ReservationProduct | null;
  package?: PackageItem | null;
}

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
  // NOTE: sesuaikan nama field ini dengan nama relasi hasMany di model
  // Reservation.php Anda (mis. reservationItems() atau items()).
  reservationItems?: ReservationItem[];
  review?: Review | null;
}

export interface ReservationResponse {
  data: Reservation[];
}

export interface ReservationDetailResponse {
  data: Reservation;
}