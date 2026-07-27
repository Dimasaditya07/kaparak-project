/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "../api/axios";
import {
  PackageResponse,
  PackageDetailResponse,
  CreatePackagePayload,
  PackageItem,
} from "./package.model";

/**
 * Mapping Laravel Response -> Frontend Model
 */
const mapPackage = (pkg: any): PackageItem => ({
  ...pkg,

  packageItems: (pkg.package_items ?? []).map((item: any) => ({
    ...item,

    product: item.product
      ? {
          ...item.product,
        }
      : null,
  })),
});

/**
 * Get All Packages
 */
export async function getPackages(): Promise<PackageResponse> {
  const res = await axiosInstance.get<PackageResponse>("/packages");

  return {
    ...res.data,
    data: res.data.data.map(mapPackage),
  };
}

/**
 * Get Detail Package
 */
export async function getPackage(
  id: number,
): Promise<PackageDetailResponse> {
  const res = await axiosInstance.get<PackageDetailResponse>(
    `/packages/${id}`,
  );

  return {
    ...res.data,
    data: mapPackage(res.data.data),
  };
}

/**
 * Create Package
 */
export async function createPackage(
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