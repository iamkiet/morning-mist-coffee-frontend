'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { Chip } from './Chip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';

export interface Product {
  id: string;
  slug: string;
  name: string;
  origin: string;
  price: number;
  image: string;
  notes: string[];
  stockQuantity?: number;
  badge?: string;
  description?: string;
  productTypeId?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToBag() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group flex flex-col">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative overflow-hidden aspect-[4/5] mb-4 rounded-xl bg-card shadow-sm transition-all duration-500 group-hover:shadow-lg">
          <Image
            src={product.image}
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
          <p className="text-xs text-primary tracking-widest mb-1 uppercase font-medium">
            {product.origin}
          </p>
          <h3 className="text-base text-foreground mb-2 font-medium">
            {product.name}
          </h3>
          <div className="flex justify-center gap-1 mb-2 flex-wrap">
            {product.notes.map((n) => (
              <Chip key={n}>{n}</Chip>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>

      <div className="px-4 mt-auto">
        <Button
          variant={added ? 'default' : 'outline'}
          onClick={handleAddToBag}
          aria-label={`Add ${product.name} to bag`}
          className="w-full text-xs uppercase tracking-widest gap-2 transition-all duration-300"
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
