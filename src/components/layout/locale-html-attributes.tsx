'use client';

import { useEffect } from 'react';
import { getDirection } from '@/lib/i18n';
import { Locale } from '@/types';

export function LocaleHtmlAttributes({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getDirection(locale);
  }, [locale]);
  return null;
}
