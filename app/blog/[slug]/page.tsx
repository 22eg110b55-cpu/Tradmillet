import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const posts: Record<
  string,
  { title: string; description: string; content: { h: string; p: string }[] }
> = {
  "benefits-of-millet-foods": {
    title: "Benefits of Millet Foods",
    description: "Millets are nutrient-dense grains that support energy, digestion, and metabolic health.",
    content: [
      { h: "1) Slow-release energy", p: "Millets provide complex carbohydrates and fiber—great for stable energy levels." },
      { h: "2) Minerals and micronutrients", p: "Many millets are rich in iron, calcium, magnesium, and B-vitamins." },
      { h: "3) Gut-friendly", p: "The fiber in millets supports digestion and a healthy gut microbiome." }
    ]
  },
  "healthy-breakfast-ideas": {
    title: "Healthy Breakfast Ideas",
    description: "Easy breakfasts with millet and peanut powders for busy mornings.",
    content: [
      { h: "Millet breakfast bowl", p: "Cook porridge, add fruits, nuts, and a scoop of millet mix." },
      { h: "Peanut smoothie", p: "Blend banana + milk + peanut butter powder + cinnamon." },
      { h: "Toast spread", p: "Mix peanut powder with water for a quick spread." }
    ]
  },
  "peanut-butter-nutrition-benefits": {
    title: "Peanut Butter Nutrition Benefits",
    description: "Peanut powder offers protein and great taste with lighter fat than traditional spreads.",
    content: [
      { h: "Protein-friendly", p: "Great for gym routines and satiety, especially in smoothies." },
      { h: "Versatile", p: "Use in oats, yogurt, baking, and sauces for a nutty flavor boost." },
      { h: "Easy to portion", p: "Powdered formats make it easy to measure and control servings." }
    ]
  }
};

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = posts[params.slug];
  if (!post) return { title: "Blog" };
  return { title: post.title, description: post.description };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) return notFound();

  return (
    <div className="container-prose py-10">
      <Link href="/blog" className="text-sm font-semibold text-brand-green hover:underline">
        ← Back to blog
      </Link>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-neutral-900">{post.title}</h1>
      <p className="mt-2 text-sm text-neutral-700">{post.description}</p>

      <article className="mt-8 space-y-6">
        {post.content.map((x) => (
          <section key={x.h} className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
            <h2 className="text-lg font-extrabold text-neutral-900">{x.h}</h2>
            <p className="mt-2 text-sm text-neutral-700">{x.p}</p>
          </section>
        ))}
      </article>
    </div>
  );
}


