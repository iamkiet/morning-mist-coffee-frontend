import type { Product } from '@/lib/types';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/product-images';
import { authFetch, listQuery } from './client';

export type { Product };

interface BackendProduct {
  id: string;
  slug: string;
  name: string;
  origin: string | null;
  tastingNotes: string[];
  description: string | null;
  priceCents: number;
  currency: string;
  image: string | null;
  productTypeId: string;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsPage {
  items: Product[];
  total: number;
  limit: number;
  offset: number;
}

const DEFAULT_ORIGIN = 'Morning Mist • Collection';

function transform(p: BackendProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    origin: p.origin ?? DEFAULT_ORIGIN,
    tastingNotes: p.tastingNotes,
    description: p.description ?? '',
    price: p.priceCents,
    image: p.image ?? DEFAULT_PRODUCT_IMAGE,
    stockQuantity: p.stockQuantity,
    productTypeId: p.productTypeId,
  };
}

export async function fetchProducts(
  limit = 8,
  offset = 0,
  q = '',
): Promise<ProductsPage> {
  const res = await authFetch(`/api/v1/products?${listQuery(limit, offset, q)}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return {
    items: data.items.map(transform),
    total: data.total,
    limit: data.limit,
    offset: data.offset,
  };
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
  const res = await authFetch(
    `/api/v1/products/slug/${encodeURIComponent(decodeURIComponent(slug))}`,
  );
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error('Failed to fetch product');
  return transform(await res.json());
}

export interface UpdateProductPayload {
  name?: string;
  origin?: string | null;
  tastingNotes?: string[];
  description?: string | null;
  priceCents?: number;
  currency?: string;
  image?: string | null;
  productTypeId?: string;
  stockQuantity?: number;
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  const res = await authFetch(`/api/v1/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return transform(await res.json());
}

export interface CreateProductPayload {
  name: string;
  origin: string | null;
  tastingNotes: string[];
  description: string | null;
  priceCents: number;
  currency?: string;
  image: string | null;
  productTypeId: string;
  stockQuantity?: number;
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  const res = await authFetch('/api/v1/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return transform(await res.json());
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await authFetch(`/api/v1/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export interface VoiceSearchResult {
  items: Product[];
  transcript: string | null;
  usedFallback: boolean;
}

export async function searchProductsByVoice(
  audio: Blob,
): Promise<VoiceSearchResult> {
  const formData = new FormData();
  formData.append('audio', audio, 'query');

  const res = await authFetch('/api/v1/search/voice', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? 'Voice search failed');
  }
  const data = await res.json();
  return {
    items: data.items.map(transform),
    transcript: data.transcript,
    usedFallback: data.usedFallback,
  };
}
