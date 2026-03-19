import { PageHero } from '@/components/marketing/page-hero';
import { buildMetadata } from '@/lib/seo/metadata';
import { resolveLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({ locale: resolved, title: 'Policies', description: 'Read booking, cancellation, arrival, and payment guidance for Morocco Desert Luxury reservations.', path: 'policies' });
}

export default async function PoliciesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const sections = [
    { title: 'Booking requests', body: 'Submitting the form creates a real booking request, not an instant guaranteed reservation unless auto-confirmation is enabled by the owner. Each request is reviewed against availability, date status, and operational capacity.' },
    { title: 'Pricing', body: 'Public starting prices are visible on the website. Final estimates can change if the owner has applied date-specific pricing rules, private upgrades, add-ons, transfers, or special event surcharges. The booking form always saves the current estimate shown at the time of submission.' },
    { title: 'Payments', body: 'Bookings can be accepted even if online payment gateways are not yet connected. Payment status may remain pending, deposit requested, deposit paid, fully paid, or refunded. Payment instructions can be shared later by email.' },
    { title: 'Cancellation guidance', body: 'If plans change, contact the owner as early as possible. Cancellation outcomes depend on timing, seasonality, deposits already paid, and third-party logistics already secured on your behalf.' },
    { title: 'Arrival and timing', body: 'Meeting points, transfer details, and final timing are confirmed after a request is accepted. This is especially important for camp stays, sunrise departures, and private multi-service itineraries.' },
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Policies" title="Clear booking and arrival guidance" description="A premium travel product should also be clear, fair, and practical. These core policies support smooth planning and better guest communication." primary={{ href: `/${resolved}/booking`, label: 'Start booking' }} />
      <section className="grid gap-5 pt-16">
        {sections.map((section) => (
          <article key={section.title} className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">{section.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
