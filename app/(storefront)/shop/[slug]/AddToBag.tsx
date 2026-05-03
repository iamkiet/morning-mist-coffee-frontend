"use client";

import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import type { Product } from "@/app/_components/ProductCard";

export function AddToBag({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => q + 1);
  }

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuantity(1);
    }, 1500);
  }

  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between">
        <span className="text-3xl text-foreground">${product.price.toFixed(2)}</span>
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
          <span className="px-md text-foreground min-w-[2rem] text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Increase quantity"
            className="text-primary"
            onClick={increment}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
      <Button
        size="lg"
        className="w-full tracking-[0.2em] gap-2"
        onClick={handleAdd}
        disabled={added}
      >
        {added ? (
          <>
            <Check className="size-4" />
            Added to Bag
          </>
        ) : (
          "Add to Bag"
        )}
      </Button>
    </div>
  );
}
