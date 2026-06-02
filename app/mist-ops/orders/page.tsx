'use client';

import Image from 'next/image';
import {
  MoreHorizontal,
  Search,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../_components/PageHeader';
import { Badge } from '../_components/Badge';
import { DataTable, type Column } from '../_components/DataTable';
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
import { Label } from '@/components/ui/label';
import { useOrders, useUpdateOrderStatus } from '@/hooks/use-orders';
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

function EditOrderDialog({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const update = useUpdateOrderStatus();
  const [status, setStatus] = useState<OrderStatus>(order.status);

  function handleSave() {
    if (status === order.status) {
      onClose();
      return;
    }
    update.mutate({ id: order.id, status }, { onSuccess: onClose });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest font-medium">
            Chỉnh sửa Đơn hàng
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-xs text-muted-foreground">
            #{order.id.slice(0, 8).toUpperCase()} · {order.email}
          </p>
          <div className="space-y-1.5">
            <Label
              htmlFor="eo-status"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Trạng thái
            </Label>
            <select
              id="eo-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_VIETNAMESE[s]}
                </option>
              ))}
            </select>
          </div>
          {update.isError && (
            <p className="text-xs text-destructive">
              Không thể cập nhật đơn hàng. Vui lòng thử lại.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="uppercase tracking-wider text-xs"
          >
            Hủy
          </Button>
          <Button
            size="sm"
            className="uppercase tracking-wider text-xs"
            disabled={update.isPending}
            onClick={handleSave}
          >
            {update.isPending ? 'Đang lưu…' : 'Lưu'}
          </Button>
        </DialogFooter>
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
  const { data, isLoading, error } = useOrders(page, LIMIT);
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
        <span className="text-xs font-medium text-muted-foreground">
          #{r.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Khách hàng',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-bold">
            {r.email.slice(0, 2).toUpperCase()}
          </div>
          <p className="text-sm text-muted-foreground">{r.email}</p>
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
          {r.currency === 'VND'
            ? `₫${r.totalCents.toLocaleString()}`
            : `$${(r.totalCents / 100).toFixed(2)}`}
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
        title="Quản lý Đơn hàng Todaywegrind"
        description="Mỗi đơn hàng đều được chuẩn bị và trân trọng tận tâm."
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-10 w-full sm:w-64 bg-card"
            />
          </div>
        }
      />

      {error && (
        <div className="mb-4 p-3 border border-border text-destructive text-sm">
          Không thể tải danh sách đơn hàng. Vui lòng thử lại.
        </div>
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
            totalPages > 1 ? (
              <div className="px-4 py-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Hiển thị {offset + 1}–{Math.min(offset + orders.length, total)}{' '}
                  trên {total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-lg"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            ) : null
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
                {order.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Không có sản phẩm nào được ghi nhận.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {order.items.map((item) => (
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
                          $
                          {((item.priceCents * item.quantity) / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between text-sm font-medium border-t border-border">
                      <span className="uppercase tracking-widest text-xs text-muted-foreground">
                        Tổng cộng
                      </span>
                      <span>
                        {order.currency === 'VND'
                          ? `₫${order.totalCents.toLocaleString()}`
                          : `$${(order.totalCents / 100).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()}

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 group overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Quản trị Todaywegrind Coffee
              </p>
              <h3 className="text-base mb-4 font-medium">
                Hiệu suất xưởng rang
              </h3>
              <div className="flex items-end gap-4">
                <div className="text-3xl font-light">
                  {total}{' '}
                  <span className="text-xs text-muted-foreground font-medium tracking-widest">
                    TỔNG ĐƠN HÀNG
                  </span>
                </div>
                <div className="pb-2 text-primary">
                  <TrendingUp className="size-5" />
                </div>
              </div>
            </div>
            <div className="hidden sm:block relative w-48 h-32 rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWsTLsdoTDI_GDXjxR54VXkq5h_RompGiymV52_9aRS8Okmf1tqotSJET0IjRNFd3zN390f5hnqkjvFld1ZS6kitoJTxBppidk5_Y0kxkEtfce063cgbps1qSCIB856f8C_s9XisG2Z-n_IKZRyWl08M_RWPyZVk7XkCpsNFtN5Idk3aABLDHb224oGkSq0-UQxJycL7xBnOIyLNKy79h8yDijxRdVBCoFaG6naZ3WfsYUnSe_4ds8NqCMglLDeIz3s9F6E_A8kMk"
                alt="Roasting"
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/30">
          <CardContent className="p-6 flex flex-col justify-between gap-4 h-full">
            <p className="text-xs text-accent-foreground uppercase tracking-widest">
              Thống kê đơn hàng
            </p>
            <div>
              <h3 className="text-base font-medium mb-1">
                {orders.filter((o) => o.status === 'pending').length} Chờ xử lý
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Có {orders.filter((o) => o.status === 'delivered').length}{' '}
                đơn đã giao trên trang này.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="uppercase tracking-widest text-[10px]"
            >
              Xem tất cả
            </Button>
          </CardContent>
        </Card>
      </section>

      {editOrder && (
        <EditOrderDialog order={editOrder} onClose={() => setEditOrder(null)} />
      )}
    </div>
  );
}
