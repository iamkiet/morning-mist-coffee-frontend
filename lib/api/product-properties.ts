import type { ProductProperty, PropertyDataType } from '@/lib/types';
import { authFetch } from './client';

export interface ProductPropertyListResponse {
  items: ProductProperty[];
}

export async function fetchProductProperties(): Promise<ProductPropertyListResponse> {
  const res = await authFetch('/api/v1/product-properties');
  if (!res.ok) throw new Error('Failed to fetch product properties');
  return res.json();
}

export async function createProductProperty(
  name: string,
  dataType?: PropertyDataType,
): Promise<ProductProperty> {
  const res = await authFetch('/api/v1/product-properties', {
    method: 'POST',
    body: JSON.stringify({ name, dataType }),
  });
  if (!res.ok) throw new Error('Failed to create product property');
  return res.json();
}
