import { Metadata } from 'next';
import { env } from '@/lib/env';
import { siteConfig } from '@/lib/constants';
import { Locale } from '@/types';
import { localizePath } from '@/lib/i18n';

export function buildMetadata(options: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const path = options.path ?? '';
  const url = `${siteUrl}${localizePath(options.locale, path)}`;
  const image = options.image ?? `${siteUrl}/og-default.png`;
  return {
    title: `${options.title} | ${siteConfig.name}`,
    description: options.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en${path ? `/${path}` : ''}`,
        fr: `${siteUrl}/fr${path ? `/${path}` : ''}`,
        es: `${siteUrl}/es${path ? `/${path}` : ''}`,
        ar: `${siteUrl}/ar${path ? `/${path}` : ''}`,
      },
    },
    openGraph: {
      title: `${options.title} | ${siteConfig.name}`,
      description: options.description,
      url,
      siteName: siteConfig.name,
      locale: options.locale,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: options.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${options.title} | ${siteConfig.name}`,
      description: options.description,
      images: [image],
    },
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: siteConfig.name,
    description: siteConfig.description,
    areaServed: 'Merzouga, Erg Chebbi, Morocco',
    url: env.NEXT_PUBLIC_SITE_URL,
    email: siteConfig.ownerEmail,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Merzouga',
      addressRegion: 'Drâa-Tafilalet',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.coordinates.lat,
      longitude: siteConfig.coordinates.lng,
    },
    sameAs: [siteConfig.social.instagram, siteConfig.social.tiktok, siteConfig.social.facebook],
  };
}
