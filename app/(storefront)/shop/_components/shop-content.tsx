'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ErrorNotice } from '@/app/_components/ErrorNotice';
import { ProductCard } from '@/app/_components/ProductCard';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { useProducts } from '@/hooks/use-products';
import { useProductCategories } from '@/hooks/use-product-categories';
import {
  ALL_VALUE,
  DEFAULT_SORT_KEY,
  ORIGIN_OPTIONS,
  PROCESS_OPTIONS,
  ROAST_OPTIONS,
  SORT_OPTIONS,
} from './shop-filters';

const LIMIT = 8;

interface PageArrowProps {
  href: string | null;
  label: string;
  children: React.ReactNode;
}

function PageArrow({ href, label, children }: PageArrowProps) {
  if (!href) {
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
    <Button variant="outline" size="icon" className="rounded-lg size-9" asChild>
      <Link href={href} aria-label={label}>
        {children}
      </Link>
    </Button>
  );
}

export function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const sortKey = searchParams.get('sort') ?? DEFAULT_SORT_KEY;
  const category = searchParams.get('category') ?? '';
  const origin = searchParams.get('origin') ?? '';
  const roast = searchParams.get('roast') ?? '';
  const process = searchParams.get('process') ?? '';

  const sort =
    SORT_OPTIONS.find((o) => o.key === sortKey) ?? SORT_OPTIONS[0];

  const categoriesQuery = useProductCategories();
  const categories = categoriesQuery.data?.items ?? [];

  const { data, isLoading, isError } = useProducts(page, LIMIT, '', {
    sortBy: sort.sortBy,
    sortDir: sort.sortDir,
    filters: {
      categoryId: category || undefined,
      origin: origin || undefined,
      roast: roast || undefined,
      process: process || undefined,
    },
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const offset = (page - 1) * LIMIT;

  function buildQuery(updates: Record<string, string | null>): string {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    }
    return params.toString();
  }

  function applyFilter(key: string, value: string | null) {
    const query = buildQuery({ [key]: value, page: null });
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const prevHref =
    page > 1 ? `${pathname}?${buildQuery({ page: String(page - 1) })}` : null;
  const nextHref =
    page < totalPages
      ? `${pathname}?${buildQuery({ page: String(page + 1) })}`
      : null;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between mb-10 sm:mb-16 border-b border-border pb-6 gap-4">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
          <FilterSelect
            label="Danh mục"
            value={category || ALL_VALUE}
            placeholder="Tất cả danh mục"
            onChange={(v) => applyFilter('category', v === ALL_VALUE ? null : v)}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
          <FilterSelect
            label="Vùng trồng"
            value={origin || ALL_VALUE}
            placeholder="Mọi vùng"
            onChange={(v) => applyFilter('origin', v === ALL_VALUE ? null : v)}
            options={ORIGIN_OPTIONS.map((o) => ({ value: o, label: o }))}
          />
          <FilterSelect
            label="Mức độ rang"
            value={roast || ALL_VALUE}
            placeholder="Mọi mức rang"
            onChange={(v) => applyFilter('roast', v === ALL_VALUE ? null : v)}
            options={ROAST_OPTIONS.map((o) => ({ value: o, label: o }))}
          />
          <FilterSelect
            label="Cách pha chế"
            value={process || ALL_VALUE}
            placeholder="Mọi cách pha"
            onChange={(v) => applyFilter('process', v === ALL_VALUE ? null : v)}
            options={PROCESS_OPTIONS.map((o) => ({ value: o, label: o }))}
          />
        </div>
        <div className="flex items-end gap-4">
          <FilterSelect
            label="Sắp xếp"
            value={sort.key}
            placeholder="Sắp xếp"
            includeAll={false}
            onChange={(v) => applyFilter('sort', v === DEFAULT_SORT_KEY ? null : v)}
            options={SORT_OPTIONS.map((o) => ({ value: o.key, label: o.label }))}
          />
        </div>
      </div>

      <div className="mb-6 text-muted-foreground text-[10px] uppercase tracking-widest">
        {isLoading
          ? 'Đang tải...'
          : total === 0
            ? 'Không có sản phẩm'
            : `Hiển thị ${offset + 1}–${Math.min(offset + items.length, total)} trên ${total}`}
      </div>

      {isError && (
        <ErrorNotice>Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.</ErrorNotice>
      )}

      {isLoading ? (
        <ProductGridSkeleton count={LIMIT} />
      ) : !isError && items.length === 0 ? (
        <p className="text-center py-16 text-muted-foreground">
          Không tìm thấy sản phẩm phù hợp với bộ lọc. Vui lòng thử lựa chọn khác.
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
          <PageArrow href={prevHref} label="Trang trước">
            <ChevronLeft className="size-4" />
          </PageArrow>
          <span className="text-foreground text-[10px] uppercase tracking-widest">
            {page} / {totalPages}
          </span>
          <PageArrow href={nextHref} label="Trang sau">
            <ChevronRight className="size-4" />
          </PageArrow>
        </div>
      )}
    </>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: React.ReactNode }>;
  includeAll?: boolean;
}

function FilterSelect({
  label,
  value,
  placeholder,
  onChange,
  options,
  includeAll = true,
}: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-muted-foreground text-[10px] uppercase tracking-widest">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {includeAll && <SelectItem value={ALL_VALUE}>{placeholder}</SelectItem>}
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
