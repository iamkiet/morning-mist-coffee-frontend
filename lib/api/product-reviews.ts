import type { ProductReview, ProductReviewReply } from '@/lib/types';
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

export interface AdminProductReview {
  id: string;
  productId: string;
  customerEmail: string;
  rating: number | null;
  commentText: string;
  source: ReviewSource;
  category: ReviewCategory | null;
  severity: ReviewSeverity | null;
  sentiment: ReviewSentiment | null;
  topics: string[] | null;
  suggestedResponse: string | null;
  status: ReviewStatus;
  replies: ProductReviewReply[];
  classifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewsPage {
  items: ProductReview[];
  total: number;
  limit: number;
  offset: number;
}

export interface AdminProductReviewsPage {
  items: AdminProductReview[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchProductReviews(
  productId: string,
  limit = 6,
  offset = 0,
): Promise<ProductReviewsPage> {
  const res = await authFetch(
    `/api/v1/product-reviews/product/${productId}?${listQuery(limit, offset)}`,
  );
  if (!res.ok) throw new Error('Failed to fetch product reviews');
  return res.json();
}

export interface CreateProductReviewPayload {
  productId: string;
  rating?: number;
  commentText: string;
  source: ReviewSource;
}

export async function createProductReview(
  payload: CreateProductReviewPayload,
): Promise<AdminProductReview> {
  const res = await authFetch('/api/v1/product-reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      (body as { message?: string })?.message ?? 'Failed to submit review',
    );
  }
  return res.json();
}

export async function fetchProductReviewsAdmin(
  limit = 20,
  offset = 0,
  opts: ListQueryOptions = {},
): Promise<AdminProductReviewsPage> {
  const res = await authFetch(
    `/api/v1/product-reviews?${listQuery(limit, offset, '', opts)}`,
  );
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export interface CreateProductReviewReplyPayload {
  authorName?: string;
  replyText: string;
}

export async function createProductReviewReply(
  reviewId: string,
  payload: CreateProductReviewReplyPayload,
): Promise<ProductReviewReply> {
  const res = await authFetch(`/api/v1/product-reviews/${reviewId}/replies`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit reply');
  return res.json();
}

export async function createAdminProductReviewReply(
  reviewId: string,
  payload: CreateProductReviewReplyPayload,
): Promise<ProductReviewReply> {
  const res = await authFetch(`/api/v1/product-reviews/${reviewId}/admin-replies`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit reply');
  return res.json();
}

export async function updateProductReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<AdminProductReview> {
  const res = await authFetch(`/api/v1/product-reviews/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update review status');
  return res.json();
}
