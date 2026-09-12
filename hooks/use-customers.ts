import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  updateCustomerPassword,
  deleteCustomer,
  fetchMyAccount,
  updateMyAccount,
  type CreateCustomerPayload,
  type UpdateCustomerPayload,
  type UpdateMyAccountPayload,
} from '@/lib/api/customers';

export function useCustomers(page: number, limit: number, q = '') {
  const offset = (page - 1) * limit;
  return useQuery({
    queryKey: ['customers', page, limit, q],
    queryFn: () => fetchCustomers(limit, offset, q),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) => createCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCustomerPayload }) =>
      updateCustomer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomerPassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      updateCustomerPassword(id, password),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useMyAccount(enabled: boolean) {
  return useQuery({
    queryKey: ['customers', 'me'],
    queryFn: fetchMyAccount,
    enabled,
  });
}

export function useUpdateMyAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMyAccountPayload) => updateMyAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', 'me'] });
    },
  });
}
