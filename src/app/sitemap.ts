import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { locales } from '@/lib/constants';
import { defaultExperiences } from '@/lib/content/experiences';
import { guides } from '@/lib/content/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const staticPaths = [
    '',
    '/experiences',
    '/luxury-camp',
    '/camel-trekking',
    '/quad-atv',
    '/4x4-tours',
    '/transfers-custom-tours',
    '/about',
    '/gallery',
    '/faq',
    '/contact',
    '/booking',
    '/policies',
    '/arrival-transfer-info',
    '/reviews',
    '/journal',
  ];

  const items: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const path of staticPaths) {
      items.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
      });
    }
    for (const experience of defaultExperiences) {
      items.push({
        url: `${base}/${locale}/experiences/${experience.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
    for (const guide of guides) {
      items.push({
        url: `${base}/${locale}/journal/${guide.slug}`,
        lastModified: new Date(guide.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.65,
      });
    }
  }
  return items;
}
