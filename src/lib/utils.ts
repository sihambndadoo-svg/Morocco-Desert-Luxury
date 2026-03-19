import { clsx, type ClassValue } from 'clsx';
import { format, addDays, differenceInCalendarDays, parseISO, isValid } from 'date-fns';
import { Locale, LocalizedString } from '@/types';
import { defaultLocale, rtlLocales } from '@/lib/constants';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getLocalizedText(text: LocalizedString, locale: Locale) {
  return text[locale] ?? text[defaultLocale];
}

export function isRTL(locale: Locale) {
  return rtlLocales.includes(locale);
}

export function formatCurrency(amount: number, currency: string = 'EUR', locale: Locale = 'en') {
  try {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `${amount.toFixed(0)} ${currency}`;
  }
}

export function formatDate(value: string, locale: Locale = 'en') {
  const parsed = parseISO(value);
  if (!isValid(parsed)) return value;
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(parsed);
}

export function getDateRange(startDate: string, endDate?: string) {
  const start = parseISO(startDate);
  if (!isValid(start)) return [] as string[];
  const end = endDate ? parseISO(endDate) : start;
  if (!isValid(end)) return [format(start, 'yyyy-MM-dd')];
  const count = Math.max(differenceInCalendarDays(end, start), 0);
  return Array.from({ length: count === 0 ? 1 : count }, (_, index) =>
    format(addDays(start, index), 'yyyy-MM-dd')
  );
}


export function getInclusiveDateRange(startDate: string, endDate?: string) {
  const start = parseISO(startDate);
  if (!isValid(start)) return [] as string[];
  const end = endDate ? parseISO(endDate) : start;
  if (!isValid(end)) return [format(start, 'yyyy-MM-dd')];
  const count = Math.max(differenceInCalendarDays(end, start), 0);
  return Array.from({ length: count + 1 }, (_, index) =>
    format(addDays(start, index), 'yyyy-MM-dd')
  );
}

export function nightsBetween(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return 1;
  const start = parseISO(checkIn);
  const end = parseISO(checkOut);
  if (!isValid(start) || !isValid(end)) return 1;
  return Math.max(differenceInCalendarDays(end, start), 1);
}

export function slugToTitle(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function parseNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function normalizeText(value?: string | null) {
  return value?.trim() ?? '';
}

export function csvEscape(value: unknown) {
  const normalized = String(value ?? '');
  return `"${normalized.replaceAll('"', '""')}"`;
}

export function hashText(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return `h${Math.abs(hash)}`;
}
