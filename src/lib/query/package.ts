import axiosInstance from "../api/axios";
import {
  PackageResponse,
  PackageDetailResponse,
  CreatePackagePayload,
} from "./package.model";

/**
 * Get All Packages
 */
export async function getPackages() {
  const res = await axiosInstance.get<PackageResponse>("/packages");

  return res.data;
}

/**
 * Get Detail Package
 */
export async function getPackage(id: number) {
  const res = await axiosInstance.get<PackageDetailResponse>(
    `/packages/${id}`,
  );

  return res.data;
}

/**
 * Create Package
 */
export async function createPackage(data: CreatePackagePayload) {
  const formData = new FormData();

  formData.append("code", data.code);
  formData.append("name", data.name);

  if (data.description) {
    formData.append("description", data.description);
  }

  formData.append(
    "package_price",
    data.package_price.toString(),
  );

  formData.append("status", data.status);

  if (data.image) {
    formData.append("image", data.image);
  }

  data.products.forEach((item, index) => {
    formData.append(
      `products[${index}][product_id]`,
      item.product_id.toString(),
    );

    formData.append(
      `products[${index}][quantity]`,
      item.quantity.toString(),
    );
  });

  const res = await axiosInstance.post(
    "/packages",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data;
}

/**
 * Update Package
 */
export async function updatePackage(
  id: number,
  data: CreatePackagePayload,
) {
  const formData = new FormData();

  formData.append("code", data.code);
  formData.append("name", data.name);

  if (data.description) {
    formData.append("description", data.description);
  }

  formData.append(
    "package_price",
    data.package_price.toString(),
  );

  formData.append("status", data.status);

  if (data.image) {
    formData.append("image", data.image);
  }

  data.products.forEach((item, index) => {
    formData.append(
      `products[${index}][product_id]`,
      item.product_id.toString(),
    );

    formData.append(
      `products[${index}][quantity]`,
      item.quantity.toString(),
    );
  });

  const res = await axiosInstance.post(
    `/packages/${id}?_method=PUT`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data;
}

/**
 * Delete Package
 */
export async function deletePackage(id: number) {
  const res = await axiosInstance.delete(
    `/packages/${id}`,
  );

  return res.data;
}