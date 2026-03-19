export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check, MapPin, ShieldCheck, Users } from 'lucide-react';
import { PageHero } from '@/components/marketing/page-hero';
import { GalleryGrid } from '@/components/marketing/gallery-grid';
import { Reveal } from '@/components/marketing/reveal';
import { StructuredData } from '@/components/marketing/structured-data';
import { buildMetadata } from '@/lib/seo/metadata';
import { fetchExperienceBySlug } from '@/lib/services/experiences';
import { resolveLocale } from '@/lib/i18n';
import { formatCurrency, getLocalizedText } from '@/lib/utils';
import type { Experience } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const resolved = resolveLocale(locale);
  const experience = await fetchExperienceBySlug(slug);
  if (!experience) {
    return buildMetadata({ locale: resolved, title: 'Experience', description: 'Luxury desert experience', path: `experiences/${slug}` });
  }
  return buildMetadata({
    locale: resolved,
    title: getLocalizedText(experience.content.seoTitle ?? experience.content.title, resolved),
    description: getLocalizedText(experience.content.seoDescription ?? experience.content.shortDescription, resolved),
    path: `experiences/${slug}`,
    image: experience.heroMedia.url,
  });
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const resolved = resolveLocale(locale);
  const experience = await fetchExperienceBySlug(slug);
  if (!experience) {
    notFound();
  }
  const currentExperience = experience as Experience;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: getLocalizedText(currentExperience.content.title, resolved),
    description: getLocalizedText(currentExperience.content.longDescription, resolved),
    image: currentExperience.gallery.map((item) => item.url),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: currentExperience.startingPrice,
      availability: 'https://schema.org/InStock',
      url: `/${resolved}/experiences/${currentExperience.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero
        eyebrow={currentExperience.category}
        title={getLocalizedText(currentExperience.content.title, resolved)}
        description={getLocalizedText(currentExperience.content.shortDescription, resolved)}
        primary={{ href: `/${resolved}/booking?experience=${currentExperience.slug}`, label: 'Book this experience' }}
        secondary={{ href: `/${resolved}/contact`, label: 'Ask a question' }}
      />

      <section className="grid gap-8 pt-16 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <div className="space-y-8 rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60">
            <div className="prose-ecl">
              <p>{getLocalizedText(currentExperience.content.longDescription, resolved)}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-black/5 bg-stone-50 p-5 dark:border-white/10 dark:bg-stone-900/60">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-white"><Users className="h-4 w-4 text-amber-700 dark:text-amber-300" /> Ideal for</div>
                <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">{getLocalizedText(currentExperience.content.idealFor, resolved)}</p>
              </div>
              <div className="rounded-[1.5rem] border border-black/5 bg-stone-50 p-5 dark:border-white/10 dark:bg-stone-900/60">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-white"><MapPin className="h-4 w-4 text-amber-700 dark:text-amber-300" /> Meeting point</div>
                <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">{getLocalizedText(currentExperience.content.meetingPoint, resolved)}</p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h2 className="font-serif text-2xl text-stone-900 dark:text-white">Included</h2>
                <ul className="mt-4 grid gap-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                  {currentExperience.content.included.map((item, index) => <li key={index} className="inline-flex gap-3"><Check className="mt-1 h-4 w-4 text-amber-700 dark:text-amber-300" /> {getLocalizedText(item, resolved)}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-stone-900 dark:text-white">Not included</h2>
                <ul className="mt-4 grid gap-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                  {currentExperience.content.exclusions.map((item, index) => <li key={index} className="inline-flex gap-3"><ShieldCheck className="mt-1 h-4 w-4 text-stone-400" /> {getLocalizedText(item, resolved)}</li>)}
                </ul>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-stone-900 dark:text-white">Highlights</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {currentExperience.content.highlights.map((item, index) => (
                  <div key={index} className="rounded-[1.5rem] border border-black/5 bg-stone-50 p-5 text-sm leading-7 text-stone-700 dark:border-white/10 dark:bg-stone-900/60 dark:text-stone-200">
                    {getLocalizedText(item, resolved)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-6 rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60 lg:sticky lg:top-28">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-700 dark:text-amber-300">Starting from</p>
              <p className="mt-2 font-serif text-5xl text-stone-900 dark:text-white">{formatCurrency(currentExperience.startingPrice, 'EUR', resolved)}</p>
              <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">{currentExperience.durationLabel} · Private upgrade available where relevant.</p>
            </div>
            <div className="rounded-[1.5rem] border border-black/5 bg-stone-50 p-5 dark:border-white/10 dark:bg-stone-900/60">
              <h3 className="font-semibold text-stone-900 dark:text-white">Possible add-ons</h3>
              <div className="mt-4 grid gap-3 text-sm text-stone-600 dark:text-stone-300">
                {currentExperience.addOns.map((item) => (
                  <div key={item.key} className="flex items-start justify-between gap-3">
                    <span>{getLocalizedText(item.label, resolved)}</span>
                    <span className="font-semibold text-stone-900 dark:text-white">{formatCurrency(item.price, 'EUR', resolved)}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href={`/${resolved}/booking?experience=${currentExperience.slug}` as any} className="ecl-primary-button w-full">Reserve this experience</Link>
            <Link href={`/${resolved}/contact` as any} className="ecl-secondary-button w-full">Need tailored advice?</Link>
          </div>
        </Reveal>
      </section>

      <section className="pt-16">
        <Reveal>
          <GalleryGrid items={currentExperience.gallery.map((item) => ({ url: item.url, fallbackUrl: item.fallbackUrl, alt: getLocalizedText(item.alt, resolved) }))} />
        </Reveal>
      </section>
      <StructuredData data={jsonLd} />
    </div>
  );
}
