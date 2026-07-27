/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PackageProduct {
  id: number;
  package_id: number;
  product_id: number;
  quantity: number;

  product: {
    id: number;
    code: string;
    name: string;
    price: number;
    stock: number;
    image_url: string;
  };
}

export interface PackageItem {
  id: number;

  code: string;
  name: string;
  description: string | null;

  image: string | null;
  image_url: string | null;

  normal_price: number;
  package_price: number;
  discount_amount: number;

  status: "available" | "inactive";

  created_at: string;
  updated_at: string;

  packageItems: PackageProduct[];
}

export interface PackageResponse {
  message: string;
  data: PackageItem[];
}

export interface PackageDetailResponse {
  data: PackageItem;
}

export interface CreatePackagePayload {
  code: string;
  name: string;
  description?: string;

  image?: File | null;

  package_price: number;

  status: "available" | "inactive";

  products: {
    product_id: number;
    quantity: number;
  }[];
}