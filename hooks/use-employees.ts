import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  updateEmployeePassword,
  deleteEmployee,
  type CreateEmployeePayload,
  type UpdateEmployeePayload,
} from '@/lib/api/employees';

export function useEmployees(page: number, limit: number, q = '', enabled = true) {
  const offset = (page - 1) * limit;
  return useQuery({
    queryKey: ['employees', page, limit, q],
    queryFn: () => fetchEmployees(limit, offset, q),
    enabled,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEmployeePayload }) =>
      updateEmployee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployeePassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      updateEmployeePassword(id, password),
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
