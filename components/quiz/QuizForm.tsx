"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ProductCategory } from "@/utils/types";
import type { Product } from "@/utils/types";

type AgeGroup = "kids" | "adult" | "senior";
type Goal = "strength" | "weight" | "wellness" | "growth";
type Diet = "veg" | "nonveg" | "any";

function recommendCategory(age: AgeGroup, goal: Goal): ProductCategory {
  if (age === "kids" || goal === "growth") return "kids";
  if (age === "senior" || goal === "wellness") return "senior";
  if (goal === "weight") return "fitness";
  return "fitness";
}

export function QuizForm({ products }: { products: Product[] }) {
  const all = useMemo(() => products, [products]);
  const [age, setAge] = useState<AgeGroup>("adult");
  const [goal, setGoal] = useState<Goal>("strength");
  const [diet, setDiet] = useState<Diet>("any");
  const [submitted, setSubmitted] = useState(false);

  const cat = recommendCategory(age, goal);
  const picks = all.filter((p) => p.category === cat).slice(0, 3);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form
        className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur lg:col-span-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="text-lg font-extrabold text-neutral-900">Health Recommendation Quiz</div>
        <p className="mt-2 text-sm text-neutral-700">Answer three quick questions to get your best-fit powder.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-neutral-700">
            Age group
            <select
              className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10"
              value={age}
              onChange={(e) => setAge(e.target.value as AgeGroup)}
            >
              <option value="kids">Kids</option>
              <option value="adult">Adults</option>
              <option value="senior">Senior citizens</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-neutral-700">
            Fitness goal
            <select
              className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10"
              value={goal}
              onChange={(e) => setGoal(e.target.value as Goal)}
            >
              <option value="strength">Strength & recovery</option>
              <option value="weight">Weight management</option>
              <option value="wellness">Daily wellness</option>
              <option value="growth">Growth & immunity</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-neutral-700 sm:col-span-2">
            Diet type
            <select
              className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-black/10"
              value={diet}
              onChange={(e) => setDiet(e.target.value as Diet)}
            >
              <option value="any">Any</option>
              <option value="veg">Vegetarian</option>
              <option value="nonveg">Non-vegetarian</option>
            </select>
          </label>
        </div>

        <button className="btn btn-primary mt-6 w-full">Get recommendation</button>

        {submitted ? (
          <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-black/10">
            <div className="text-sm font-extrabold text-neutral-900">Your match</div>
            <p className="mt-1 text-sm text-neutral-700">
              Based on your answers ({age}, {goal}, {diet}), we recommend <span className="font-extrabold capitalize">{cat}</span>{" "}
              products.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={`/products?category=${cat}`} className="chip bg-brand-green text-white ring-0">
                Shop {cat} products →
              </Link>
              <Link href="/products" className="chip">
                Browse all →
              </Link>
            </div>
          </div>
        ) : null}
      </form>

      <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
        <div className="text-lg font-extrabold text-neutral-900">Top picks</div>
        <p className="mt-2 text-sm text-neutral-700">Curated from your recommended category.</p>
        <div className="mt-4 grid gap-3">
          {picks.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`} className="rounded-xl bg-white p-4 ring-1 ring-black/10 hover:shadow-soft">
              <div className="text-sm font-extrabold text-neutral-900">{p.name}</div>
              <div className="mt-1 text-xs text-neutral-600">₹{p.price}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


