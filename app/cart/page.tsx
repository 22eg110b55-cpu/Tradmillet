"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
  const { items, subtotal, removeFromCart, setQuantity } = useCart();

  return (
    <div className="container-prose py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Cart</h1>
          <p className="mt-2 text-sm text-neutral-700">Review your items and proceed to checkout.</p>
        </div>
        <Link href="/products" className="text-sm font-semibold text-brand-green hover:underline">
          Continue shopping →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white/70 p-8 text-center ring-1 ring-black/5 backdrop-blur">
          <div className="text-lg font-extrabold text-neutral-900">Your cart is empty</div>
          <p className="mt-2 text-sm text-neutral-700">Add some healthy powders to get started.</p>
          <div className="mt-5">
            <Link href="/products" className="btn btn-primary">
              Shop products
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-4">
            {items.map((it) => (
              <div key={it.product.slug} className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur">
                <div className="flex gap-4">
                  <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
                    <Image src={it.product.image} alt={it.product.name} fill className="object-contain p-3" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-extrabold text-neutral-900">{it.product.name}</div>
                        <div className="mt-1 text-sm font-semibold text-neutral-600">₹{it.product.price} each</div>
                      </div>
                      <button
                        className="rounded-xl p-2 hover:bg-black/5"
                        aria-label="Remove item"
                        onClick={() => removeFromCart(it.product.slug)}
                      >
                        <Trash2 className="h-5 w-5 text-neutral-700" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-2 rounded-xl bg-white px-2 py-1 ring-1 ring-black/10">
                        <button
                          className="rounded-lg p-2 hover:bg-black/5"
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity(it.product.slug, it.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="w-10 text-center text-sm font-extrabold">{it.quantity}</div>
                        <button
                          className="rounded-lg p-2 hover:bg-black/5"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(it.product.slug, it.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-base font-extrabold text-brand-brown">₹{it.quantity * it.product.price}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
            <div className="text-lg font-extrabold text-neutral-900">Order summary</div>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-700">Subtotal</span>
                <span className="font-extrabold text-neutral-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700">Shipping</span>
                <span className="font-extrabold text-neutral-900">₹0</span>
              </div>
              <div className="border-t border-black/10 pt-3 mt-2 flex justify-between">
                <span className="text-neutral-900 font-extrabold">Total</span>
                <span className="font-extrabold text-brand-brown">₹{subtotal}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn btn-primary mt-5 w-full">
              Checkout
            </Link>
            <p className="mt-3 text-xs text-neutral-500">Demo checkout (no payment gateway).</p>
          </div>
        </div>
      )}
    </div>
  );
}


