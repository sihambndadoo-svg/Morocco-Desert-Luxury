import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PageHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  compact?: boolean;
}) {
  return (
    <section className={cn('relative overflow-hidden rounded-[2rem] border border-black/5 bg-gradient-to-br from-[#fffef9] via-[#f7efe3] to-[#f2dfbf] px-6 py-12 shadow-[0_24px_60px_-28px_rgba(87,66,30,0.25)] dark:border-white/10 dark:from-[#1e1912] dark:via-[#16120d] dark:to-[#120f0b] md:px-10', compact ? 'py-10' : 'py-14 md:py-16')}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(212,160,51,0.12),transparent_35%)]" />
      <div className="relative max-w-3xl space-y-6">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700 dark:text-amber-300">{eyebrow}</p> : null}
        <h1 className="font-serif text-4xl leading-tight text-stone-900 dark:text-white md:text-6xl">{title}</h1>
        <p className="max-w-2xl text-base leading-8 text-stone-600 dark:text-stone-300 md:text-lg">{description}</p>
        {(primary || secondary) ? (
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {primary ? (
              <Link href={primary.href as any} className="ecl-primary-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition">
                {primary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            {secondary ? (
              <Link href={secondary.href as any} className="ecl-secondary-button">
                {secondary.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
