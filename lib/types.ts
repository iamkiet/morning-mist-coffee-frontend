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
