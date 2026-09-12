import type { OrderReview } from '@/lib/types';
import { authFetch, listQuery } from './client';

export interface OrderReviewsPage {
  items: OrderReview[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchProductReviews(
  productId: string,
  limit = 6,
  offset = 0,
): Promise<OrderReviewsPage> {
  const res = await authFetch(
    `/api/v1/order-reviews/product/${productId}?${listQuery(limit, offset)}`,
  );
  if (!res.ok) throw new Error('Failed to fetch product reviews');
  return res.json();
}
