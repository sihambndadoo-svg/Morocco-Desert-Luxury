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
  return buildMetadata({ locale: resolved, title: 'Quad and ATV tours', description: 'Private and premium quad rides across the dunes with owner-controlled capacity, pricing, and date availability.', path: 'quad-atv' });
}

export default async function QuadAtvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const experiences = await fetchExperiences({ category: 'quad' });
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Quad / ATV" title="Premium dune adventure with a strong operational back-end" description="Reserve one-hour or longer quad rides and manage daily capacity, blackout dates, and pricing from the same system used to receive the booking request." primary={{ href: `/${resolved}/booking`, label: 'Reserve a quad ride' }} secondary={{ href: `/${resolved}/contact`, label: 'Ask about combined packages' }} />
      <section className="pt-16">
        <Reveal><SectionHeading eyebrow="Quad tours" title="Adventure with real availability control" description="Designed for couples, friends, families with older children, and travellers adding a faster-paced desert activity to their stay." /></Reveal>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((experience, index) => <Reveal key={experience.slug} delay={index * 0.04}><ExperienceCard experience={experience} locale={resolved} /></Reveal>)}
        </div>
      </section>
    </div>
  );
}
