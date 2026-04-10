import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Nutrition tips, millet benefits, breakfast ideas, and peanut butter powder hacks."
};

const posts = [
  {
    slug: "benefits-of-millet-foods",
    title: "Benefits of Millet Foods",
    excerpt: "Why millets are a powerhouse for energy, minerals, and gut health."
  },
  {
    slug: "healthy-breakfast-ideas",
    title: "Healthy Breakfast Ideas",
    excerpt: "Quick, delicious breakfast recipes using millet and peanut powders."
  },
  {
    slug: "peanut-butter-nutrition-benefits",
    title: "Peanut Butter Nutrition Benefits",
    excerpt: "Protein, good fats, and why powdered peanut fits modern diets."
  }
];

export default function BlogPage() {
  return (
    <div className="container-prose py-10">
      <h1 className="text-3xl font-black tracking-tight text-neutral-900">Blog</h1>
      <p className="mt-2 text-sm text-neutral-700">Practical nutrition guidance—simple, traditional, and science-friendly.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur hover:shadow-soft"
          >
            <div className="text-lg font-extrabold text-neutral-900">{p.title}</div>
            <p className="mt-2 text-sm text-neutral-700">{p.excerpt}</p>
            <div className="mt-4 text-sm font-semibold text-brand-green">Read more →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}


