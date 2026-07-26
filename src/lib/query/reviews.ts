import axiosInstance from "@/lib/api/axios";
import { Review } from "./review.model";

/**
 * SUBMIT REVIEW
 */
export const createReview = async (payload: {
  reservation_id: number;
  review: string;
}): Promise<{ message: string; data: Review }> => {
  const res = await axiosInstance.post("/reviews", payload);
  return res.data;
};

/**
 * UPDATE REVIEW
 */
export const updateReview = async (
  id: number,
  payload: { review: string },
): Promise<{ message: string; data: Review }> => {
  const res = await axiosInstance.put(`/reviews/${id}`, payload);
  return res.data;
};

/**
 * DELETE REVIEW
 */
export const deleteReview = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/reviews/${id}`);
};

export const getReviews = async (): Promise<Review[]> => {
  const res = await axiosInstance.get("/reviews");

  return res.data.data;
};