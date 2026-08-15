'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import { useTemporaryFlag } from '@/hooks/use-temporary-flag';
import { getDefaultVariant } from '@/lib/product-variants';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, flashAdded] = useTemporaryFlag();
  const variant = getDefaultVariant(product);

  function handleAddToBag() {
    if (!variant) return;
    addItem(product, variant);
    flashAdded();
  }

  return (
    <div className="group flex flex-col">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative overflow-hidden aspect-[4/5] mb-4 rounded-xl bg-card shadow-sm transition-all duration-500 group-hover:shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
          {product.badge && (
            <div className="absolute top-4 right-4">
              <Badge
                variant="outline"
                className="bg-card/80 backdrop-blur-xl text-primary border-transparent text-[10px] uppercase tracking-wider"
              >
                {product.badge}
              </Badge>
            </div>
          )}
        </div>
        <div className="text-center px-4 mb-3">
          <h3 className="text-base text-foreground mb-2 font-medium line-clamp-2 min-h-12">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {variant ? `${variant.price.toLocaleString('vi-VN')} ₫` : 'Hết hàng'}
          </p>
        </div>
      </Link>

      <div className="px-4 mt-auto">
        <Button
          variant={added ? 'default' : 'outline'}
          onClick={handleAddToBag}
          aria-label={`Add ${product.name} to bag`}
          disabled={!variant}
          className="w-full text-xs uppercase tracking-wider gap-2 transition-all duration-300"
        >
          {added ? (
            <>
              <Check className="size-3.5" />
              Đã Thêm
            </>
          ) : (
            <>
              <ShoppingBag className="size-3.5" />
              Thêm Vào Giỏ
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
