import type { Product } from '@/app/_components/ProductCard';
import { API_URL } from '@/lib/config';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/product-images';
import { authFetch } from './client';

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
  if (p.description) {
    const lines = p.description.split('\n').filter((l) => l.trim());
    if (lines.length > 0) origin = lines[0];
    notes = lines.slice(1).filter((l) => l.trim().length > 0);
  }
  return {
    id: p.id,
    slug,
    name: p.name,
    origin,
    price: p.priceCents / 100,
    image: p.image ?? DEFAULT_PRODUCT_IMAGE,
    notes,
    stockQuantity: p.stockQuantity,
  };
}

export async function fetchProducts(
  limit = 8,
  offset = 0,
): Promise<ProductsPage> {
  const url = `${API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
  const res = await fetch(url);
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
  const { items } = await fetchProducts(50, 0);
  return items.find((p) => p.slug === slug);
}

export interface UpdateProductPayload {
  name?: string;
  description?: string | null;
  priceCents?: number;
  image?: string | null;
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
