'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '@/lib/constants';
import { getLocaleLabel, resolveLocale } from '@/lib/i18n';
import { Locale } from '@/types';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = resolveLocale(segments[0]);
  const rest = currentLocale ? segments.slice(1).join('/') : segments.join('/');

  return (
    <div
      className={cn(
        'ecl-segmented w-full min-w-0 grid grid-cols-4 items-center gap-1 rounded-full border p-1 shadow-[0_10px_30px_-20px_rgba(15,12,9,0.25)]',
        className
      )}
    >
      {locales.map((targetLocale) => {
        const active = locale === targetLocale;
        return (
          <Link
            key={targetLocale}
            href={`/${targetLocale}${rest ? `/${rest}` : ''}` as any}
            className={cn(
              'ecl-segmented__item min-w-0 rounded-full px-3 py-2 text-center text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 sm:px-4',
              active && 'is-active'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <span className="block truncate">{getLocaleLabel(targetLocale)}</span>
          </Link>
        );
      })}
    </div>
  );
}
