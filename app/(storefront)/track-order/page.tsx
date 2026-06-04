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
    label: 'Chờ xử lý',
    icon: Clock,
    className: 'text-muted-foreground',
  },
  paid: { label: 'Đã thanh toán', icon: CreditCard, className: 'text-primary' },
  shipped: { label: 'Đang giao hàng', icon: Truck, className: 'text-primary' },
  delivered: {
    label: 'Đã giao',
    icon: CheckCircle,
    className: 'text-primary',
  },
  cancelled: {
    label: 'Đã hủy',
    icon: XCircle,
    className: 'text-destructive',
  },
};

function OrderCard({ order }: { order: Order }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[order.status];
  const date = new Date(order.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const total = `₫${order.totalCents.toLocaleString('vi-VN')}`;

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Đơn hàng
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
                  ₫{(item.priceCents * item.quantity).toLocaleString('vi-VN')}
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
        {order.cashReceivedCents !== undefined && order.cashReceivedCents !== null && (
          <>
            <Separator />
            <div className="space-y-1 text-xs text-muted-foreground pt-1">
              <div className="flex justify-between">
                <span>Tiền khách đưa:</span>
                <span className="font-medium text-foreground">₫{order.cashReceivedCents.toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tiền thối lại:</span>
                <span className="font-medium text-foreground">₫{(order.changeCents ?? 0).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </>
        )}
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
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto pt-36 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Package className="size-5 text-primary" />
          <h1 className="text-3xl font-light text-foreground">
            Theo Dõi Đơn Hàng
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Nhập địa chỉ email bạn đã sử dụng khi đặt hàng để tra cứu thông tin đơn hàng.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <Input
          type="email"
          placeholder="email_cua_ban@example.com"
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
          {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive mb-6">{error}</p>}

      {orders !== null &&
        (orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="size-10 mx-auto mb-4 opacity-40" />
            <p className="text-sm">Không tìm thấy đơn hàng nào liên kết với email này.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
              Tìm thấy {orders.length} đơn hàng
            </p>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ))}
    </main>
  );
}
