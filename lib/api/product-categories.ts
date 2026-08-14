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
