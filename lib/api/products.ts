import type { Product, ProductVariant, VariantPropertyValue } from '@/lib/types';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/product-images';
import { authFetch, listQuery } from './client';

export type { Product, ProductVariant };

interface BackendProductVariant {
  id: string;
  productId: string;
  sku: string;
  priceCents: number;
  currency: string;
  stock: number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  propertyValues?: VariantPropertyValue[];
}

interface BackendProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  variants: BackendProductVariant[];
  categoryIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsPage {
  items: Product[];
  total: number;
  limit: number;
  offset: number;
}

function transformVariant(v: BackendProductVariant): ProductVariant {
  return {
    id: v.id,
    productId: v.productId,
    sku: v.sku,
    price: v.priceCents,
    currency: v.currency,
    stock: v.stock,
    expiresAt: v.expiresAt,
    propertyValues: v.propertyValues ?? [],
  };
}

function transform(p: BackendProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? '',
    imageUrl: p.imageUrl ?? DEFAULT_PRODUCT_IMAGE,
    variants: p.variants.map(transformVariant),
    categoryIds: p.categoryIds ?? [],
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
  description?: string | null;
  imageUrl?: string | null;
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

export interface CreateProductVariantPayload {
  sku: string;
  priceCents: number;
  currency?: string;
  stock?: number;
  expiresAt?: string | null;
}

export interface CreateProductPayload {
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryIds?: string[];
  variant: CreateProductVariantPayload;
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

export async function setProductCategories(
  productId: string,
  categoryIds: string[],
): Promise<void> {
  const res = await authFetch(`/api/v1/products/${productId}/categories`, {
    method: 'PUT',
    body: JSON.stringify({ categoryIds }),
  });
  if (!res.ok) throw new Error('Failed to set product categories');
}

export async function createProductVariant(
  productId: string,
  payload: CreateProductVariantPayload,
): Promise<ProductVariant> {
  const res = await authFetch(`/api/v1/products/${productId}/variants`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create product variant');
  return transformVariant(await res.json());
}

export interface UpdateProductVariantPayload {
  sku?: string;
  priceCents?: number;
  currency?: string;
  stock?: number;
  expiresAt?: string | null;
}

export async function updateProductVariant(
  variantId: string,
  payload: UpdateProductVariantPayload,
): Promise<ProductVariant> {
  const res = await authFetch(`/api/v1/products/variants/${variantId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update product variant');
  return transformVariant(await res.json());
}

export async function deleteProductVariant(variantId: string): Promise<void> {
  const res = await authFetch(`/api/v1/products/variants/${variantId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product variant');
}

export async function setVariantPropertyValues(
  variantId: string,
  values: Array<{ propertyId: string; value: string }>,
): Promise<void> {
  const res = await authFetch(`/api/v1/products/variants/${variantId}/properties`, {
    method: 'PUT',
    body: JSON.stringify({ values }),
  });
  if (!res.ok) throw new Error('Failed to set variant properties');
}

export interface VoiceSearchResult {
  message: string;
  items: Product[];
  transcript: string | null;
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
    message: data.message,
    items: data.items.map(transform),
    transcript: data.transcript,
  };
}
