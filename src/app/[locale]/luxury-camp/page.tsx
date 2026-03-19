export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { buildMetadata } from '@/lib/seo/metadata';
import { fetchExperiences } from '@/lib/services/experiences';
import { resolveLocale } from '@/lib/i18n';
import { SectionHeading } from '@/components/marketing/section-heading';
import { ExperienceCard } from '@/components/marketing/experience-card';
import { PageHero } from '@/components/marketing/page-hero';
import { Reveal } from '@/components/marketing/reveal';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({ locale: resolved, title: 'Luxury desert camp stays', description: 'Browse private luxury desert camp nights, romantic stays, and family-friendly camp experiences in Merzouga.', path: 'luxury-camp' });
}

export default async function LuxuryCampPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const experiences = await fetchExperiences({ category: 'camp' });
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Luxury camp" title="Elegant desert camp nights in the dunes of Erg Chebbi" description="Choose from one-night escapes, longer desert stays, romantic arrangements, and family-friendly camp experiences with refined comfort and warm hospitality." primary={{ href: `/${resolved}/booking`, label: 'Reserve your camp stay' }} secondary={{ href: `/${resolved}/arrival-transfer-info`, label: 'See arrival information' }} />
      <section className="pt-16">
        <Reveal><SectionHeading eyebrow="Camp collection" title="Stay under the stars with operational clarity" description="Live date selection, auto-calculated nights, add-on support, and owner follow-up help turn a beautiful stay into a reliable booking experience." /></Reveal>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((experience, index) => <Reveal key={experience.slug} delay={index * 0.04}><ExperienceCard experience={experience} locale={resolved} /></Reveal>)}
        </div>
      </section>
    </div>
  );
}
