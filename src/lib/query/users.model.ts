export interface UserItem {
  id: number;

  // Nama user
  name: string;

  // Email login user
  email: string;

  // Verifikasi email
  email_verified_at: string | null;

  // Nomor telepon user
  phone: string | null;

  // Alamat user
  address: string | null;

  // Foto KTP user
  image_ktp: string | null;

  // Role user
  role: "admin" | "customer";

  // Waktu dibuat
  created_at: string;

  // Waktu update
  updated_at: string;
}

export interface UserResponse {
  data: UserItem[];
}