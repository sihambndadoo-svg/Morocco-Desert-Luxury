import { defaultLocale, locales, localeLabels, rtlLocales } from '@/lib/constants';
import { Locale } from '@/types';
import { siteCopy } from '@/lib/content/site-copy';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function resolveLocale(value?: string): Locale {
  if (value && isLocale(value)) return value;
  return defaultLocale;
}

export function getDirection(locale: Locale) {
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}

export function getLocaleLabel(locale: Locale) {
  return localeLabels[locale];
}

export function getSiteCopy() {
  return siteCopy;
}

export function localizePath(locale: Locale, path = '') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalized === '/' ? '' : normalized}`;
}
