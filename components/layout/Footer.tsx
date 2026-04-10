import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white/60 backdrop-blur">
      <div className="container-prose grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="text-lg font-extrabold text-neutral-900">TradMillet Foods</div>
          <p className="mt-2 text-sm text-neutral-700">
            Traditional Nutrition. Modern Health. Premium healthy millet and peanut powders inspired by village recipes—clean, natural,
            and delicious.
          </p>
        </div>
        <div>
          <div className="text-sm font-extrabold text-neutral-900">Explore</div>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/products" className="text-neutral-700 hover:text-neutral-900">
              Products
            </Link>
            <Link href="/recipes" className="text-neutral-700 hover:text-neutral-900">
              Recipes
            </Link>
            <Link href="/quiz" className="text-neutral-700 hover:text-neutral-900">
              Health Quiz
            </Link>
            <Link href="/blog" className="text-neutral-700 hover:text-neutral-900">
              Blog
            </Link>
          </div>
        </div>
        <div>
          <div className="text-sm font-extrabold text-neutral-900">Contact</div>
          <div className="mt-3 grid gap-2 text-sm text-neutral-700">
            <div>Email: support@tradmilletfoods.com</div>
            <div>Phone: +91 90000 00000</div>
            <div>WhatsApp: +91 90000 00000</div>
          </div>
        </div>
      </div>
      <div className="border-t border-black/5 py-6 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} TradMillet Foods. All rights reserved.
      </div>
    </footer>
  );
}


