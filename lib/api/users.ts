import type { AdminUser, UserRole, UserStatus } from '@/lib/types';
import { authFetch, listQuery } from './client';

export type { AdminUser, UserRole, UserStatus };

export interface UsersPage {
  items: AdminUser[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchUsers(
  limit = 20,
  offset = 0,
  q = '',
): Promise<UsersPage> {
  const res = await authFetch(`/api/v1/users?${listQuery(limit, offset, q)}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export interface UpdateUserPayload {
  role?: UserRole;
  status?: UserStatus;
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<AdminUser> {
  const res = await authFetch(`/api/v1/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function updateUserPassword(id: string, password: string): Promise<void> {
  const res = await authFetch(`/api/v1/users/${id}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error('Failed to reset password');
}
