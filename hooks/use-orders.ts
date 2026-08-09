import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchOrders,
  updateOrderStatus,
  createOrder,
  lookupOrders,
  type OrderStatus,
  type CreateOrderPayload,
} from '@/lib/api/orders';

export function useOrders(page: number, limit: number, q = '') {
  const offset = (page - 1) * limit;
  return useQuery({
    queryKey: ['orders', page, limit, q],
    queryFn: () => fetchOrders(limit, offset, q),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export type CreateOrderInput = CreateOrderPayload;

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => createOrder(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// A mutation, not a query: the lookup is submitted from a form and its result
// is per-code, so there is nothing to cache or refetch in the background
export function useLookupOrders() {
  return useMutation({
    mutationFn: (code: string) => lookupOrders(code),
  });
}
