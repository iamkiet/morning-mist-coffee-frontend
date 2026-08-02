'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { ProductCard } from '@/app/_components/ProductCard';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { useProducts } from '@/hooks/use-products';

const LIMIT = 8;

// A disabled <Button asChild> renders an <a>, and anchors never match the
// :disabled pseudo-class — the arrow would stay lit and clickable. Render a
// real disabled <button> instead when there is no page to go to.
interface PageArrowProps {
  page: number | null;
  label: string;
  children: React.ReactNode;
}

function PageArrow({ page, label, children }: PageArrowProps) {
  if (!page) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-lg size-9"
        aria-label={label}
        disabled
      >
        {children}
      </Button>
    );
  }
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-lg size-9"
      asChild
    >
      <Link href={`/shop?page=${page}`} aria-label={label}>
        {children}
      </Link>
    </Button>
  );
}

export function ShopContent() {
  const searchParams = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const { data, isLoading, isError } = useProducts(page, LIMIT);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const offset = (page - 1) * LIMIT;

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between mb-10 sm:mb-16 border-b border-border pb-6 gap-4">
        <div className="flex flex-wrap gap-8 sm:gap-12">
          {[
            { label: 'Vùng Trồng', value: 'Mọi Khu Vực' },
            { label: 'Mức Độ Rang', value: 'Sáng đến Vừa' },
            { label: 'Cách Pha Chế', value: 'Phễu Lọc (Pour Over)' },
          ].map((f) => (
            <div key={f.label} className="group relative">
              <label className="text-muted-foreground block mb-1 text-[10px] uppercase tracking-widest">
                {f.label}
              </label>
              <button className="flex items-center gap-2 text-foreground text-sm font-light border-b border-transparent group-hover:border-accent py-1 transition-all cursor-pointer">
                {f.value}
                <ChevronDown className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-[10px] uppercase tracking-widest">
            {isLoading
              ? 'Đang tải...'
              : total === 0
                ? 'Không có sản phẩm'
                : `Hiển thị ${offset + 1}–${Math.min(offset + items.length, total)} trên ${total}`}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg gap-2 text-xs uppercase tracking-wider"
          >
            Sắp xếp
            <ArrowUpDown className="size-3.5" />
          </Button>
        </div>
      </div>

      {isError && (
        <ErrorNotice>Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.</ErrorNotice>
      )}

      {isLoading ? (
        <ProductGridSkeleton count={LIMIT} />
      ) : !isError && items.length === 0 ? (
        <p className="text-center py-16 text-muted-foreground">
          Hiện chưa có sản phẩm nào để hiển thị.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-16 sm:mt-20 flex justify-center items-center gap-6">
          <PageArrow page={prevPage} label="Trang trước">
            <ChevronLeft className="size-4" />
          </PageArrow>
          <span className="text-foreground text-[10px] uppercase tracking-widest">
            {page} / {totalPages}
          </span>
          <PageArrow page={nextPage} label="Trang sau">
            <ChevronRight className="size-4" />
          </PageArrow>
        </div>
      )}
    </>
  );
}
