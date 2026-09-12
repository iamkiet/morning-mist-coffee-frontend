import type { OrderReview } from '@/lib/types';
import { authFetch, listQuery, type ListQueryOptions } from './client';

export type ReviewSource = 'app' | 'google' | 'facebook' | 'form';
export type ReviewCategory = 'complaint' | 'compliment' | 'suggestion' | 'spam';
export type ReviewSeverity = 'low' | 'medium' | 'high';
export type ReviewSentiment = 'positive' | 'negative' | 'neutral';
export type ReviewStatus =
  | 'pending_classification'
  | 'pending_review'
  | 'auto_responded'
  | 'escalated'
  | 'resolved';

export interface AdminOrderReview {
  id: string;
  productId: string | null;
  orderId: string | null;
  customerEmail: string | null;
  rating: number | null;
  commentText: string;
  source: ReviewSource;
  category: ReviewCategory | null;
  severity: ReviewSeverity | null;
  sentiment: ReviewSentiment | null;
  topics: string[] | null;
  suggestedResponse: string | null;
  status: ReviewStatus;
  classifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderReviewsPage {
  items: OrderReview[];
  total: number;
  limit: number;
  offset: number;
}

export interface AdminOrderReviewsPage {
  items: AdminOrderReview[];
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

export interface CreateOrderReviewPayload {
  productId?: string;
  orderId?: string;
  customerEmail?: string;
  rating?: number;
  commentText: string;
  source: ReviewSource;
}

export async function createOrderReview(
  payload: CreateOrderReviewPayload,
): Promise<AdminOrderReview> {
  const res = await authFetch('/api/v1/order-reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return res.json();
}

export async function fetchOrderReviews(
  limit = 20,
  offset = 0,
  opts: ListQueryOptions = {},
): Promise<AdminOrderReviewsPage> {
  const res = await authFetch(
    `/api/v1/order-reviews?${listQuery(limit, offset, '', opts)}`,
  );
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function updateOrderReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<AdminOrderReview> {
  const res = await authFetch(`/api/v1/order-reviews/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update review status');
  return res.json();
}
