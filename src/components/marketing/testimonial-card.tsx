import { Star } from 'lucide-react';

export function TestimonialCard({
  quote,
  name,
  country,
  rating,
}: {
  quote: string;
  name: string;
  country: string;
  rating: number;
}) {
  return (
    <article className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/70">
      <div className="mb-5 flex items-center gap-1 text-amber-500">
        {Array.from({ length: rating }, (_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="text-base leading-8 text-stone-700 dark:text-stone-200">“{quote}”</p>
      <div className="mt-6 border-t border-black/5 pt-4 dark:border-white/10">
        <p className="font-semibold text-stone-900 dark:text-white">{name}</p>
        <p className="text-sm text-stone-500 dark:text-stone-400">{country}</p>
      </div>
    </article>
  );
}
