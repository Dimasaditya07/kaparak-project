import axiosInstance from "@/lib/api/axios";
import {
    AdminNotification,
  AdminNotificationCount,
  AdminNotificationPagination,
} from "./adminNotification.model";

/**
 * Ambil jumlah notifikasi admin yang belum dibaca.
 */
export const getAdminNotificationCount =
  async (): Promise<AdminNotificationCount> => {
  const response = await axiosInstance.get(
    "/admin/notifications/count",
  );

  return response.data;
};

/**
 * Ambil daftar notifikasi admin.
 */
export const getAdminNotifications = async (
  page = 1,
): Promise<AdminNotificationPagination> => {
  const response = await axiosInstance.get(
    "/admin/notifications",
    {
      params: {
        page,
      },
    },
  );

  return response.data;
};

/**
 * Tandai satu notifikasi sebagai sudah dibaca.
 */
export const markAdminNotificationAsRead = async (
  notificationId: number,
): Promise<void> => {
  await axiosInstance.patch(
    `/admin/notifications/${notificationId}/read`,
  );
};

/**
 * Tandai semua notifikasi sebagai sudah dibaca.
 */
export const markAllAdminNotificationsAsRead =
  async (): Promise<void> => {
    await axiosInstance.patch(
      "/admin/notifications/read-all",
    );
  };

/**
 * Tandai semua notifikasi berdasarkan tipe
 * sebagai sudah dibaca.
 *
 * type:
 * - reservation
 * - payment
 */
export const markAdminNotificationsAsReadByType = async (
  type: "reservation" | "payment"
): Promise<void> => {
  const response = await getAdminNotifications();

  const notifications = response.data.filter(
    (notification: AdminNotification) =>
      notification.type === type && !notification.is_read
  );

  await Promise.all(
    notifications.map((notification: AdminNotification) =>
      markAdminNotificationAsRead(notification.id)
    )
  );

  // Beritahu komponen lain bahwa notification count berubah
  window.dispatchEvent(
    new CustomEvent("admin-notifications-updated")
  );
};