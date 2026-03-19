export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { PageHero } from '@/components/marketing/page-hero';
import { SectionHeading } from '@/components/marketing/section-heading';
import { ExperienceCard } from '@/components/marketing/experience-card';
import { Reveal } from '@/components/marketing/reveal';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPublicData } from '@/lib/public-data';
import { resolveLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({
    locale: resolved,
    title: 'Luxury desert experiences in Merzouga',
    description: 'Explore private luxury camp stays, camel trekking, quad tours, 4x4 journeys, transfers, and bespoke Sahara itineraries with Morocco Desert Luxury.',
    path: 'experiences',
  });
}

export default async function ExperiencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const { experiences } = await getPublicData();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero
        eyebrow="Experience collection"
        title="Luxury Sahara experiences built for real premium travel"
        description="Browse the full collection of stays, rides, tours, and tailored logistics. Every experience can be booked on-site and managed from the owner dashboard."
        primary={{ href: `/${resolved}/booking`, label: 'Start a booking request' }}
        secondary={{ href: `/${resolved}/contact`, label: 'Request a custom itinerary' }}
      />

      <section className="pt-16">
        <Reveal>
          <SectionHeading
            eyebrow="All offers"
            title="From one-night camp stays to multi-day private journeys"
            description="Choose a primary experience, then layer in transfers, add-ons, private upgrades, and custom requests inside the booking flow."
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((experience, index) => (
            <Reveal key={experience.slug} delay={index * 0.03}>
              <ExperienceCard experience={experience} locale={resolved} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] border border-black/5 bg-white p-8 dark:border-white/10 dark:bg-stone-950/60">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-serif text-3xl text-stone-900 dark:text-white">Need a multi-service arrangement?</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600 dark:text-stone-300">
              Combine camp nights, camel rides, quad touring, private 4x4 exploration, airport transfers, and special occasions in one booking request with a single reference number.
            </p>
          </div>
          <Link href={`/${resolved}/booking` as any} className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white dark:bg-amber-300 dark:text-stone-950">
            Build your itinerary
          </Link>
        </div>
      </section>
    </div>
  );
}
