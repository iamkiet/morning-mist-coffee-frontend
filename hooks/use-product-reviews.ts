import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminProductReviewReply,
  createProductReview,
  fetchProductReviewsAdmin,
  updateProductReviewStatus,
  type CreateProductReviewPayload,
  type CreateProductReviewReplyPayload,
  type ReviewStatus,
} from '@/lib/api/product-reviews';
import type { ListQueryOptions } from '@/lib/api/client';

export function useCreateProductReview() {
  return useMutation({
    mutationFn: (payload: CreateProductReviewPayload) => createProductReview(payload),
  });
}

export function useCreateAdminProductReviewReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: CreateProductReviewReplyPayload;
    }) => createAdminProductReviewReply(reviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
    },
  });
}

export function useProductReviewsAdmin(
  page: number,
  limit: number,
  opts: ListQueryOptions = {},
) {
  const offset = (page - 1) * limit;
  return useQuery({
    queryKey: ['product-reviews', page, limit, opts],
    queryFn: () => fetchProductReviewsAdmin(limit, offset, opts),
  });
}

export function useUpdateProductReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
      updateProductReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
    },
  });
}
