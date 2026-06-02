import { authFetch } from './client';

export interface ProductType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductTypeListResponse {
  items: ProductType[];
}

export async function fetchProductTypes(): Promise<ProductTypeListResponse> {
  const res = await authFetch('/api/v1/product-types');
  if (!res.ok) throw new Error('Failed to fetch product types');
  return res.json();
}

export async function createProductType(name: string): Promise<ProductType> {
  const res = await authFetch('/api/v1/product-types', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create product type');
  return res.json();
}
