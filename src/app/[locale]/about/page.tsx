import Link from 'next/link';
import { HeartHandshake, MapPinned, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/marketing/page-hero';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPublicData } from '@/lib/public-data';
import { resolveLocale } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({ locale: resolved, title: 'About Morocco Desert Luxury', description: 'Learn about the Merzouga-based team behind Morocco Desert Luxury and the hospitality philosophy guiding every booking.', path: 'about' });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const { copy } = await getPublicData();
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="About us" title="Merzouga-based hospitality with a private, premium approach" description="Morocco Desert Luxury is built around warm human hosting, refined desert comfort, and clear operational follow-through. Guests come for the dunes, but they remember how the entire journey was handled." primary={{ href: `/${resolved}/booking`, label: 'Book with confidence' }} secondary={{ href: `/${resolved}/contact`, label: 'Contact the owner' }} />

      <section className="grid gap-6 pt-16 lg:grid-cols-3">
        {[
          { icon: MapPinned, title: 'Local knowledge', description: 'Based in Merzouga, with real proximity to Erg Chebbi, local meeting points, transfer coordination, and desert operations.' },
          { icon: HeartHandshake, title: 'Warm hospitality', description: 'A luxury stay should still feel human. The brand voice, guest care, and follow-up are intentionally warm rather than transactional.' },
          { icon: ShieldCheck, title: 'Operational trust', description: 'Bookings, dates, availability, status changes, pricing rules, and customer communication are managed in one system to reduce mistakes.' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60">
              <Icon className="h-9 w-9 text-amber-700 dark:text-amber-300" />
              <h2 className="mt-5 font-serif text-2xl text-stone-900 dark:text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">{item.description}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white p-8 dark:border-white/10 dark:bg-stone-950/60">
          <h2 className="font-serif text-3xl text-stone-900 dark:text-white">Our hospitality philosophy</h2>
          <div className="prose-ecl mt-6">
            <p>{getLocalizedText(copy.tagline, resolved)}</p>
            <p>
              We believe luxury in the Sahara should never feel cold or generic. It should feel elegant, intentional,
              welcoming, and deeply respectful of place. That means polished camp comfort, real logistical clarity,
              and itineraries shaped around the traveller rather than forcing the traveller into a rigid template.
            </p>
            <p>
              Whether you are arriving from Marrakech, Fes, Errachidia, or another point in Morocco, the goal is the
              same: create a smooth booking experience, a memorable desert stay, and practical next steps from the first
              inquiry to the last departure transfer.
            </p>
          </div>
        </div>
        <div className="rounded-[2rem] border border-black/5 bg-gradient-to-br from-[#fffef9] to-[#f2dfbf] p-8 dark:border-white/10 dark:from-stone-950 dark:to-stone-900">
          <h2 className="font-serif text-3xl text-stone-900 dark:text-white">Who we host best</h2>
          <div className="mt-6 grid gap-4">
            {['Couples seeking a romantic and cinematic camp stay.', 'Families wanting comfort, calm logistics, and child-aware planning.', 'Private travellers wanting a tailored Sahara journey rather than a large group tour.', 'Photographers and content-led travellers chasing the best light and atmosphere.'].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-black/5 bg-white/80 p-5 text-sm leading-7 text-stone-700 dark:border-white/10 dark:bg-black/20 dark:text-stone-200">{item}</div>
            ))}
          </div>
          <Link href={`/${resolved}/contact` as any} className="mt-6 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white dark:bg-amber-300 dark:text-stone-950">
            Discuss your travel style
          </Link>
        </div>
      </section>
    </div>
  );
}
