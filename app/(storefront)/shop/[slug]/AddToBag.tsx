'use client';

import { useState } from 'react';
import { Minus, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart';
import { useTemporaryFlag } from '@/hooks/use-temporary-flag';
import { getDefaultVariant, getVariantLabel } from '@/lib/product-variants';
import type { Product } from '@/lib/types';

interface AddToBagProps {
  product: Product;
}

export function AddToBag({ product }: AddToBagProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, flashAdded] = useTemporaryFlag();
  const [variantId, setVariantId] = useState(
    () => getDefaultVariant(product)?.id ?? product.variants[0]?.id,
  );

  const variant = product.variants.find((v) => v.id === variantId);
  const outOfStock = variant === undefined || variant.stock <= 0;

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => Math.max(1, Math.min(q + 1, variant?.stock ?? 1)));
  }

  function handleAdd() {
    if (!variant) return;
    addItem(product, variant, quantity);
    flashAdded(() => setQuantity(1));
  }

  return (
    <div className="space-y-6">
      {product.variants.length > 1 && (
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Trọng lượng
          </span>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                disabled={v.stock <= 0}
                aria-pressed={v.id === variantId}
                className={cn(
                  'px-4 py-2 rounded-lg border text-sm uppercase tracking-wider transition-colors',
                  v.id === variantId
                    ? 'border-primary bg-primary/5 text-primary font-medium'
                    : 'border-border text-muted-foreground hover:border-primary/50',
                  v.stock <= 0 && 'opacity-40 line-through cursor-not-allowed',
                )}
              >
                {getVariantLabel(v)}
              </button>
            ))}
          </div>
        </div>
      )}
      {product.variants.length === 1 && variant && (
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          Trọng lượng: {getVariantLabel(variant)}
        </p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-3xl text-foreground">
          {variant ? `${variant.price.toLocaleString('vi-VN')} ₫` : 'Hết hàng'}
        </span>
        <div className="flex items-center border border-border rounded-lg bg-card">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Decrease quantity"
            className="text-primary"
            onClick={decrement}
            disabled={quantity <= 1}
          >
            <Minus className="size-4" />
          </Button>
          <span className="px-6 text-foreground min-w-[2rem] text-center">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Increase quantity"
            className="text-primary"
            onClick={increment}
            disabled={outOfStock || quantity >= (variant?.stock ?? 1)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
      <Button
        size="lg"
        className="w-full tracking-[0.2em] gap-2"
        onClick={handleAdd}
        disabled={added || outOfStock}
      >
        {added ? (
          <>
            <Check className="size-4" />
            Đã Thêm Vào Giỏ
          </>
        ) : outOfStock ? (
          'Hết Hàng'
        ) : (
          'Thêm Vào Giỏ Hàng'
        )}
      </Button>
    </div>
  );
}
