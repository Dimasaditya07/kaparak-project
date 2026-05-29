// lib/query/category.ts

import axiosInstance from "@/lib/api/axios";

import {
  CategoryResponse,
} from "@/lib/query/category.model";

// GET ALL CATEGORY
export async function getCategories(): Promise<CategoryResponse> {
  const response = await axiosInstance.get(
    "/categories"
  );

  return response.data;
}

// CREATE CATEGORY
export async function createCategory(payload: {
  name: string;
  slug: string;
}) {
  const response = await axiosInstance.post(
    "/categories",
    payload
  );

  return response.data;
}

// UPDATE CATEGORY
export async function updateCategory(
  id: number,
  payload: {
    name: string;
    slug: string;
  }
) {
  const response = await axiosInstance.put(
    `/categories/${id}`,
    payload
  );

  return response.data;
}

// DELETE CATEGORY
export async function deleteCategory(id: number) {
  const response = await axiosInstance.delete(
    `/categories/${id}`
  );

  return response.data;
}