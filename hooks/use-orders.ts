import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchOrders,
  updateOrderStatus,
  createOrder,
  lookupOrders,
  type OrderStatus,
  type CreateOrderItemInput,
} from '@/lib/api/orders';

export function useOrders(page = 1, limit = 20, q = '') {
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

export interface CreateOrderInput {
  email: string;
  totalCents: number;
  items: CreateOrderItemInput[];
  cashReceivedCents?: number;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, totalCents, items, cashReceivedCents }: CreateOrderInput) =>
      createOrder(email, totalCents, items, 'VND', cashReceivedCents),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// A mutation, not a query: the lookup is submitted from a form and its result
// is per-(email, code), so there is nothing to cache or refetch in the background
export function useLookupOrders() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      lookupOrders(email, code),
  });
}
