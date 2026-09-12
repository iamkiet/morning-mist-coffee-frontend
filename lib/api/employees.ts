import type { AdminEmployee, EmployeeRole, UserStatus } from '@/lib/types';
import { authFetch, listQuery, type ListQueryOptions } from './client';

export type { AdminEmployee, EmployeeRole, UserStatus };

export interface EmployeesPage {
  items: AdminEmployee[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchEmployees(
  limit = 20,
  offset = 0,
  q = '',
  opts: ListQueryOptions = {},
): Promise<EmployeesPage> {
  const res = await authFetch(
    `/api/v1/employees?${listQuery(limit, offset, q, opts)}`,
  );
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
}

export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  companyEmail: string;
  department?: string;
  password: string;
  role: EmployeeRole;
}

export async function createEmployee(
  payload: CreateEmployeePayload,
): Promise<AdminEmployee> {
  const res = await authFetch('/api/v1/employees', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? 'Failed to create employee',
    );
  }
  return res.json();
}

export interface UpdateEmployeePayload {
  department?: string;
  role?: EmployeeRole;
  status?: UserStatus;
}

export async function updateEmployee(
  id: string,
  payload: UpdateEmployeePayload,
): Promise<AdminEmployee> {
  const res = await authFetch(`/api/v1/employees/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? 'Failed to update employee',
    );
  }
  return res.json();
}

export async function updateEmployeePassword(
  id: string,
  password: string,
): Promise<void> {
  const res = await authFetch(`/api/v1/employees/${id}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error('Failed to reset password');
}

export async function deleteEmployee(id: string): Promise<void> {
  const res = await authFetch(`/api/v1/employees/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? 'Failed to delete employee',
    );
  }
}
