import Link from 'next/link';
import { PageHero } from '@/components/marketing/page-hero';
import { SafeImage } from '@/components/marketing/safe-image';
import { buildMetadata } from '@/lib/seo/metadata';
import { guides } from '@/lib/content/guides';
import { resolveLocale } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({ locale: resolved, title: 'Travel guide', description: 'Luxury-oriented travel advice for Merzouga, what to pack, and how to plan a refined Sahara itinerary.', path: 'journal' });
}

export default async function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Travel guide" title="Editorial travel advice for Merzouga and the Sahara" description="Useful content improves trust, supports search visibility, and helps premium guests arrive better prepared." primary={{ href: `/${resolved}/booking`, label: 'Turn inspiration into a booking' }} />
      <section className="grid gap-6 pt-16 md:grid-cols-2 xl:grid-cols-3">
        {guides.map((article) => (
          <article key={article.slug} className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_18px_50px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60">
            <div className="relative aspect-[4/3]">
              <SafeImage src={article.cover.url} fallbackSrc={article.cover.fallbackUrl} alt={getLocalizedText(article.cover.alt, resolved)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="space-y-4 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700 dark:text-amber-300">{article.readTime}</div>
              <h2 className="font-serif text-2xl text-stone-900 dark:text-white">{getLocalizedText(article.title, resolved)}</h2>
              <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">{getLocalizedText(article.summary, resolved)}</p>
              <Link href={`/${resolved}/journal/${article.slug}` as any} className="inline-flex text-sm font-semibold underline underline-offset-4">Read the guide</Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
