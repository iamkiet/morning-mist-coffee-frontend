import { authFetch } from "./client";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customerId: string;
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
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const res = await authFetch(`/api/v1/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}
