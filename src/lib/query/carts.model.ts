/* eslint-disable @typescript-eslint/no-explicit-any */
import { PackageItem } from "./package.model";

export type CartProduct = {
  category: any;
  id: number;
  name: string;
  image_url: string;
  price: number;
};

export type CartItem = {
  id: number;
  product_id: number | null;
  package_id: number | null;
  quantity: number;

  start_date: string;
  end_date: string;

  duration: number;
  price: number;
  subtotal: number;

  product?: CartProduct | null;
  package?: PackageItem | null;
};

export type Cart = {
  id: number;
  user_id: number;
  cart_items: CartItem[];
};