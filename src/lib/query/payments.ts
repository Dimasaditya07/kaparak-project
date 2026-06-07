import { Payment } from "./payments.model";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPayments = async (): Promise<Payment[]> => {
  const res = await fetch(`${API_URL}/payments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch payments");
  }

  const json = await res.json();
  return json.data;
};