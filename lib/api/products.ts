import { type Product } from '@/app/_components/ProductCard';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/product-images';
import { authFetch } from './client';

export type { Product };

interface BackendProduct {
  id: string;
  name: string;
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


function transform(p: BackendProduct): Product {
  const slug = p.name.toLowerCase().replace(/\s+/g, '-');
  let origin = 'Morning Mist • Collection';
  let notes: string[] = [];
  let description = '';
  if (p.description) {
    const lines = p.description.split('\n').filter((l) => l.trim());
    if (lines.length > 2) {
      origin = lines[0];
      notes = lines.slice(1, -1).filter((l) => l.trim().length > 0);
      description = lines[lines.length - 1];
    } else if (lines.length === 2) {
      origin = lines[0];
      notes = [lines[1]];
      description = lines[1];
    } else if (lines.length === 1) {
      origin = 'Morning Mist • Collection';
      description = lines[0];
    }
  }
  return {
    id: p.id,
    slug,
    name: p.name,
    origin,
    price: p.priceCents,
    image: p.image ?? DEFAULT_PRODUCT_IMAGE,
    notes,
    stockQuantity: p.stockQuantity,
    description: description,
    productTypeId: p.productTypeId,
  };
}

export async function fetchProducts(
  limit = 8,
  offset = 0,
): Promise<ProductsPage> {
  const res = await authFetch(`/api/v1/products?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return {
    items: data.items.map(transform),
    total: data.total,
    limit: data.limit,
    offset: data.offset,
  };
}

const PRODUCT_LOOKUP_BATCH = 50;

/**
 * There is no by-slug endpoint yet, so this scans the catalogue. It reads one
 * batch first and only re-fetches the whole list when the slug was not in it —
 * previously it read a fixed 50 and 404'd on every product past that point.
 */
export async function fetchProduct(slug: string): Promise<Product | undefined> {
  const decoded = decodeURIComponent(slug);

  const firstBatch = await fetchProducts(PRODUCT_LOOKUP_BATCH, 0);
  const match = firstBatch.items.find((p) => p.slug === decoded);
  if (match || firstBatch.total <= firstBatch.items.length) return match;

  const all = await fetchProducts(firstBatch.total, 0);
  return all.items.find((p) => p.slug === decoded);
}

export interface UpdateProductPayload {
  name?: string;
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

export async function searchProductsByVoice(audio: Blob): Promise<VoiceSearchResult> {
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
