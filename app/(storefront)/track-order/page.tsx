'use client';

import { useState } from 'react';
import {
  Package,
  Search,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { lookupOrders, type Order, type OrderStatus } from '@/lib/api/orders';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'text-muted-foreground',
  },
  paid: { label: 'Paid', icon: CreditCard, className: 'text-primary' },
  shipped: { label: 'Shipped', icon: Truck, className: 'text-primary' },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    className: 'text-primary',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'text-destructive',
  },
};

function OrderCard({ order }: { order: Order }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[order.status];
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const total = (order.totalCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: order.currency,
  });

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Order
            </p>
            <p className="text-xs font-mono text-foreground">
              {order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div className={`flex items-center gap-1.5 ${className}`}>
            <Icon className="size-4" />
            <span className="text-xs font-medium uppercase tracking-widest">
              {label}
            </span>
          </div>
        </div>
        <Separator />
        {order.items.length > 0 && (
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-foreground">
                  {item.name}
                  <span className="text-muted-foreground ml-1">×{item.quantity}</span>
                </span>
                <span className="text-muted-foreground">
                  ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
            <Separator />
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{date}</span>
          <span className="font-medium text-foreground">{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TrackOrderPage() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await lookupOrders(email);
      setOrders(result);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto pt-32 sm:pt-40 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Package className="size-5 text-primary" />
          <h1 className="text-3xl font-light text-foreground">
            Track Your Order
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter the email address you used at checkout to find your orders.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="gap-2 uppercase tracking-widest text-xs"
        >
          <Search className="size-4" />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive mb-6">{error}</p>}

      {orders !== null &&
        (orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="size-10 mx-auto mb-4 opacity-40" />
            <p className="text-sm">No orders found for this email address.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
              {orders.length} order{orders.length !== 1 ? 's' : ''} found
            </p>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ))}
    </main>
  );
}
