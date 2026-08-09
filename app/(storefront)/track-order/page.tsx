'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Package,
  Search,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Container } from '@/app/_components/Container';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { useLookupOrders } from '@/hooks/use-orders';
import type { Order, OrderStatus } from '@/lib/api/orders';

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

function OrderCard({ order }: OrderCardProps) {
  const {
    label,
    icon: Icon,
    className,
  } = STATUS_CONFIG[order.status] ?? UNKNOWN_STATUS;
  const date = new Date(order.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const orderId = order.id ? order.id.slice(0, 8).toUpperCase() : '';
  const orderItemsList = order.items || [];
  const totalCentsFormatted = (order.totalCents ?? 0).toLocaleString('vi-VN');

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Đơn hàng
            </p>
            <p className="text-xs font-mono text-foreground">
              #{orderId}
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
        {orderItemsList.length > 0 && (
          <div className="space-y-2">
            {orderItemsList.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-foreground">
                  {item.name}
                  <span className="text-muted-foreground ml-1">×{item.quantity}</span>
                </span>
                <span className="text-muted-foreground">
                  {((item.priceCents ?? 0) * (item.quantity ?? 1)).toLocaleString('vi-VN')} ₫
                </span>
              </div>
            ))}
            <Separator />
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{date}</span>
          <span className="font-medium text-foreground">{totalCentsFormatted} ₫</span>
        </div>
        {order.shippingAddress && (
          <>
            <Separator />
            <div className="space-y-1 text-xs text-muted-foreground pt-1">
              <p className="uppercase tracking-widest text-[10px] mb-1">Giao đến</p>
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

const trackOrderSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  code: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{8}$/, 'Mã đơn hàng gồm 8 ký tự in trên biên nhận'),
});

type TrackOrderForm = z.infer<typeof trackOrderSchema>;

export default function TrackOrderPage() {
  const lookup = useLookupOrders();
  const orders = lookup.data ?? null;

  const form = useForm<TrackOrderForm>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { email: '', code: '' },
  });

  function onSubmit(values: TrackOrderForm) {
    lookup.mutate({ email: values.email, code: values.code.trim() });
  }

  return (
    <Container size="narrow" navOffset className="pb-16 min-h-screen">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Package className="size-5 text-primary" />
          <h1 className="text-3xl font-light text-foreground">
            Theo Dõi Đơn Hàng
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Nhập email và mã đơn hàng (8 ký tự in trên biên nhận) để tra cứu thông tin đơn hàng.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row sm:items-start gap-3 mb-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input type="email" placeholder="email_cua_ban@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="sm:w-44">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Mã đơn hàng"
                    maxLength={8}
                    className="font-mono uppercase"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={lookup.isPending}
            className="gap-2 uppercase tracking-wider text-xs"
          >
            <Search className="size-4" />
            {lookup.isPending ? 'Đang tìm...' : 'Tìm kiếm'}
          </Button>
        </form>
      </Form>

      {lookup.isError && (
        <ErrorNotice className="mb-6">Đã xảy ra lỗi. Vui lòng thử lại sau.</ErrorNotice>
      )}

      {orders !== null &&
        (orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="size-10 mx-auto mb-4 opacity-40" />
            <p className="text-sm">
              Không tìm thấy đơn hàng nào khớp với email và mã đơn hàng này.
            </p>
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
    </Container>
  );
}
