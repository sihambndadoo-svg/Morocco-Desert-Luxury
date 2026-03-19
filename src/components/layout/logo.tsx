import Link from 'next/link';
import { cn } from '@/lib/utils';

function ErgChebbiMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn('h-10 w-10', className)}
      fill="none"
    >
      <circle cx="42" cy="18" r="7" className="fill-amber-300/90 dark:fill-amber-200/80" />
      <path
        d="M10 40C18 30 28 27 39 30C45 31 50 34 54 39"
        className="stroke-stone-900 dark:stroke-stone-100"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M8 48C18 41 30 40 42 43C47 44 52 46 56 49"
        className="stroke-amber-700 dark:stroke-amber-300"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M20 27L24 22L28 27"
        className="stroke-stone-900 dark:stroke-stone-100"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 28H29"
        className="stroke-stone-900 dark:stroke-stone-100"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M24 22V35"
        className="stroke-stone-900 dark:stroke-stone-100"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ href = '/', compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href as any} className="inline-flex items-center gap-3" aria-label="Morocco Desert Luxury home">
      <span className="rounded-full border border-amber-200/80 bg-white/90 p-2 shadow-sm dark:border-white/10 dark:bg-stone-950/70">
        <ErgChebbiMark />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-serif text-xl text-stone-900 dark:text-white', compact && 'text-lg')}>
          Morocco Desert
        </span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500 dark:text-stone-300">
          Luxury
        </span>
      </span>
    </Link>
  );
}
