import { PageHero } from '@/components/marketing/page-hero';
import { buildMetadata } from '@/lib/seo/metadata';
import { resolveLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({ locale: resolved, title: 'Arrival and transfer information', description: 'Understand meeting points, transfer coordination, arrival timing, and what to bring for a Merzouga desert stay.', path: 'arrival-transfer-info' });
}

export default async function ArrivalTransferInfoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Arrival & transfer information" title="Practical guidance before you reach the dunes" description="Clear arrival details reduce stress and make premium service feel truly premium. Use this page as the starting point before your booking is finalized with the owner." primary={{ href: `/${resolved}/booking`, label: 'Book with transfer options' }} />
      <section className="grid gap-6 pt-16 md:grid-cols-2">
        {[
          { title: 'Meeting and arrival timing', body: 'For camp stays and certain sunset departures, arrival timing matters. Final meeting instructions are confirmed after the booking request is reviewed.' },
          { title: 'Transfers', body: 'Airport transfers, private transfers, and multi-day route planning can be requested inside the booking form. Transfer services can also be combined with camp and activity bookings.' },
          { title: 'What to bring', body: 'Pack layers for day and evening temperature changes, comfortable walking shoes, a scarf for wind, sun protection, and any personal medication. For photographers, bring lens cloths and backup batteries.' },
          { title: 'Families and children', body: 'Let us know the ages of children and any comfort or dietary needs. The system stores these notes so they remain visible to the owner during planning and follow-up.' },
          { title: 'Dietary requests', body: 'Use the special request field for vegetarian, vegan, allergy, or celebratory dining notes. These become part of the booking record and timeline.' },
          { title: 'Communication', body: 'Email is the formal booking channel, while WhatsApp is useful for fast coordination once a booking reference exists.' },
        ].map((item) => (
          <article key={item.title} className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
            <h2 className="font-serif text-2xl text-stone-900 dark:text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
