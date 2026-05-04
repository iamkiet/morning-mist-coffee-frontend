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
import { useOrders, useUpdateOrderStatus } from '@/hooks/use-orders';
import type { Order, OrderStatus } from '@/lib/api/orders';

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
  const { data, isLoading, error } = useOrders(page, LIMIT);
  const updateStatus = useUpdateOrderStatus();

  const orders = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const offset = (page - 1) * LIMIT;

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (r) => (
        <span className="text-xs font-medium text-muted-foreground">
          #{r.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
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
      header: 'Status',
      render: (r) => (
        <Badge status={STATUS_BADGE[r.status] ?? 'neutral'}>
          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'total',
      header: 'Amount',
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
      header: 'Date',
      hideOnMobile: true,
      render: (r) => (
        <span className="text-muted-foreground text-xs">
          {new Date(r.createdAt).toLocaleDateString()}
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
                Mark {next}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="size-8">
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
        eyebrow="Orders"
        title="Morning Mist Overview"
        description="Each order, brewed and honored with intention."
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-10 w-full sm:w-64 bg-card"
            />
          </div>
        }
      />

      {error && (
        <div className="mb-4 p-3 border border-border text-destructive text-sm">
          Failed to load orders. Please try again.
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
                  Showing {offset + 1}–{Math.min(offset + orders.length, total)}{' '}
                  of {total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-none"
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
                    className="size-8 rounded-none"
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

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 group overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Morning Mist Coffee Admin
              </p>
              <h3 className="text-base mb-4 font-medium">
                Roastery Performance
              </h3>
              <div className="flex items-end gap-4">
                <div className="text-3xl font-light">
                  {total}{' '}
                  <span className="text-xs text-muted-foreground font-medium tracking-widest">
                    TOTAL ORDERS
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
              Order Stats
            </p>
            <div>
              <h3 className="text-base font-medium mb-1">
                {orders.filter((o) => o.status === 'pending').length} Pending
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {orders.filter((o) => o.status === 'delivered').length}{' '}
                delivered on this page.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="uppercase tracking-widest text-[10px]"
            >
              View All
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
