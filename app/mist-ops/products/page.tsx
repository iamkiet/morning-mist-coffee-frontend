'use client';

import Image from 'next/image';
import {
  Pencil,
  Trash2,
  Download,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../_components/PageHeader';
import { DataTable, type Column } from '../_components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';
import type { Product } from '@/app/_components/ProductCard';

const LIMIT = 10;

const columns: Column<Product>[] = [
  {
    key: 'details',
    header: 'Product Details',
    render: (r) => (
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-card flex-shrink-0">
          <Image
            src={r.image}
            alt={r.name}
            fill
            sizes="64px"
            className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
        <div>
          <div className="text-base font-medium text-foreground">{r.name}</div>
          <div className="text-sm text-muted-foreground">{r.origin}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'price',
    header: 'Price',
    hideOnMobile: true,
    render: (r) => <span className="font-medium">${r.price.toFixed(2)}</span>,
  },
  {
    key: 'notes',
    header: 'Notes',
    hideOnMobile: true,
    render: (r) => (
      <span className="text-muted-foreground text-sm">
        {r.notes.length > 0 ? r.notes[0] : '—'}
      </span>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    align: 'right',
    hideOnMobile: true,
    render: () => (
      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="size-8">
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    ),
  },
];

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useProducts(page, LIMIT);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const offset = (page - 1) * LIMIT;

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Inventory Management"
        description="Morning Mist was born from the quiet clarity of a high-altitude mist, where every bean tells the story of the soil it was cradled in."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="uppercase tracking-wider"
            >
              <Download className="size-4" />
              Export CSV
            </Button>
            <Button size="sm" className="uppercase tracking-wider">
              <Plus className="size-4" />
              Add Product
            </Button>
          </>
        }
      />

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-grow w-full sm:max-w-[32rem]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-10 bg-muted border-0"
              placeholder="Search beans, brewers, or accessories..."
            />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {isLoading ? 'Loading...' : `${total} products total`}
          </p>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-4 p-3 border border-border text-destructive text-sm">
          Failed to load products. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          footer={
            totalPages > 1 ? (
              <div className="px-4 py-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Showing {offset + 1}–{Math.min(offset + items.length, total)}{' '}
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
    </div>
  );
}
