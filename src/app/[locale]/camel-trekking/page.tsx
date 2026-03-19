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
  return buildMetadata({ locale: resolved, title: 'Camel trekking in Merzouga', description: 'Sunset and sunrise camel rides, classic camel trekking, and elegant Sahara moments designed for couples, families, and private travellers.', path: 'camel-trekking' });
}

export default async function CamelTrekkingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const experiences = await fetchExperiences({ category: 'camel' });
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Camel trekking" title="Camel rides timed for golden light, silence, and unforgettable dune views" description="From short sunrise or sunset departures to longer scenic trekking, each experience is positioned as a premium, human-scale Sahara moment rather than a rushed tourist ride." primary={{ href: `/${resolved}/booking`, label: 'Book a camel experience' }} secondary={{ href: `/${resolved}/gallery`, label: 'See the atmosphere' }} />
      <section className="pt-16">
        <Reveal><SectionHeading eyebrow="Camel collection" title="Soft-paced desert experiences" description="Ideal for first-time Sahara travellers, couples, photographers, and guests pairing a ride with a luxury camp night." /></Reveal>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((experience, index) => <Reveal key={experience.slug} delay={index * 0.04}><ExperienceCard experience={experience} locale={resolved} /></Reveal>)}
        </div>
      </section>
    </div>
  );
}
