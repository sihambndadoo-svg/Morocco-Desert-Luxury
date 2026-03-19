import Link from 'next/link';
import { Facebook, Instagram, MapPin, MessageCircle, Phone, Ticket, BookOpen } from 'lucide-react';
import { Locale } from '@/types';
import { siteConfig } from '@/lib/constants';
import { siteCopy } from '@/lib/content/site-copy';
import { getLocalizedText } from '@/lib/utils';
import { Logo } from '@/components/layout/logo';

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-black/5 bg-[#f7f2ea] px-4 py-16 dark:border-white/10 dark:bg-[#0e0b08] md:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr]">
        <div className="space-y-5">
          <Logo href={`/${locale}`} />
          <p className="max-w-xl text-sm leading-7 text-stone-600 dark:text-stone-300">
            {getLocalizedText(siteCopy.footerNote, locale)}
          </p>
          <p className="max-w-xl text-sm leading-7 text-amber-800 dark:text-amber-200">
            {getLocalizedText(siteCopy.responsePromise, locale)}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl text-stone-900 dark:text-white">Explore</h2>
          <div className="grid gap-3 text-sm text-stone-600 dark:text-stone-300">
            <Link href={`/${locale}/experiences` as any} className="transition hover:text-amber-700 dark:hover:text-amber-300">Experiences</Link>
            <Link href={`/${locale}/gallery` as any} className="transition hover:text-amber-700 dark:hover:text-amber-300">Gallery</Link>
            <Link href={`/${locale}/booking` as any} className="transition hover:text-amber-700 dark:hover:text-amber-300">Booking</Link>
            <Link href={`/${locale}/journal` as any} className="transition hover:text-amber-700 dark:hover:text-amber-300">Travel Guide</Link>
            <Link href={`/${locale}/policies` as any} className="transition hover:text-amber-700 dark:hover:text-amber-300">Policies</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl text-stone-900 dark:text-white">Contact</h2>
          <div className="grid gap-3 text-sm text-stone-600 dark:text-stone-300">
            <p className="inline-flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4" /> {siteConfig.location}</p>
            <a className="inline-flex items-center gap-2 transition hover:text-amber-700 dark:hover:text-amber-300" href={`mailto:${siteConfig.ownerEmail}`}><Ticket className="h-4 w-4" /> {siteConfig.ownerEmail}</a>
            <a className="inline-flex items-center gap-2 transition hover:text-amber-700 dark:hover:text-amber-300" href={`tel:${siteConfig.phone}`}><Phone className="h-4 w-4" /> {siteConfig.phone}</a>
            <a className="inline-flex items-center gap-2 transition hover:text-amber-700 dark:hover:text-amber-300" href={`https://wa.me/212691999897`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp support</a>
            <div className="flex items-center gap-3 pt-2">
              <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-black/10 p-2 transition hover:border-amber-500 dark:border-white/10 dark:hover:border-amber-300"><Instagram className="h-4 w-4" /></a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full border border-black/10 p-2 transition hover:border-amber-500 dark:border-white/10 dark:hover:border-amber-300"><Facebook className="h-4 w-4" /></a>
              <a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="rounded-full border border-black/10 p-2 transition hover:border-amber-500 dark:border-white/10 dark:hover:border-amber-300"><BookOpen className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-black/5 pt-6 text-xs uppercase tracking-[0.24em] text-stone-500 dark:border-white/10 dark:text-stone-400">
        Morocco Desert Luxury · Merzouga, Morocco
      </div>
    </footer>
  );
}
