import type { ProductCategory } from '@/lib/types';
import { authFetch } from './client';

export interface ProductCategoryListResponse {
  items: ProductCategory[];
}

export async function fetchProductCategories(): Promise<ProductCategoryListResponse> {
  const res = await authFetch('/api/v1/product-categories');
  if (!res.ok) throw new Error('Failed to fetch product categories');
  return res.json();
}

export async function createProductCategory(
  name: string,
  parentId?: string | null,
): Promise<ProductCategory> {
  const res = await authFetch('/api/v1/product-categories', {
    method: 'POST',
    body: JSON.stringify({ name, parentId }),
  });
  if (!res.ok) throw new Error('Failed to create product category');
  return res.json();
}

export interface UpdateProductCategoryPayload {
  name?: string;
  parentId?: string | null;
}

export async function updateProductCategory(
  id: string,
  payload: UpdateProductCategoryPayload,
): Promise<ProductCategory> {
  const res = await authFetch(`/api/v1/product-categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? 'Failed to update product category',
    );
  }
  return res.json();
}

export async function deleteProductCategory(id: string): Promise<void> {
  const res = await authFetch(`/api/v1/product-categories/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? 'Failed to delete product category',
    );
  }
}
