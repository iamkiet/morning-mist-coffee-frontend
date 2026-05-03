"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "../../_components/ProductCard";
import { useProducts } from "@/hooks/use-products";

const LIMIT = 8;

export default function ShopPage() {
  const searchParams = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const { data, isLoading, error } = useProducts(page, LIMIT);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const offset = (page - 1) * LIMIT;

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <main className="pt-36 pb-xl px-4 sm:px-6 md:px-12 max-w-[1920px] mx-auto">
      <header className="mb-10 sm:mb-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-foreground font-light mb-4">The Whole Collection</h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-light">
          Explore our curated selection of sustainably sourced beans and artisan equipment,
          designed for the mindful morning ritual.
        </p>
      </header>

      <div className="flex flex-wrap items-end justify-between mb-10 sm:mb-16 border-b border-border pb-6 gap-4">
        <div className="flex flex-wrap gap-8 sm:gap-12">
          {[
            { label: "Origin", value: "All Regions" },
            { label: "Roast Level", value: "Light to Medium" },
            { label: "Brew Method", value: "Pour Over" },
          ].map((f) => (
            <div key={f.label} className="group relative">
              <label className="text-muted-foreground block mb-1 text-[10px] uppercase tracking-widest">{f.label}</label>
              <button className="flex items-center gap-2 text-foreground text-sm font-light border-b border-transparent group-hover:border-accent py-1 transition-all cursor-pointer">
                {f.value}
                <ChevronDown className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-[10px] uppercase tracking-widest">
            {isLoading ? "Loading..." : `Showing ${offset + 1}–${Math.min(offset + items.length, total)} of ${total}`}
          </span>
          <Button variant="outline" size="sm" className="rounded-none gap-2 text-xs uppercase tracking-wider">
            Sort
            <ArrowUpDown className="size-3.5" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-center py-8 text-red-500">
          Failed to load products. Please try again.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
        {isLoading
          ? Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-[4/5] rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {totalPages > 1 && (
        <div className="mt-16 sm:mt-xl flex justify-center items-center gap-6">
          <Button variant="outline" size="icon" className="rounded-none size-9" asChild disabled={!prevPage}>
            <Link href={prevPage ? `/shop?page=${prevPage}` : "#"}>
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
          <span className="text-foreground text-[10px] uppercase tracking-widest">
            {page} / {totalPages}
          </span>
          <Button variant="outline" size="icon" className="rounded-none size-9" asChild disabled={!nextPage}>
            <Link href={nextPage ? `/shop?page=${nextPage}` : "#"}>
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
}
