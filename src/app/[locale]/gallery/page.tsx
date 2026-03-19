export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { GalleryGrid } from '@/components/marketing/gallery-grid';
import { PageHero } from '@/components/marketing/page-hero';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPublicData } from '@/lib/public-data';
import { resolveLocale } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  return buildMetadata({ locale: resolved, title: 'Gallery', description: 'A cinematic gallery of dune light, luxury camp atmosphere, camel rides, quad adventures, and private desert touring.', path: 'gallery' });
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolved = resolveLocale(locale);
  const { mediaAssets, copy } = await getPublicData();
  const items = mediaAssets.filter((item: any) => item.media_type === 'image').map((item: any) => ({ url: item.url, fallbackUrl: item.fallback_url, alt: getLocalizedText(item.alt, resolved) }));
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6">
      <PageHero eyebrow="Gallery" title="The light, texture, and atmosphere of Erg Chebbi" description={getLocalizedText(copy.galleryIntro, resolved)} primary={{ href: `/${resolved}/booking`, label: 'Turn the atmosphere into a booking' }} secondary={{ href: `/${resolved}/experiences`, label: 'Browse experiences' }} />
      <section className="pt-16">
        <GalleryGrid items={items} />
      </section>
    </div>
  );
}
