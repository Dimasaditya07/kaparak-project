import axios from "@/lib/api/axios";
import { ReservationResponse } from "./reservations.model";

export const getReservations = async () => {
  const response = await axios.get<ReservationResponse>(
    "/reservations"
  );

  return response.data.data;
};

export const getReservationById = async (
  id: number
) => {
  const response = await axios.get(
    `/reservations/${id}`
  );

  return response.data.data;
};

export const updateReservationStatus = async (
  id: number,
  status: string
) => {
  const response = await axios.patch(
    `/reservations/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};

export const deleteReservation = async (
  id: number
) => {
  const response = await axios.delete(
    `/reservations/${id}`
  );

  return response.data;
};