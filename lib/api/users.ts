import { authFetch } from "./client";

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive" | "banned";

export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UsersPage {
  items: ApiUser[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchUsers(limit = 20, offset = 0): Promise<UsersPage> {
  const res = await authFetch(`/api/v1/users?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
