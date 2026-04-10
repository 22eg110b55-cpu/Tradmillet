"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/utils/types";
import { readCartFromStorage, writeCartToStorage } from "@/components/cart/cartStorage";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (slug: string) => void;
  setQuantity: (slug: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeCartToStorage(items);
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
    const subtotal = items.reduce((sum, it) => sum + it.quantity * it.product.price, 0);

    function addToCart(product: Product, qty = 1) {
      setItems((prev) => {
        const found = prev.find((x) => x.product.slug === product.slug);
        if (!found) return [...prev, { product, quantity: Math.max(1, qty) }];
        return prev.map((x) =>
          x.product.slug === product.slug ? { ...x, quantity: x.quantity + Math.max(1, qty) } : x
        );
      });
    }

    function removeFromCart(slug: string) {
      setItems((prev) => prev.filter((x) => x.product.slug !== slug));
    }

    function setQuantity(slug: string, qty: number) {
      setItems((prev) =>
        prev
          .map((x) => (x.product.slug === slug ? { ...x, quantity: qty } : x))
          .filter((x) => x.quantity > 0)
      );
    }

    function clearCart() {
      setItems([]);
    }

    return { items, totalItems, subtotal, addToCart, removeFromCart, setQuantity, clearCart };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


