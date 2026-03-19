export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { BookingForm } from '@/components/forms/booking-form';
import { PageHero } from '@/components/marketing/page-hero';
import { buildMetadata } from '@/lib/seo/metadata';
import { fetchExperiences } from '@/lib/services/experiences';
import { resolveLocale } from '@/lib/i18n';
import { getPaymentSettings } from '@/lib/services/content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({ locale: resolved, title: 'Booking', description: 'Request a real luxury desert booking online with live price estimation, date selection, and additional services.', path: 'booking' });
}

export default async function BookingPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const query = await searchParams;
  const [experiences, paymentSettings] = await Promise.all([fetchExperiences(), getPaymentSettings()]);
  const defaultExperience = typeof query.experience === 'string' ? query.experience : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Booking" title="Reserve your desert experience with real dates, real pricing, and real follow-up" description="This booking flow supports one primary experience with additional services, add-ons, private options, live estimates, and direct owner notifications." compact />
      <section className="pt-12">
        <BookingForm locale={resolved} experiences={experiences} paymentSettings={paymentSettings} defaultExperienceSlug={defaultExperience} />
      </section>
    </div>
  );
}
