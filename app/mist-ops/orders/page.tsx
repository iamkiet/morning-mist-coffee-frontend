'use client';

import {
  MoreHorizontal,
  Search,
  Receipt,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '../_components/PageHeader';
import { StatCard } from '../_components/StatCard';
import { Badge } from '../_components/Badge';
import { DataTable, Pagination, type Column } from '../_components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrders, useUpdateOrderStatus } from '@/hooks/use-orders';
import { toast } from 'sonner';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { Order, OrderStatus } from '@/lib/api/orders';

const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
];

const STATUS_VIETNAMESE: Record<OrderStatus, string> = {
  pending: 'Chờ xử lý',
  paid: 'Đã thanh toán',
  shipped: 'Đang giao hàng',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

interface EditOrderDialogProps {
  order: Order;
  onClose: () => void;
}

const orderSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
});

type OrderForm = z.infer<typeof orderSchema>;

function EditOrderDialog({ order, onClose }: EditOrderDialogProps) {
  const update = useUpdateOrderStatus();
  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: { status: order.status },
  });

  function onSubmit(values: OrderForm) {
    if (values.status === order.status) {
      onClose();
      return;
    }
    update.mutate(
      { id: order.id, status: values.status },
      {
        onSuccess: () => {
          toast.success('Đã cập nhật trạng thái đơn hàng');
          onClose();
        },
      },
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Chỉnh sửa Đơn hàng
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <p className="text-xs text-muted-foreground">
              #{order.id.slice(0, 8).toUpperCase()} · {order.email}
            </p>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ALL_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_VIETNAMESE[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {update.isError && (
              <ErrorNotice className="mb-0">
                Không thể cập nhật đơn hàng. Vui lòng thử lại.
              </ErrorNotice>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="uppercase tracking-wider text-xs"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                className="uppercase tracking-wider text-xs"
                disabled={update.isPending}
              >
                {update.isPending ? 'Đang lưu…' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const STATUS_BADGE = {
  pending: 'info',
  paid: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
} as const;

const NEXT_STATUSES: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'paid',
  paid: 'shipped',
  shipped: 'delivered',
};

const LIMIT = 20;

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isError } = useOrders(page, LIMIT, debouncedSearch);
  const updateStatus = useUpdateOrderStatus();

  const orders = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const offset = (page - 1) * LIMIT;

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Mã đơn hàng',
      render: (r) => (
        <button
          onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
          className="text-xs font-mono font-medium text-primary hover:underline cursor-pointer focus:outline-none"
        >
          #{r.id.slice(0, 8).toUpperCase()}
        </button>
      ),
    },
    {
      key: 'customer',
      header: 'Khách hàng',
      render: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-bold shrink-0">
            {r.email.slice(0, 2).toUpperCase()}
          </div>
          <p className="text-sm text-muted-foreground truncate min-w-0">{r.email}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => (
        <Badge status={STATUS_BADGE[r.status] ?? 'neutral'}>
          {STATUS_VIETNAMESE[r.status]}
        </Badge>
      ),
    },
    {
      key: 'total',
      header: 'Tổng tiền',
      align: 'right',
      hideOnMobile: true,
      render: (r) => (
        <span className="font-medium">
          {r.totalCents.toLocaleString('vi-VN')} ₫
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Ngày đặt',
      hideOnMobile: true,
      render: (r) => (
        <span className="text-muted-foreground text-xs">
          {new Date(r.createdAt).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => {
        const next = NEXT_STATUSES[r.status];
        return (
          <div className="flex items-center justify-end gap-1">
            {next && (
              <Button
                variant="outline"
                size="sm"
                className="text-[10px] uppercase tracking-wider h-7"
                disabled={updateStatus.isPending}
                onClick={() => updateStatus.mutate({ id: r.id, status: next })}
              >
                Chuyển sang: {STATUS_VIETNAMESE[next]}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setEditOrder(r)}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        eyebrow="Đơn hàng"
        title="Quản lý Đơn hàng Morning Mist"
        description="Mỗi đơn hàng đều được chuẩn bị và trân trọng tận tâm."
        actions={
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-10 bg-card w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                // A new query restarts paging — page 3 of the old result set is meaningless
                setPage(1);
              }}
            />
          </div>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Tổng đơn hàng"
          value={isLoading ? '—' : String(total)}
          icon={Receipt}
          tone="primary"
        />
        <StatCard
          label="Chờ xử lý"
          value={isLoading ? '—' : String(orders.filter((o) => o.status === 'pending').length)}
          delta="Trên trang này"
          icon={Clock}
          tone="secondary"
        />
        <StatCard
          label="Đã giao"
          value={isLoading ? '—' : String(orders.filter((o) => o.status === 'delivered').length)}
          delta="Trên trang này"
          icon={CheckCircle2}
          tone="tertiary"
        />
      </section>

      {isError && (
        <ErrorNotice>
          Không thể tải danh sách đơn hàng. Vui lòng thử lại.
        </ErrorNotice>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={orders}
          footer={
            <Pagination
              showing={
                total === 0
                  ? 'Không tìm thấy đơn hàng nào'
                  : `Hiển thị ${offset + 1}–${Math.min(offset + orders.length, total)} trên ${total}`
              }
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          }
        />
      )}

      {expandedId &&
        (() => {
          const order = orders.find((o) => o.id === expandedId);
          if (!order) return null;
          return (
            <Card className="mt-4 border-primary/20">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Đơn hàng #{order.id.slice(0, 8).toUpperCase()} · Sản phẩm
                  </p>
                  <button
                    onClick={() => setExpandedId(null)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                  >
                    Đóng
                  </button>
                </div>
                {(order.items || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Không có sản phẩm nào được ghi nhận.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(order.items || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-foreground">
                          {item.name}
                          <span className="text-muted-foreground ml-2">
                            ×{item.quantity}
                          </span>
                        </span>
                        <span className="text-muted-foreground">
                          {(item.priceCents * item.quantity).toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between text-sm font-medium border-t border-border">
                      <span className="uppercase tracking-widest text-xs text-muted-foreground">
                        Tổng cộng
                      </span>
                      <span>
                        {order.totalCents.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    {order.shippingAddress && (
                      <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t border-dashed border-border mt-2">
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
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()}

      {editOrder && (
        <EditOrderDialog order={editOrder} onClose={() => setEditOrder(null)} />
      )}
    </div>
  );
}
