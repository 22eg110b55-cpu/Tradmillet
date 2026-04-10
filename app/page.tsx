import Image from "next/image";
import Link from "next/link";
import { Leaf, ShieldCheck, Sparkles, Wheat } from "lucide-react";
import { MotionSection } from "@/components/ui/MotionSection";
import { ProductCard } from "@/components/products/ProductCard";
import { TestimonialsSlider } from "@/components/home/TestimonialsSlider";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { getAllProducts } from "@/utils/products";

export default async function HomePage() {
  const products = await getAllProducts();
  const featured = products.slice(0, 5);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(46,125,50,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(245,124,0,0.14),transparent_55%)]" />
        </div>
        <div className="container-prose relative py-14 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="chip">Premium · 100% Natural · No Preservatives</div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-neutral-900 md:text-5xl">
                Pure Natural Nutrition for Every Generation
              </h1>
              <p className="mt-3 inline-flex items-center rounded-full bg-brand-cream/80 px-4 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-brown shadow-sm ring-1 ring-brand-brown/10">
                We love your love
              </p>
              <p className="mt-4 text-base text-neutral-700 md:text-lg">
                Healthy millet and peanut products inspired by traditional village foods. Live making of the millet is
                provided so you can see the care that goes into every batch.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/products" className="btn btn-primary">
                  Shop Now
                </Link>
                <Link href="/quiz" className="btn btn-secondary">
                  Explore Nutrition
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur">
                  <div className="text-sm font-extrabold text-brand-green">Fitness</div>
                  <div className="mt-1 text-xs text-neutral-600">Power & recovery</div>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur">
                  <div className="text-sm font-extrabold text-brand-orange">Kids</div>
                  <div className="mt-1 text-xs text-neutral-600">Growth & immunity</div>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur">
                  <div className="text-sm font-extrabold text-brand-brown">Seniors</div>
                  <div className="mt-1 text-xs text-neutral-600">Wellness & bones</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-brand-green/10 via-white/20 to-brand-orange/10 blur-2xl" />
              <div className="relative rounded-[32px] bg-white/60 p-6 ring-1 ring-black/5 backdrop-blur">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brand-cream">
                  <Image
                    src="/products/gym-power-millet-mix.svg"
                    alt="Millets and peanuts visual"
                    fill
                    className="object-contain p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold text-neutral-900">Traditional Nutrition</div>
                    <div className="text-xs font-semibold text-neutral-600">Modern Health</div>
                  </div>
                  <Link href="/products" className="chip">
                    Explore products →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MotionSection className="container-prose mt-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">Shop by category</h2>
            <p className="mt-2 text-sm text-neutral-700">Targeted blends for fitness, kids growth, and senior wellness.</p>
          </div>
          <Link href="/products" className="hidden text-sm font-semibold text-brand-green hover:underline md:block">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link
            href="/products?category=fitness"
            className="rounded-2xl bg-white/75 p-6 ring-1 ring-black/5 backdrop-blur hover:shadow-soft"
          >
            <div className="flex items-center gap-2 text-sm font-extrabold text-brand-green">
              <Sparkles className="h-5 w-5" /> Fitness Nutrition
            </div>
            <p className="mt-2 text-sm text-neutral-700">Fuel performance with clean carbs, protein, and minerals.</p>
          </Link>
          <Link
            href="/products?category=kids"
            className="rounded-2xl bg-white/75 p-6 ring-1 ring-black/5 backdrop-blur hover:shadow-soft"
          >
            <div className="flex items-center gap-2 text-sm font-extrabold text-brand-orange">
              <Leaf className="h-5 w-5" /> Kids Growth Nutrition
            </div>
            <p className="mt-2 text-sm text-neutral-700">Delicious everyday nourishment for immunity and growth.</p>
          </Link>
          <Link
            href="/products?category=senior"
            className="rounded-2xl bg-white/75 p-6 ring-1 ring-black/5 backdrop-blur hover:shadow-soft"
          >
            <div className="flex items-center gap-2 text-sm font-extrabold text-brand-brown">
              <ShieldCheck className="h-5 w-5" /> Senior Wellness Nutrition
            </div>
            <p className="mt-2 text-sm text-neutral-700">Gentle blends supporting digestion, bones, and vitality.</p>
          </Link>
        </div>
      </MotionSection>

      <MotionSection className="container-prose mt-14">
        <h2 className="text-2xl font-black tracking-tight text-neutral-900">Featured products</h2>
        <p className="mt-2 text-sm text-neutral-700">Bestsellers crafted with traditional recipes and modern quality.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </MotionSection>

      <MotionSection className="container-prose mt-14">
        <h2 className="text-2xl font-black tracking-tight text-neutral-900">Why choose us</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { icon: Wheat, title: "100% Natural Ingredients", text: "Real millets, real peanuts—no fillers." },
            { icon: Leaf, title: "Traditional Village Recipes", text: "Inspired by homemade nutrition." },
            { icon: Sparkles, title: "High Nutrition Value", text: "Balanced macros and rich micronutrients." },
            { icon: ShieldCheck, title: "No Chemicals or Preservatives", text: "Clean-label blends you can trust." }
          ].map((x) => (
            <div key={x.title} className="rounded-2xl bg-white/70 p-5 ring-1 ring-black/5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-extrabold text-neutral-900">
                <x.icon className="h-5 w-5 text-brand-green" /> {x.title}
              </div>
              <p className="mt-2 text-sm text-neutral-700">{x.text}</p>
            </div>
          ))}
        </div>
      </MotionSection>

      <MotionSection className="container-prose mt-14 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-900">Testimonials</h2>
          <p className="mt-2 text-sm text-neutral-700">Real feedback from people who care about clean nutrition.</p>
          <div className="mt-6">
            <TestimonialsSlider />
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
          <h3 className="text-lg font-extrabold text-neutral-900">Newsletter</h3>
          <p className="mt-2 text-sm text-neutral-700">Get healthy recipes, new launches, and nutrition tips.</p>
          <NewsletterForm />
          <p className="mt-3 text-xs text-neutral-500">We respect your inbox. Unsubscribe anytime.</p>
        </div>
      </MotionSection>
    </div>
  );
}


