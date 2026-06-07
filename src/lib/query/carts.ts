import axiosInstance from "@/lib/api/axios";
import { Cart } from "./carts.model";

/**
 * GET CART
 */
export const getCart = async (): Promise<Cart> => {
  const res = await axiosInstance.get("/cart");

  return res.data?.data ?? res.data;
};

/**
 * ADD TO CART
 */
export const addToCart = async (payload: {
  product_id: number;
  quantity: number;
  start_date: string;
  end_date: string;
}) => {
  const res = await axiosInstance.post("/cart", payload);

  return res.data;
};

/**
 * REMOVE CART ITEM
 */
export const removeCartItem = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/cart/item/${id}`);
};