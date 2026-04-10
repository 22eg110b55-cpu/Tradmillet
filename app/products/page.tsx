import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/products/ProductCard";
import { getAllProducts } from "@/utils/products";
import type { ProductCategory } from "@/utils/types";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore millet health powders and peanut butter powders for gym, kids, and seniors."
};

const tabs: { label: string; value?: ProductCategory }[] = [
  { label: "All", value: undefined },
  { label: "Fitness", value: "fitness" },
  { label: "Kids Products", value: "kids" },
  { label: "Senior Products", value: "senior" },
  { label: "Peanut Products", value: "peanut" }
];

export default async function ProductsPage({
  searchParams
}: {
  searchParams?: {
    category?: string;
  };
}) {
  const category = (searchParams?.category as ProductCategory | undefined) || undefined;
  const all = await getAllProducts();
  const products = category ? all.filter((p) => p.category === category) : all;

  return (
    <div className="container-prose py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Products</h1>
          <p className="mt-2 text-sm text-neutral-700">Premium blends for performance, growth, and wellness.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => {
            const href = t.value ? `/products?category=${t.value}` : "/products";
            const active = (t.value || undefined) === category;
            return (
              <Link
                key={t.label}
                href={href}
                className={
                  active
                    ? "chip bg-brand-green text-white ring-0"
                    : "chip hover:bg-white"
                }
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}


