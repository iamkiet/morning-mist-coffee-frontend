'use client';

import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  Copy,
  Check,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTemporaryFlag } from '@/hooks/use-temporary-flag';
import type { Order, OrderStatus } from '@/lib/api/orders';
import { getVariantLabelFromSku } from '@/lib/product-variants';

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

// A status the API adds later must not blank out the whole page
const UNKNOWN_STATUS = {
  label: 'Không xác định',
  icon: Package,
  className: 'text-muted-foreground',
};

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const {
    label,
    icon: Icon,
    className,
  } = STATUS_CONFIG[order.status] ?? UNKNOWN_STATUS;
  const date = new Date(order.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const orderItemsList = order.items || [];
  const totalCentsFormatted = (order.totalCents ?? 0).toLocaleString('vi-VN');
  const [copied, triggerCopied] = useTemporaryFlag();

  function copyOrderId() {
    navigator.clipboard.writeText(order.id);
    triggerCopied();
  }

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Mã đơn hàng
            </p>
            <button
              type="button"
              onClick={copyOrderId}
              className="flex items-center gap-1.5 text-xs font-mono text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <span className="truncate">{order.id}</span>
              {copied ? (
                <Check className="size-3.5 shrink-0 text-primary" />
              ) : (
                <Copy className="size-3.5 shrink-0" />
              )}
            </button>
            <p className="text-xs text-muted-foreground mt-1">Đặt ngày {date}</p>
          </div>
          <div className={`flex items-center gap-1.5 shrink-0 ${className}`}>
            <Icon className="size-4" />
            <span className="text-xs font-medium uppercase tracking-widest">
              {label}
            </span>
          </div>
        </div>
        <Separator />
        {orderItemsList.length > 0 && (
          <div className="space-y-2">
            {orderItemsList.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-foreground">
                  {item.productName}
                  {item.variantSku && (
                    <span className="text-muted-foreground">
                      {' '}
                      — {getVariantLabelFromSku(item.variantSku)}
                    </span>
                  )}
                  <span className="text-muted-foreground ml-1">
                    ×{item.quantity}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  {(
                    (item.priceCents ?? 0) * (item.quantity ?? 1)
                  ).toLocaleString('vi-VN')}{' '}
                  ₫
                </span>
              </div>
            ))}
            <Separator />
          </div>
        )}
        <div className="flex justify-between text-sm font-medium">
          <span className="text-foreground uppercase tracking-widest text-xs">
            Tổng cộng
          </span>
          <span className="text-foreground">{totalCentsFormatted} ₫</span>
        </div>
        {order.shippingAddress && (
          <>
            <Separator />
            <div className="space-y-1 text-xs text-muted-foreground pt-1">
              <p className="uppercase tracking-widest text-[10px] mb-1">
                Giao đến
              </p>
              <p className="text-foreground font-medium">
                {order.shippingFirstName} {order.shippingLastName}
              </p>
              <p>
                {order.shippingAddress}, {order.shippingCity}
                {order.shippingPostalCode ? ` ${order.shippingPostalCode}` : ''}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
