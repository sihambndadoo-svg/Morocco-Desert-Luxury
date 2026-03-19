import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { AnalyticsTracker } from '@/components/layout/analytics-tracker';
import { LocaleHtmlAttributes } from '@/components/layout/locale-html-attributes';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { StructuredData } from '@/components/marketing/structured-data';
import { buildLocalBusinessJsonLd } from '@/lib/seo/metadata';
import { resolveLocale, isLocale } from '@/lib/i18n';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'es' }, { locale: 'ar' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: incomingLocale } = await params;
  if (!isLocale(incomingLocale)) notFound();
  const locale = resolveLocale(incomingLocale);

  return (
    <>
      <LocaleHtmlAttributes locale={locale} />
      <AnalyticsTracker locale={locale} />
      <StructuredData data={buildLocalBusinessJsonLd()} />
      <div className="page-shell min-h-screen">
        <SiteHeader locale={locale} />
        <main className="relative z-10">{children}</main>
        <SiteFooter locale={locale} />
      </div>
    </>
  );
}
