// Shared domain types. These live outside `app/_components` so that `lib/api`
// and the hooks do not depend on a `'use client'` UI module.

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  expiresAt: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  variants: ProductVariant[];
  badge?: string;
  categoryIds?: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  parentId: string | null;
}

export type PropertyDataType = 'text' | 'number' | 'enum';

export interface ProductProperty {
  id: string;
  name: string;
  dataType: PropertyDataType;
}

export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'banned';

/** The signed-in account, as returned by /auth/me and /auth/login. */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

/** A user row in the admin table — the same account plus admin-only fields. */
export interface AdminUser extends User {
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
