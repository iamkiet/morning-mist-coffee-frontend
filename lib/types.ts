// Shared domain types. These live outside `app/_components` so that `lib/api`
// and the hooks do not depend on a `'use client'` UI module.

export interface VariantPropertyValue {
  propertyId: string;
  propertyName: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  expiresAt: string | null;
  propertyValues: VariantPropertyValue[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  variants: ProductVariant[];
  categoryIds?: string[];
  categoryNames?: string[];
}

export type ReviewReplyAuthorType = 'admin' | 'customer' | 'ai';

export interface ProductReviewReply {
  id: string;
  authorType: ReviewReplyAuthorType;
  authorName: string | null;
  replyText: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  rating: number | null;
  commentText: string;
  replies: ProductReviewReply[];
  createdAt: string;
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

export type UserRole = 'customer' | 'staff' | 'admin';
export type EmployeeRole = 'staff' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'banned';

export const EMPLOYEE_DEPARTMENTS = [
  'Vận hành',
  'Pha chế',
  'Kho',
  'Marketing',
  'CSKH',
  'Kế toán',
] as const;
export type EmployeeDepartment = (typeof EMPLOYEE_DEPARTMENTS)[number];

/** Which table/endpoint to authenticate against — employees and customers are verified separately. */
export const ACCOUNT_TYPE = {
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer',
} as const;
export type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE];

/** The signed-in account, as returned by /auth/me and /auth/login — either an employee or a customer. */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

/** An employee row in the admin table (`/mist-ops/employees`). */
export interface AdminEmployee {
  id: string;
  firstName: string;
  lastName: string;
  companyEmail: string;
  department: EmployeeDepartment | null;
  role: EmployeeRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

/** A customer row in the admin table (`/mist-ops/customers`). */
export interface AdminCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  loyaltyPoints: number;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
