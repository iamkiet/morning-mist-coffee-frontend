// Shared domain types. These live outside `app/_components` so that `lib/api`
// and the hooks do not depend on a `'use client'` UI module.

export interface Product {
  id: string;
  slug: string;
  name: string;
  origin: string;
  tastingNotes: string[];
  description: string;
  price: number;
  image: string;
  stockQuantity?: number;
  badge?: string;
  productTypeId?: string;
}
