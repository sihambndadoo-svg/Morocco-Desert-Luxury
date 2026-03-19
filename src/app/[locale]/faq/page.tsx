import { FAQAccordion } from '@/components/marketing/faq-accordion';
import { PageHero } from '@/components/marketing/page-hero';
import { buildMetadata } from '@/lib/seo/metadata';
import { getLocalizedFaqItems, getPublicData } from '@/lib/public-data';
import { resolveLocale } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';
import { StructuredData } from '@/components/marketing/structured-data';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({ locale: resolved, title: 'Frequently asked questions', description: 'Read answers about bookings, camp stays, camel rides, transfers, pricing, payments, and what to bring for Merzouga.', path: 'faq' });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const { copy } = await getPublicData();
  const faqItems = getLocalizedFaqItems(resolved);
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="FAQ" title="Questions guests often ask before they reserve" description={getLocalizedText(copy.faqIntro, resolved)} primary={{ href: `/${resolved}/booking`, label: 'Open booking form' }} secondary={{ href: `/${resolved}/contact`, label: 'Ask a custom question' }} />
      <section className="pt-16">
        <FAQAccordion items={faqItems} />
      </section>
      <StructuredData data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }} />
    </div>
  );
}
