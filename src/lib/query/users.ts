import axiosInstance from "@/lib/api/axios";

import {
  UserResponse,
} from "@/lib/query/users.model";

export async function getUsers(): Promise<UserResponse> {
  const response = await axiosInstance.get(
    "/users"
  );

  return response.data;
}