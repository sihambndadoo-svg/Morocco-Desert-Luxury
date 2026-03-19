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
  return buildMetadata({ locale: resolved, title: 'Private 4x4 desert tours', description: 'Private 4x4 Erg Chebbi explorations, full-day desert journeys, and premium Sahara discovery by vehicle.', path: '4x4-tours' });
}

export default async function FourByFourPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const experiences = await fetchExperiences({ category: 'fourByFour' });
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="4x4 tours" title="Private vehicle touring through the landscapes around Erg Chebbi" description="Ideal for travellers who want comfort, flexibility, and deeper access to viewpoints, nomadic culture, and desert terrain while maintaining premium private service standards." primary={{ href: `/${resolved}/booking`, label: 'Reserve a 4x4 journey' }} secondary={{ href: `/${resolved}/arrival-transfer-info`, label: 'Read travel logistics' }} />
      <section className="pt-16">
        <Reveal><SectionHeading eyebrow="4x4 experiences" title="Refined exploration with movement and comfort" description="Use 4x4 touring as a standalone experience or combine it with camp nights, transfers, and custom itineraries." /></Reveal>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((experience, index) => <Reveal key={experience.slug} delay={index * 0.04}><ExperienceCard experience={experience} locale={resolved} /></Reveal>)}
        </div>
      </section>
    </div>
  );
}
