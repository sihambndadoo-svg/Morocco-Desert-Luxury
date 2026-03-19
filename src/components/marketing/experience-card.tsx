import Link from 'next/link';
import { ArrowRight, Clock3 } from 'lucide-react';
import { SafeImage } from '@/components/marketing/safe-image';
import { Experience, Locale } from '@/types';
import { formatCurrency, getLocalizedText } from '@/lib/utils';

export function ExperienceCard({ experience, locale }: { experience: Experience; locale: Locale }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_-28px_rgba(37,29,18,0.25)] dark:border-white/10 dark:bg-stone-950/70">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage
          src={experience.heroMedia.url}
          fallbackSrc={experience.heroMedia.fallbackUrl}
          alt={getLocalizedText(experience.heroMedia.alt, locale)}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-900 backdrop-blur dark:bg-stone-950/80 dark:text-white">
          {experience.adminBadge || experience.category}
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl text-stone-900 dark:text-white">
              {getLocalizedText(experience.content.title, locale)}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
              {getLocalizedText(experience.content.shortDescription, locale)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-black/5 pt-4 text-sm text-stone-600 dark:border-white/10 dark:text-stone-300">
          <div className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" /> {experience.durationLabel}</div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">Starting from</div>
            <div className="text-base font-semibold text-stone-900 dark:text-white">
              {formatCurrency(experience.startingPrice, 'EUR', locale)}
            </div>
          </div>
        </div>
        <Link href={`/${locale}/experiences/${experience.slug}` as any} className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 transition hover:text-amber-700 dark:text-white dark:hover:text-amber-300">
          Discover this experience
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
