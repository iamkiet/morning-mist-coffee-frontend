import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createOrderReview,
  fetchOrderReviews,
  updateOrderReviewStatus,
  type CreateOrderReviewPayload,
  type ReviewStatus,
} from '@/lib/api/order-reviews';
import type { ListQueryOptions } from '@/lib/api/client';

export function useCreateOrderReview() {
  return useMutation({
    mutationFn: (payload: CreateOrderReviewPayload) => createOrderReview(payload),
  });
}

export function useOrderReviews(
  page: number,
  limit: number,
  opts: ListQueryOptions = {},
) {
  const offset = (page - 1) * limit;
  return useQuery({
    queryKey: ['order-reviews', page, limit, opts],
    queryFn: () => fetchOrderReviews(limit, offset, opts),
  });
}

export function useUpdateOrderReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
      updateOrderReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-reviews'] });
    },
  });
}
