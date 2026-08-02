import { authFetch, listQuery } from './client';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string | null;
  name: string;
  priceCents: number;
  quantity: number;
}

export interface Order {
  id: string;
  email: string;
  status: OrderStatus;
  totalCents: number;
  currency: string;
  cashReceivedCents?: number | null;
  changeCents?: number | null;
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

export async function lookupOrders(email: string, code: string): Promise<Order[]> {
  const res = await authFetch(
    `/api/v1/orders/lookup?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
  );
  if (!res.ok) throw new Error('Failed to look up orders');
  const data: { items: Order[] } = await res.json();
  return data.items;
}

export interface CreateOrderItemInput {
  productId?: string;
  name: string;
  priceCents: number;
  quantity: number;
}

export async function createOrder(
  email: string,
  totalCents: number,
  items: CreateOrderItemInput[],
  currency = 'VND',
  cashReceivedCents?: number,
): Promise<Order> {
  const res = await authFetch('/api/v1/orders', {
    method: 'POST',
    body: JSON.stringify({ email, totalCents, currency, cashReceivedCents, items }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? 'Failed to place order',
    );
  }
  return res.json();
}
