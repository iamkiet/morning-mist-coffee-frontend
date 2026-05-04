import { authFetch } from './client';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  email: string;
  status: OrderStatus;
  totalCents: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersPage {
  items: Order[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchOrders(limit = 20, offset = 0): Promise<OrdersPage> {
  const res = await authFetch(`/api/v1/orders?limit=${limit}&offset=${offset}`);
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

export async function lookupOrders(email: string): Promise<Order[]> {
  const res = await fetch(
    `${baseUrl}/api/v1/orders/lookup?email=${encodeURIComponent(email)}`,
    { credentials: 'include' },
  );
  if (!res.ok) throw new Error('Failed to look up orders');
  const data: { items: Order[] } = await res.json();
  return data.items;
}

export async function createOrder(
  email: string,
  totalCents: number,
  currency = 'USD',
): Promise<Order> {
  const res = await fetch(`${baseUrl}/api/v1/orders`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, totalCents, currency }),
  });
  if (!res.ok) throw new Error('Failed to place order');
  return res.json();
}
