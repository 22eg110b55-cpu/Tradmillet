import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/utils/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { AddToCartButton } from "@/components/products/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group rounded-2xl bg-white/75 p-4 ring-1 ring-black/5 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-brand-cream">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6 transition group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-neutral-900">{product.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{product.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-lg font-extrabold text-brand-brown">₹{product.price}</div>
            <div className="mt-1">
              <RatingStars value={product.rating} />
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-3">
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}


