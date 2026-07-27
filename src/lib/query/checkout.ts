import axiosInstance from "../api/axios";
import { CheckoutSummary, PendingPayment } from "./checkout.model";

export const getCheckoutSummary =
  async (): Promise<CheckoutSummary> => {
    const res = await axiosInstance.get("/checkout/summary");
    return res.data;
  };

export const checkout = async () => {
  const res = await axiosInstance.post("/checkout");
  return res.data;
};


 
export async function getPendingPayment(): Promise<PendingPayment | null> {
  const res = await axiosInstance.get("/checkout/pending");
  return res.data?.data ?? null;
}