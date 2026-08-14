import type { Product, ProductVariant } from '@/lib/types';

/** The variant shown by default on cards/listings — the cheapest one in stock, falling back to the cheapest overall. */
export function getDefaultVariant(product: Product): ProductVariant | undefined {
  const variants = product.variants;
  if (variants.length === 0) return undefined;
  const inStock = variants.filter((v) => v.stock > 0);
  const pool = inStock.length > 0 ? inStock : variants;
  return pool.reduce((cheapest, v) => (v.price < cheapest.price ? v : cheapest));
}

export function getTotalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export function getPriceRange(product: Product): { min: number; max: number } {
  const prices = product.variants.map((v) => v.price);
  if (prices.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
