import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/components/marketing/page-hero';
import { buildMetadata } from '@/lib/seo/metadata';
import { resolveLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({ locale: resolved, title: 'Thank you for your booking request', description: 'Your booking request has been received by Morocco Desert Luxury.', path: 'booking/thank-you' });
}

export default async function BookingThankYouPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const query = await searchParams;
  const reference = typeof query.ref === 'string' ? query.ref : null;
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Thank you" title="Your booking request has been received" description="We have sent the request to the owner dashboard and, where email is configured, an acknowledgement message to the customer email address you entered." compact />
      <section className="mt-12 rounded-[2rem] border border-black/5 bg-white p-8 text-center shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h2 className="mt-5 font-serif text-3xl text-stone-900 dark:text-white">Booking request submitted successfully</h2>
        {reference ? <p className="mt-3 text-lg font-semibold text-amber-700 dark:text-amber-300">Reference: {reference}</p> : null}
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-300">Use this reference when you reply by email or WhatsApp. The owner dashboard can confirm, decline, or adjust the booking, and status updates can trigger customer emails.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={`/${resolved}/experiences` as any} className="inline-flex rounded-full border border-black/10 px-6 py-3 text-sm font-semibold dark:border-white/10">Explore more experiences</Link>
          <Link href={`/${resolved}/contact` as any} className="inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white dark:bg-amber-300 dark:text-stone-950">Contact the owner</Link>
        </div>
      </section>
    </div>
  );
}
