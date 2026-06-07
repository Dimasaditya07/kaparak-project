import axiosInstance from "@/lib/api/axios";
import {
  ProductResponse,
} from "@/lib/query/product.model";

export async function getProducts(): Promise<ProductResponse> {
  const response = await axiosInstance.get("/products");

  return response.data;
}

export async function createProduct(
  payload: FormData
) {
  const response = await axiosInstance.post(
    "/products",
    payload,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function updateProduct(
  id: number,
  payload: FormData
) {
  payload.append("_method", "PUT");

  const response = await axiosInstance.post(
    `/products/${id}`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function deleteProduct(
  id: number
) {
  const response = await axiosInstance.delete(
    `/products/${id}`
  );

  return response.data;
}

export const getProductDetail = (id: string) => {
  return axiosInstance.get(`/products/${id}`);
};