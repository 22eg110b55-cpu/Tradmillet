"use client";

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

const nav = [
  { href: "/products", label: "Products" },
  { href: "/recipes", label: "Recipes" },
  { href: "/quiz", label: "Health Quiz" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const { totalItems } = useCart();
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/60 backdrop-blur">
      <div className="container-prose flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-green text-white font-black">
            T
          </span>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight text-neutral-900">TradMillet Foods</div>
            <div className="text-[11px] font-semibold text-neutral-600">Traditional Nutrition. Modern Health.</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((x) => (
            <Link key={x.href} href={x.href} className="text-sm font-semibold text-neutral-700 hover:text-neutral-900">
              {x.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="hidden items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-black/5 sm:inline-flex"
          >
            <User className="h-4 w-4" />
            <span>Account</span>
          </Link>
          <Link href="/cart" className="relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-black/5">
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-orange px-1 text-[11px] font-extrabold text-white">
                {totalItems}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
      <div className="border-t border-black/5 md:hidden">
        <div className="container-prose flex items-center justify-between gap-3 overflow-x-auto py-2">
          {nav.map((x) => (
            <Link key={x.href} href={x.href} className="chip whitespace-nowrap">
              {x.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}


