"use client";

import { useCart } from "@/lib/cart";

export default function CartCount() {
  const { itemCount } = useCart();
  if (itemCount === 0) return null;
  return (
    <span className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full size-4 flex items-center justify-center leading-none pointer-events-none">
      {itemCount > 9 ? "9+" : itemCount}
    </span>
  );
}
