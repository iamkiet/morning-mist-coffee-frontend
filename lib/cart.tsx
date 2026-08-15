'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import type { Product, ProductVariant } from '@/lib/types';

const STORAGE_KEY = 'morning-mist-cart';

export interface CartItem {
  productId: string;
  productVariantId: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (productVariantId: string) => void;
  updateQuantity: (productVariantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

// localStorage is an external store, so the cart is read through
// useSyncExternalStore: the server and the first client render both see
// EMPTY_CART, then React re-renders with the stored cart. Reading storage
// during render instead would hydrate a tree the server never produced.
const EMPTY_CART: CartItem[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY_CART;

function getSnapshot(): CartItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  // Re-parsing on every call would return a new array each time and loop forever
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedItems = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY_CART;
    } catch {
      cachedItems = EMPTY_CART;
    }
  }
  return cachedItems;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // 'storage' fires for other tabs, keeping carts in sync across them
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function writeCart(items: CartItem[]) {
  cachedItems = items;
  cachedRaw = JSON.stringify(items);
  localStorage.setItem(STORAGE_KEY, cachedRaw);
  listeners.forEach((notify) => notify());
}

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function addItem(product: Product, variant: ProductVariant, quantity = 1) {
    const existing = items.find((i) => i.productVariantId === variant.id);
    writeCart(
      existing
        ? items.map((i) =>
            i.productVariantId === variant.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        : [
            ...items,
            {
              productId: product.id,
              productVariantId: variant.id,
              slug: product.slug,
              name: product.name,
              sku: variant.sku,
              price: variant.price,
              imageUrl: product.imageUrl,
              quantity,
            },
          ],
    );
  }

  function removeItem(productVariantId: string) {
    writeCart(items.filter((i) => i.productVariantId !== productVariantId));
  }

  function updateQuantity(productVariantId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productVariantId);
      return;
    }
    writeCart(
      items.map((i) =>
        i.productVariantId === productVariantId ? { ...i, quantity } : i,
      ),
    );
  }

  function clearCart() {
    writeCart(EMPTY_CART);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
