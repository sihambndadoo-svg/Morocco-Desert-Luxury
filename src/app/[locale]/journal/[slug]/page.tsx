import { notFound } from 'next/navigation';
import { SafeImage } from '@/components/marketing/safe-image';
import { PageHero } from '@/components/marketing/page-hero';
import { buildMetadata } from '@/lib/seo/metadata';
import { guides } from '@/lib/content/guides';
import { resolveLocale } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';
import type { GuideArticle } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const resolved = resolveLocale(locale);
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) {
    return buildMetadata({ locale: resolved, title: 'Travel guide', description: 'Travel guide', path: `journal/${slug}` });
  }
  return buildMetadata({ locale: resolved, title: getLocalizedText(guide.title, resolved), description: getLocalizedText(guide.summary, resolved), path: `journal/${slug}`, image: guide.cover.url });
}

export default async function JournalDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const resolved = resolveLocale(locale);
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) {
    notFound();
  }
  const currentGuide = guide as GuideArticle;
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Travel guide" title={getLocalizedText(currentGuide.title, resolved)} description={getLocalizedText(currentGuide.summary, resolved)} compact />
      <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/10">
        <SafeImage src={currentGuide.cover.url} fallbackSrc={currentGuide.cover.fallbackUrl} alt={getLocalizedText(currentGuide.cover.alt, resolved)} fill className="object-cover" sizes="100vw" />
      </div>
      <article className="prose-ecl mt-12 rounded-[2rem] border border-black/5 bg-white p-8 dark:border-white/10 dark:bg-stone-950/60">
        {currentGuide.content.map((paragraph, index) => (
          <p key={index}>{getLocalizedText(paragraph, resolved)}</p>
        ))}
      </article>
    </div>
  );
}
