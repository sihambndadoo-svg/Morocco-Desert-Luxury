'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Locale } from '@/types';
import { siteCopy } from '@/lib/content/site-copy';
import { getLocalizedText } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { Logo } from '@/components/layout/logo';

const navItems = [
  ['home', ''],
  ['experiences', '/experiences'],
  ['about', '/about'],
  ['gallery', '/gallery'],
  ['faq', '/faq'],
  ['contact', '/contact'],
] as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 py-4 md:px-6">
      <div
        className={`ecl-header-shell mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 transition md:px-6 ${scrolled ? 'glass-panel' : ''}`}
      >
        <Logo href={`/${locale}` as any} compact />

        <nav className="hidden items-center gap-4 xl:gap-5 lg:flex">
          {navItems.map(([key, path]) => (
            <Link
              key={key}
              href={`/${locale}${path}` as any}
              className="text-[13px] font-semibold text-stone-800 transition hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-300 xl:text-sm"
            >
              {getLocalizedText(siteCopy.nav[key], locale)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher locale={locale} className="w-[23rem]" />
          <Link href={`/${locale}/booking` as any} className="ecl-primary-button">
            {getLocalizedText(siteCopy.nav.booking, locale)}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          className="ecl-icon-button inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-sm lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="ecl-mobile-drawer mx-auto mt-3 max-w-7xl rounded-[2rem] p-5 shadow-[0_30px_80px_-40px_rgba(34,25,17,0.4)] lg:hidden">
          <div className="grid gap-3">
            {navItems.map(([key, path]) => (
              <Link
                key={key}
                href={`/${locale}${path}` as any}
                onClick={() => setOpen(false)}
                className="ecl-mobile-link rounded-2xl px-4 py-3 text-base transition"
              >
                {getLocalizedText(siteCopy.nav[key], locale)}
              </Link>
            ))}
            <div className="mt-2 space-y-4 border-t border-black/5 pt-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <LanguageSwitcher locale={locale} className="flex-1 min-w-0" />
              </div>
              <Link
                href={`/${locale}/booking` as any}
                onClick={() => setOpen(false)}
                className="ecl-primary-button mt-1 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-base font-semibold shadow-sm"
              >
                {getLocalizedText(siteCopy.nav.booking, locale)}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
