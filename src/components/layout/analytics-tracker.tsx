'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Locale } from '@/types';

const STORAGE_KEY = 'ecl_session_token';

export function AnalyticsTracker({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionToken = window.localStorage.getItem(STORAGE_KEY) ?? undefined;
    const payload = {
      session_token: sessionToken,
      page_path: pathname,
      page_title: document.title,
      event_type: 'page_view',
      locale,
      referrer: document.referrer || undefined,
      source: url.searchParams.get('utm_source') ?? undefined,
      medium: url.searchParams.get('utm_medium') ?? undefined,
      campaign: url.searchParams.get('utm_campaign') ?? undefined,
      metadata: {
        pathname,
      },
    };
    void fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.session_token) {
          window.localStorage.setItem(STORAGE_KEY, data.session_token);
        }
      })
      .catch(() => undefined);
  }, [locale, pathname]);

  return null;
}
