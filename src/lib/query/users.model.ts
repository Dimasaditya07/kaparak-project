export interface UserItem {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone: string | null;
  address: string | null;
  image_ktp: string | null;
  role: "admin" | "customer";
  created_at: string;
  updated_at: string;
  reservations_count?: number;
}

export interface UserResponse {
  data: UserItem[];
}