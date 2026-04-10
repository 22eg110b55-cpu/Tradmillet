import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ProductCard } from "@/components/products/ProductCard";
import { RatingStars } from "@/components/ui/RatingStars";
import { getProductBySlug, getRelatedProducts } from "@/utils/products";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }]
    }
  };
}

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();
  const related = await getRelatedProducts(product, 3);

  return (
    <div className="container-prose py-10">
      <div className="text-sm text-neutral-600">
        <Link href="/products" className="hover:underline">
          Products
        </Link>{" "}
        / <span className="text-neutral-900">{product.name}</span>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white/70 ring-1 ring-black/5 backdrop-blur">
          <Image src={product.image} alt={product.name} fill className="object-contain p-10" priority />
        </div>

        <div>
          <div className="chip capitalize">{product.category} nutrition</div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-900">{product.name}</h1>
          <div className="mt-2">
            <RatingStars value={product.rating} />
          </div>
          <p className="mt-4 text-neutral-700">{product.description}</p>
          <div className="mt-5 flex items-baseline gap-3">
            <div className="text-3xl font-extrabold text-brand-brown">₹{product.price}</div>
            <div className="text-sm font-semibold text-neutral-600">Inclusive of all taxes</div>
          </div>
          <div className="mt-5 max-w-sm">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-8 grid gap-6">
            <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5 backdrop-blur">
              <div className="text-sm font-extrabold text-neutral-900">Ingredients</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
                {product.ingredients.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5 backdrop-blur">
              <div className="text-sm font-extrabold text-neutral-900">Nutrition facts (per {product.nutritionFacts.servingSize})</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Calories", String(product.nutritionFacts.calories)],
                  ["Protein", product.nutritionFacts.protein],
                  ["Carbs", product.nutritionFacts.carbs],
                  ["Fiber", product.nutritionFacts.fiber],
                  ["Fat", product.nutritionFacts.fat]
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-white p-3 ring-1 ring-black/5">
                    <div className="text-xs font-semibold text-neutral-500">{k}</div>
                    <div className="text-base font-extrabold text-neutral-900">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5 backdrop-blur">
              <div className="text-sm font-extrabold text-neutral-900">Health benefits</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
                {product.benefits.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5 backdrop-blur">
              <div className="text-sm font-extrabold text-neutral-900">Preparation</div>
              <ol className="mt-2 list-decimal pl-5 text-sm text-neutral-700">
                {product.preparation.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-2xl font-black tracking-tight text-neutral-900">Related products</h2>
          <Link href="/products" className="text-sm font-semibold text-brand-green hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}


