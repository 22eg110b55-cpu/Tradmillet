import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Our story: traditional Indian millet nutrition for modern lifestyles—natural ingredients without chemicals."
};

export default function AboutPage() {
  return (
    <div className="container-prose py-10">
      <h1 className="text-3xl font-black tracking-tight text-neutral-900">About TradMillet Foods</h1>
      <p className="mt-4 text-neutral-700">
        TradMillet Foods brings traditional Indian millet nutrition to modern lifestyles using natural ingredients without chemicals or
        preservatives. Our blends are inspired by village recipes—simple, wholesome, and crafted for today’s busy routines.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
          <div className="text-lg font-extrabold text-neutral-900">Mission</div>
          <p className="mt-2 text-sm text-neutral-700">
            Make clean, traditional nutrition effortless—so every family can feel energetic, strong, and healthy every day.
          </p>
        </div>
        <div className="rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
          <div className="text-lg font-extrabold text-neutral-900">Vision</div>
          <p className="mt-2 text-sm text-neutral-700">
            Bring millets back to the center of modern health—premium, trusted, and loved across generations.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur">
        <div className="text-lg font-extrabold text-neutral-900">What makes us different</div>
        <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700">
          <li>Traditional recipes, modern quality checks</li>
          <li>Clean-label ingredients you can pronounce</li>
          <li>Targeted blends for gym, kids, and seniors</li>
          <li>Delicious taste—easy to add to your routine</li>
        </ul>
      </div>
    </div>
  );
}


