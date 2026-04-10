import { Star } from "lucide-react";

export function RatingStars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const total = 5;
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            className={filled ? "h-4 w-4 fill-brand-orange text-brand-orange" : "h-4 w-4 text-neutral-300"}
          />
        );
      })}
      <span className="ml-1 text-xs font-semibold text-neutral-600">{value.toFixed(1)}</span>
    </div>
  );
}


