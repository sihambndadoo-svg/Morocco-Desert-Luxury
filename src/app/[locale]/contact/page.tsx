import { MapPin, MessageCircle, Phone, Ticket } from 'lucide-react';
import { ContactForm } from '@/components/forms/contact-form';
import { PageHero } from '@/components/marketing/page-hero';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPublicData } from '@/lib/public-data';
import { resolveLocale } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';
import { siteConfig } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({ locale: resolved, title: 'Contact', description: 'Contact Morocco Desert Luxury about bookings, private desert tours, transfers, arrival planning, or custom itineraries.', path: 'contact' });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const { copy } = await getPublicData();
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Contact" title="Ask about dates, routes, premium stays, or a tailored Sahara plan" description={getLocalizedText(copy.contactIntro, resolved)} primary={{ href: `/${resolved}/booking`, label: 'Go to booking' }} secondary={{ href: `https://wa.me/212691999897`, label: 'WhatsApp support' }} />
      <section className="grid gap-8 pt-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5 rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60">
          <h2 className="font-serif text-3xl text-stone-900 dark:text-white">Direct contact details</h2>
          <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">WhatsApp is best for quick coordination after a booking request, but the website form remains the main place to submit real reservations.</p>
          <div className="grid gap-4 text-sm text-stone-700 dark:text-stone-200">
            <a className="inline-flex items-start gap-3 rounded-[1.5rem] border border-black/5 bg-stone-50 px-5 py-4 dark:border-white/10 dark:bg-stone-900/60" href={`mailto:${siteConfig.ownerEmail}`}><Ticket className="mt-1 h-4 w-4 text-amber-700 dark:text-amber-300" /> <span><strong>Email</strong><br />{siteConfig.ownerEmail}</span></a>
            <a className="inline-flex items-start gap-3 rounded-[1.5rem] border border-black/5 bg-stone-50 px-5 py-4 dark:border-white/10 dark:bg-stone-900/60" href={`tel:${siteConfig.phone}`}><Phone className="mt-1 h-4 w-4 text-amber-700 dark:text-amber-300" /> <span><strong>Phone</strong><br />{siteConfig.phone}</span></a>
            <a className="inline-flex items-start gap-3 rounded-[1.5rem] border border-black/5 bg-stone-50 px-5 py-4 dark:border-white/10 dark:bg-stone-900/60" href="https://wa.me/212691999897" target="_blank" rel="noreferrer"><MessageCircle className="mt-1 h-4 w-4 text-amber-700 dark:text-amber-300" /> <span><strong>WhatsApp</strong><br />Quick support and follow-up</span></a>
            <div className="inline-flex items-start gap-3 rounded-[1.5rem] border border-black/5 bg-stone-50 px-5 py-4 dark:border-white/10 dark:bg-stone-900/60"><MapPin className="mt-1 h-4 w-4 text-amber-700 dark:text-amber-300" /> <span><strong>Location</strong><br />{siteConfig.location}</span></div>
          </div>
        </div>
        <ContactForm locale={resolved} />
      </section>
    </div>
  );
}
