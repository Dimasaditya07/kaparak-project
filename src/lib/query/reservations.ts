/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "@/lib/api/axios";
import { ConfirmReturnItemPayload, Reservation } from "./reservations.model";

/**
 * Mapping response Laravel -> Frontend Model
 */
const mapReservation = (reservation: any): Reservation => ({
  ...reservation,

  reservationItems: (reservation.reservation_items ?? []).map((item: any) => ({
    ...item,

    product: item.product
      ? {
          ...item.product,
        }
      : null,

    package: item.package
      ? {
          ...item.package,

          packageItems: (item.package.package_items ?? []).map(
            (packageItem: any) => ({
              ...packageItem,

              product: packageItem.product
                ? {
                    ...packageItem.product,
                  }
                : null,
            })
          ),
        }
      : null,
  })),
});

/**
 * GET ALL RESERVATIONS
 */
export const getReservations = async (): Promise<Reservation[]> => {
  const res = await axios.get("/reservations");

  return res.data.data.map(mapReservation);
};

/**
 * GET RESERVATION DETAIL
 */
export const getReservationDetail = async (
  id: number
): Promise<Reservation> => {
  const res = await axios.get(`/reservations/${id}`);

  return mapReservation(res.data.data);
};

/**
 * GET RESERVATION BY ID
 */
export const getReservationById = async (
  id: number
): Promise<Reservation> => {
  const res = await axios.get(`/reservations/${id}`);

  return mapReservation(res.data.data);
};

/**
 * UPDATE STATUS
 */
export const updateReservationStatus = async (
  id: number,
  status: string
): Promise<Reservation> => {
  const res = await axios.patch(`/reservations/${id}/status`, {
    status,
  });

  return mapReservation(res.data.data);
};

/**
 * PICKUP RESERVATION
 * confirmed -> picked_up
 */
export const pickupReservation = async (
  id: number
): Promise<Reservation> => {
  const res = await axios.post(`/reservations/${id}/pickup`);

  return mapReservation(res.data.data);
};

/**
 * CONFIRM RETURN
 * picked_up -> returned
 */
export const confirmReturn = async (
  id: number,
  items: ConfirmReturnItemPayload[],
): Promise<Reservation> => {
  const res = await axios.post(`/reservations/${id}/confirm-return`, {
    items,
  });
  return mapReservation(res.data.data);
};

/**
 * DELETE RESERVATION
 */
export const deleteReservation = async (id: number) => {
  const res = await axios.delete(`/reservations/${id}`);

  return res.data;
};