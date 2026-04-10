"use client";

import type { Product } from "@/utils/types";
import { useCart } from "@/components/cart/CartContext";
import { useState } from "react";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      className={added ? "btn w-full bg-brand-orange text-white shadow-soft" : "btn btn-primary w-full"}
      onClick={() => {
        addToCart(product, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2000);
      }}
    >
      {added ? "✔ Added to Cart" : "Add to Cart"}
    </button>
  );
}


