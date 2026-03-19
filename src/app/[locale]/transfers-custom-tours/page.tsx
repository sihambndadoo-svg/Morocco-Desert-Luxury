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
  return buildMetadata({ locale: resolved, title: 'Transfers and custom desert tours', description: 'Airport transfers, private transport, multi-day routes from Marrakech or Fes, and custom luxury desert planning.', path: 'transfers-custom-tours' });
}

export default async function TransfersCustomToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const experiences = (await fetchExperiences()).filter((item) => ['transfer', 'multiDay', 'photography', 'family', 'romantic'].includes(item.category));
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Transfers & custom tours" title="Arrival coordination, private transport, and tailored desert journeys" description="For premium travel, logistics matter as much as beauty. Book airport or private transfers, request custom itineraries, or plan a longer desert route from Marrakech or Fes." primary={{ href: `/${resolved}/booking`, label: 'Plan your itinerary' }} secondary={{ href: `/${resolved}/contact`, label: 'Discuss a custom route' }} />
      <section className="pt-16">
        <Reveal><SectionHeading eyebrow="Logistics and bespoke travel" title="Built for flexibility and owner-controlled planning" description="Use the booking form for one primary experience with additional services, or request a custom plan with detailed travel notes." /></Reveal>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((experience, index) => <Reveal key={experience.slug} delay={index * 0.04}><ExperienceCard experience={experience} locale={resolved} /></Reveal>)}
        </div>
      </section>
    </div>
  );
}
