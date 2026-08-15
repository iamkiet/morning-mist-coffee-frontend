import { authFetch, listQuery } from './client';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItemPropertyValue {
  propertyName: string;
  value: string;
}

export interface OrderItem {
  id: string;
  productVariantId: string | null;
  productName: string;
  variantSku: string | null;
  variantPropertyValues: OrderItemPropertyValue[];
  priceCents: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  status: OrderStatus;
  totalCents: number;
  currency: string;
  shippingFirstName: string | null;
  shippingLastName: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingPostalCode: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrdersPage {
  items: Order[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchOrders(
  limit = 20,
  offset = 0,
  q = '',
): Promise<OrdersPage> {
  const res = await authFetch(`/api/v1/orders?${listQuery(limit, offset, q)}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  const res = await authFetch(`/api/v1/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return res.json();
}

export async function lookupOrders(code: string): Promise<Order[]> {
  const res = await authFetch(
    `/api/v1/orders/lookup?code=${encodeURIComponent(code)}`,
  );
  if (!res.ok) throw new Error('Failed to look up orders');
  const data: { items: Order[] } = await res.json();
  return data.items;
}

export interface CreateOrderItemInput {
  productVariantId?: string;
  productName: string;
  priceCents: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customerEmail: string;
  totalCents: number;
  items: CreateOrderItemInput[];
  currency?: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const res = await authFetch('/api/v1/orders', {
    method: 'POST',
    body: JSON.stringify({ currency: 'VND', ...payload }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? 'Failed to place order',
    );
  }
  return res.json();
}
