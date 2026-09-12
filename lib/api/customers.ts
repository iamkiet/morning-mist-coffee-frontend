import type { AdminCustomer, UserStatus } from '@/lib/types';
import { authFetch, listQuery, type ListQueryOptions } from './client';

export type { AdminCustomer, UserStatus };

export interface CustomersPage {
  items: AdminCustomer[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchCustomers(
  limit = 20,
  offset = 0,
  q = '',
  opts: ListQueryOptions = {},
): Promise<CustomersPage> {
  const res = await authFetch(
    `/api/v1/customers?${listQuery(limit, offset, q, opts)}`,
  );
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  registrationKey: string;
}

export async function createCustomer(
  payload: CreateCustomerPayload,
): Promise<AdminCustomer> {
  const { registrationKey, ...body } = payload;
  const res = await authFetch('/api/v1/customers', {
    method: 'POST',
    headers: { 'X-Customer-Registration-Key': registrationKey },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? 'Failed to create customer',
    );
  }
  return res.json();
}

export interface UpdateCustomerPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  loyaltyPoints?: number;
  status?: UserStatus;
}

export async function updateCustomer(
  id: string,
  payload: UpdateCustomerPayload,
): Promise<AdminCustomer> {
  const res = await authFetch(`/api/v1/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update customer');
  return res.json();
}

export async function updateCustomerPassword(
  id: string,
  password: string,
): Promise<void> {
  const res = await authFetch(`/api/v1/customers/${id}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error('Failed to reset password');
}

export async function deleteCustomer(id: string): Promise<void> {
  const res = await authFetch(`/api/v1/customers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? 'Failed to delete customer',
    );
  }
}

export async function fetchMyAccount(): Promise<AdminCustomer> {
  const res = await authFetch('/api/v1/customers/me');
  if (!res.ok) throw new Error('Failed to fetch account');
  return res.json();
}

export interface UpdateMyAccountPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export async function updateMyAccount(
  payload: UpdateMyAccountPayload,
): Promise<AdminCustomer> {
  const res = await authFetch('/api/v1/customers/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? 'Failed to update account',
    );
  }
  return res.json();
}
