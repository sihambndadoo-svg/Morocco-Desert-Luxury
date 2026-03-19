import { Locale, SiteCopy } from '@/types';

export const locales: Locale[] = ['en', 'fr', 'es', 'ar'];
export const defaultLocale: Locale = 'en';
export const rtlLocales: Locale[] = ['ar'];

export const siteConfig = {
  name: 'Morocco Desert Luxury',
  description:
    'Luxury desert camp stays, camel treks, quad adventures, 4x4 experiences, private transfers, and bespoke Sahara itineraries in Merzouga, Morocco.',
  ownerEmail: 'contact@moroccodesertluxury.com',
  whatsapp: '+212 691999897',
  phone: '+212 691999897',
  location: 'Merzouga, Erg Chebbi, Morocco',
  coordinates: {
    lat: 31.0996,
    lng: -4.0114
  },
  social: {
    tiktok: 'https://www.tiktok.com/@soufiane_ft10?_r=1&_t=ZN-94ghEwiTHDK',
    instagram:
      'https://www.instagram.com/positano_store1?igsh=MTdybmxxaXozOHhkcw%3D%3D&utm_source=qr',
    facebook: 'https://www.facebook.com/share/18MJ4h2CHG/?mibextid=wwXIfr'
  }
};

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ar: 'العربية'
};

export const currency = 'EUR';

export const emptySiteCopy: SiteCopy = {
  brandName: siteConfig.name,
  tagline: {
    en: 'Luxury desert hospitality in Merzouga.',
    fr: 'Hospitalité désertique de luxe à Merzouga.',
    es: 'Hospitalidad de lujo en el desierto de Merzouga.',
    ar: 'ضيافة صحراوية فاخرة في مرزوكة.'
  },
  nav: {},
  footerNote: {
    en: '',
    fr: '',
    es: '',
    ar: ''
  },
  responsePromise: {
    en: '',
    fr: '',
    es: '',
    ar: ''
  },
  trustPoints: [],
  faqIntro: { en: '', fr: '', es: '', ar: '' },
  whyChooseUs: { title: { en: '', fr: '', es: '', ar: '' }, items: [] },
  bookingSteps: [],
  homeHero: {
    eyebrow: { en: '', fr: '', es: '', ar: '' },
    title: { en: '', fr: '', es: '', ar: '' },
    description: { en: '', fr: '', es: '', ar: '' },
    primaryCta: { en: '', fr: '', es: '', ar: '' },
    secondaryCta: { en: '', fr: '', es: '', ar: '' }
  },
  contactIntro: { en: '', fr: '', es: '', ar: '' },
  policySummary: { en: '', fr: '', es: '', ar: '' },
  arrivalIntro: { en: '', fr: '', es: '', ar: '' },
  galleryIntro: { en: '', fr: '', es: '', ar: '' },
  journalIntro: { en: '', fr: '', es: '', ar: '' },
  reviewsIntro: { en: '', fr: '', es: '', ar: '' }
};
