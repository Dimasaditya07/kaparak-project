import axiosInstance from "../api/axios";
import { CheckoutSummary } from "./checkout.model";

export const getCheckoutSummary =
  async (): Promise<CheckoutSummary> => {
    const res = await axiosInstance.get("/checkout/summary");
    return res.data;
  };

export const checkout = async () => {
  const res = await axiosInstance.post("/checkout");
  return res.data;
};