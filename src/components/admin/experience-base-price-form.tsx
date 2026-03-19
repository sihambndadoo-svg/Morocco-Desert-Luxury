'use client';

import { useMemo, useState, useTransition } from 'react';
import { ImagePlus, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function ExperienceBasePriceForm({
  experience,
}: {
  experience: {
    slug: string;
    category: string;
    startingPrice: number;
    baseAdultPrice: number;
    baseChildPrice: number;
    privateSurcharge: number;
    transferPrice: number;
    featured: boolean;
    active: boolean;
    showOnHome?: boolean;
    showOnBookingPrimary?: boolean;
    showOnBookingExtras?: boolean;
    shortListRank?: number;
    adminBadge?: string | null;
    cardLabel?: string | null;
    heroMedia: { url: string; fallbackUrl?: string };
  };
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    slug: experience.slug,
    category: experience.category,
    starting_price: experience.startingPrice,
    base_adult_price: experience.baseAdultPrice,
    base_child_price: experience.baseChildPrice,
    private_surcharge: experience.privateSurcharge,
    transfer_price: experience.transferPrice,
    is_featured: experience.featured,
    is_active: experience.active,
    show_on_home: experience.showOnHome ?? false,
    show_on_booking_primary: experience.showOnBookingPrimary ?? false,
    show_on_booking_extras: experience.showOnBookingExtras ?? false,
    short_list_rank: experience.shortListRank ?? 999,
    admin_badge: experience.adminBadge ?? '',
    card_label: experience.cardLabel ?? '',
    featured_media_url: experience.heroMedia.url,
    featured_media_fallback_url: experience.heroMedia.fallbackUrl ?? '',
  });

  const isCore = useMemo(
    () => form.show_on_home || form.show_on_booking_primary || form.show_on_booking_extras,
    [form.show_on_booking_extras, form.show_on_booking_primary, form.show_on_home],
  );

  async function onSubmit() {
    setMessage(null);
    setError(null);
    try {
      const response = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'experience_base', ...form }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not save experience pricing.');
      setMessage('Saved to the live website.');
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save experience pricing.');
    }
  }

  return (
    <div className="space-y-5 rounded-[1.6rem] border border-black/5 bg-white p-5 shadow-[0_18px_48px_-34px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-[#15110d]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-stone-950 dark:text-white">{experience.slug}</h3>
            {form.admin_badge ? (
              <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-900 dark:bg-amber-400/15 dark:text-amber-200">
                {form.admin_badge}
              </span>
            ) : null}
            {!isCore ? (
              <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 dark:bg-white/10 dark:text-stone-200">
                Hidden from guests
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            Control public price, visibility, shortlist ranking, and media for this experience.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['starting_price', 'Starting price'],
          ['base_adult_price', 'Adult price'],
          ['base_child_price', 'Child price'],
          ['private_surcharge', 'Private surcharge'],
          ['transfer_price', 'Transfer price'],
        ].map(([key, label]) => (
          <label key={key} className="grid gap-2 text-sm font-medium text-stone-800 dark:text-stone-100">
            {label}
            <input
              type="number"
              value={form[key as keyof typeof form] as number}
              onChange={(event) =>
                setForm((current) => ({ ...current, [key]: Number(event.target.value || 0) }))
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-[#1c1612] dark:text-white"
            />
          </label>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-stone-800 dark:text-stone-100">
          Shortlist rank
          <input
            type="number"
            value={form.short_list_rank}
            onChange={(event) => setForm((current) => ({ ...current, short_list_rank: Number(event.target.value || 0) }))}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-[#1c1612] dark:text-white"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-stone-800 dark:text-stone-100">
          Card badge
          <input
            value={form.admin_badge}
            onChange={(event) => setForm((current) => ({ ...current, admin_badge: event.target.value }))}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-[#1c1612] dark:text-white"
            placeholder="Featured · Core · Romantic"
          />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-stone-800 dark:text-stone-100">
          Primary image URL
          <input
            value={form.featured_media_url}
            onChange={(event) => setForm((current) => ({ ...current, featured_media_url: event.target.value }))}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-[#1c1612] dark:text-white"
            placeholder="https://..."
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-stone-800 dark:text-stone-100">
          Fallback image URL
          <input
            value={form.featured_media_fallback_url}
            onChange={(event) =>
              setForm((current) => ({ ...current, featured_media_fallback_url: event.target.value }))
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-[#1c1612] dark:text-white"
            placeholder="/fallback-camp.svg"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[
          ['is_featured', 'Featured in dashboard'],
          ['is_active', 'Active'],
          ['show_on_home', 'Show on homepage'],
          ['show_on_booking_primary', 'Show in main booking'],
          ['show_on_booking_extras', 'Show in extra services'],
        ].map(([key, label]) => (
          <label key={key} className="inline-flex items-center gap-3 rounded-2xl border border-black/5 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 dark:border-white/10 dark:bg-[#1b1511] dark:text-stone-100">
            <input
              type="checkbox"
              checked={Boolean(form[key as keyof typeof form])}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.checked }))}
              className="h-4 w-4 rounded border-stone-300 text-amber-700 focus:ring-amber-500"
            />
            {label}
          </label>
        ))}
      </div>

      {form.featured_media_url ? (
        <div className="rounded-[1.35rem] border border-black/5 bg-stone-50 p-3 dark:border-white/10 dark:bg-[#120f0c]">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-300">
            <ImagePlus className="h-4 w-4" /> Live card image preview
          </div>
          <div className="overflow-hidden rounded-[1.2rem] border border-black/5 dark:border-white/10">
            <img src={form.featured_media_url} alt={experience.slug} className="h-36 w-full object-cover" />
          </div>
        </div>
      ) : null}

      {(message || error) ? (
        <p className={cn('text-sm', error ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300')}>
          {error ?? message}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-26px_rgba(18,15,12,0.6)] transition hover:bg-stone-800 disabled:opacity-70 dark:bg-[#f0d7a6] dark:text-stone-950 dark:hover:bg-[#f6dfb4]"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        Save live changes
      </button>
    </div>
  );
}
