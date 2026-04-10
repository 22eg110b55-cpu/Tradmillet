import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/utils/products";

export const metadata: Metadata = {
  title: "Recipes",
  description: "Healthy recipes using millet powders and peanut butter powder."
};

const recipes = [
  {
    title: "Millet Breakfast Bowl",
    desc: "Warm, comforting bowl with fruits and nuts.",
    steps: ["Cook millet mix in milk/water", "Top with banana & berries", "Add nuts and a drizzle of honey"]
  },
  {
    title: "Peanut Butter Sandwich",
    desc: "Quick protein snack for kids and gym routines.",
    steps: ["Mix peanut powder with water", "Spread on toast", "Add sliced banana or dates"]
  },
  {
    title: "Healthy Smoothie",
    desc: "Creamy shake for energy and recovery.",
    steps: ["Blend milk + banana", "Add peanut powder + millet mix", "Finish with cinnamon"]
  }
];

export default async function RecipesPage() {
  const products = await getAllProducts();
  return (
    <div className="container-prose py-10">
      <h1 className="text-3xl font-black tracking-tight text-neutral-900">Recipes</h1>
      <p className="mt-2 text-sm text-neutral-700">Simple ways to use TradMillet powders every day.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {recipes.map((r) => (
          <div key={r.title} className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
            <div className="text-lg font-extrabold text-neutral-900">{r.title}</div>
            <p className="mt-2 text-sm text-neutral-700">{r.desc}</p>
            <ol className="mt-4 list-decimal pl-5 text-sm text-neutral-700">
              {r.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
        <div className="text-lg font-extrabold text-neutral-900">Recommended products</div>
        <p className="mt-2 text-sm text-neutral-700">Pick a powder and start cooking.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {products.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`} className="chip hover:bg-white">
              {p.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


