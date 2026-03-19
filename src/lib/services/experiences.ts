import { defaultExperiences } from '@/lib/content/experiences';
import { getServiceSupabase } from '@/lib/supabase/server';
import { Experience, ExperienceCategory, ExperienceMeta, LocalizedString } from '@/types';

function ensureLocalized(value: any, fallback: LocalizedString): LocalizedString {
  return {
    en: value?.en ?? fallback.en,
    fr: value?.fr ?? fallback.fr,
    es: value?.es ?? fallback.es,
    ar: value?.ar ?? fallback.ar,
  };
}

const defaultPrimarySlugs = new Set([
  'luxury-desert-camp-1-night',
  'luxury-desert-camp-2-nights',
  'sunset-camel-trek',
  'sunrise-camel-ride',
  'camel-trekking',
  'quad-atv-tour-1-hour',
  'quad-atv-tour-2-hours',
  'private-4x4-erg-chebbi-tour',
  'full-day-desert-exploration',
]);

const defaultExtraSlugs = new Set([
  'sunset-camel-trek',
  'sunrise-camel-ride',
  'camel-trekking',
  'quad-atv-tour-1-hour',
  'quad-atv-tour-2-hours',
  'private-4x4-erg-chebbi-tour',
  'full-day-desert-exploration',
  'romantic-luxury-camp-experience',
  'airport-transfer',
  'private-transfer',
  'photography-private-sunset-experience',
]);

function fallbackMeta(base: Experience): Required<ExperienceMeta> {
  return {
    showOnHome: base.featured && base.sortOrder <= 6,
    showOnBookingPrimary: defaultPrimarySlugs.has(base.slug),
    showOnBookingExtras: defaultExtraSlugs.has(base.slug),
    shortListRank: base.sortOrder,
    adminBadge: base.category === 'camp' ? 'Core' : base.featured ? 'Featured' : '',
    cardLabel: null,
  };
}

function normalizeMeta(row: any, base: Experience): Required<ExperienceMeta> {
  const meta = row?.meta ?? {};
  const fallback = fallbackMeta(base);

  return {
    showOnHome: meta.showOnHome ?? row?.is_featured ?? fallback.showOnHome,
    showOnBookingPrimary: meta.showOnBookingPrimary ?? fallback.showOnBookingPrimary,
    showOnBookingExtras: meta.showOnBookingExtras ?? fallback.showOnBookingExtras,
    shortListRank: Number(meta.shortListRank ?? row?.sort_order ?? fallback.shortListRank),
    adminBadge: meta.adminBadge ?? fallback.adminBadge,
    cardLabel: meta.cardLabel ?? fallback.cardLabel,
  };
}

function mergeExperienceRow(row: any, base?: Experience): Experience {
  const fallback = base ?? defaultExperiences[0];
  const content = row.content ?? {};
  const meta = normalizeMeta(row, base ?? fallback);
  return {
    slug: row.slug,
    category: row.category ?? base?.category ?? 'camp',
    featured: row.is_featured ?? base?.featured ?? false,
    active: row.is_active ?? base?.active ?? true,
    sortOrder: row.sort_order ?? base?.sortOrder ?? 999,
    durationLabel: row.duration_label ?? base?.durationLabel ?? 'Custom',
    durationDays: row.duration_days ?? base?.durationDays ?? 1,
    startingPrice: Number(row.starting_price ?? base?.startingPrice ?? 0),
    baseAdultPrice: Number(row.base_adult_price ?? base?.baseAdultPrice ?? 0),
    baseChildPrice: Number(row.base_child_price ?? base?.baseChildPrice ?? 0),
    privateSurcharge: Number(row.private_surcharge ?? base?.privateSurcharge ?? 0),
    transferPrice: Number(row.transfer_price ?? base?.transferPrice ?? 0),
    capacityDefault: Number(row.capacity_default ?? base?.capacityDefault ?? 10),
    unitCapacityDefault: Number(row.unit_capacity_default ?? base?.unitCapacityDefault ?? 0),
    showOnHome: meta.showOnHome,
    showOnBookingPrimary: meta.showOnBookingPrimary,
    showOnBookingExtras: meta.showOnBookingExtras,
    shortListRank: meta.shortListRank,
    adminBadge: meta.adminBadge,
    cardLabel: meta.cardLabel,
    heroMedia: {
      ...(base?.heroMedia ?? fallback.heroMedia),
      url: row.featured_media_url ?? base?.heroMedia.url ?? fallback.heroMedia.url,
      fallbackUrl:
        row.featured_media_fallback_url ??
        base?.heroMedia.fallbackUrl ??
        fallback.heroMedia.fallbackUrl,
    },
    gallery: base?.gallery ?? fallback.gallery,
    addOns: row.add_ons ?? base?.addOns ?? fallback.addOns,
    content: {
      title: ensureLocalized(content.title, base?.content.title ?? fallback.content.title),
      shortDescription: ensureLocalized(
        content.shortDescription,
        base?.content.shortDescription ?? fallback.content.shortDescription,
      ),
      longDescription: ensureLocalized(
        content.longDescription,
        base?.content.longDescription ?? fallback.content.longDescription,
      ),
      idealFor: ensureLocalized(content.idealFor, base?.content.idealFor ?? fallback.content.idealFor),
      meetingPoint: ensureLocalized(
        content.meetingPoint,
        base?.content.meetingPoint ?? fallback.content.meetingPoint,
      ),
      included: content.included ?? base?.content.included ?? fallback.content.included,
      exclusions: content.exclusions ?? base?.content.exclusions ?? fallback.content.exclusions,
      highlights: content.highlights ?? base?.content.highlights ?? fallback.content.highlights,
      departureContext:
        content.departureContext ?? base?.content.departureContext ?? fallback.content.departureContext,
      seoTitle: content.seoTitle ?? base?.content.seoTitle,
      seoDescription: content.seoDescription ?? base?.content.seoDescription,
    },
  };
}

export async function fetchExperiences(options?: {
  category?: ExperienceCategory;
  featuredOnly?: boolean;
  activeOnly?: boolean;
  visibleIn?: 'home' | 'booking-primary' | 'booking-extras';
}) {
  const supabase = getServiceSupabase();
  const defaults = defaultExperiences.map((item) => mergeExperienceRow({ slug: item.slug }, item)).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  let experiences = defaults;
  if (supabase) {
    const { data } = await supabase.from('experiences').select('*').order('sort_order', { ascending: true });
    if (data?.length) {
      const map = new Map(defaults.map((item) => [item.slug, item]));
      experiences = data.map((row) => mergeExperienceRow(row, map.get(row.slug)));
      for (const fallback of defaults) {
        if (!experiences.some((item) => item.slug === fallback.slug)) {
          experiences.push(mergeExperienceRow({ slug: fallback.slug }, fallback));
        }
      }
      experiences.sort((a, b) => (a.shortListRank ?? 999) - (b.shortListRank ?? 999) || a.sortOrder - b.sortOrder);
    }
  }

  return experiences.filter((item) => {
    if (options?.category && item.category !== options.category) return false;
    if (options?.featuredOnly && !item.featured) return false;
    if (options?.activeOnly !== false && !item.active) return false;
    if (options?.visibleIn === 'home' && !item.showOnHome) return false;
    if (options?.visibleIn === 'booking-primary' && !item.showOnBookingPrimary) return false;
    if (options?.visibleIn === 'booking-extras' && !item.showOnBookingExtras) return false;
    return true;
  });
}

export async function fetchExperienceBySlug(slug: string) {
  const experiences = await fetchExperiences({ activeOnly: false });
  return experiences.find((item) => item.slug === slug) ?? null;
}

export async function upsertExperienceBase(payload: {
  slug: string;
  category: ExperienceCategory;
  starting_price: number;
  base_adult_price: number;
  base_child_price: number;
  private_surcharge: number;
  transfer_price: number;
  is_featured: boolean;
  is_active: boolean;
  sort_order?: number;
  show_on_home?: boolean;
  show_on_booking_primary?: boolean;
  show_on_booking_extras?: boolean;
  short_list_rank?: number;
  admin_badge?: string | null;
  card_label?: string | null;
  featured_media_url?: string | null;
  featured_media_fallback_url?: string | null;
}) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const existing = await fetchExperienceBySlug(payload.slug);
  const base = existing ?? defaultExperiences.find((item) => item.slug === payload.slug) ?? defaultExperiences[0];
  const content = existing?.content ?? base.content;
  const add_ons = existing?.addOns ?? base.addOns;
  const featured_media_url = payload.featured_media_url?.trim() || existing?.heroMedia.url || base.heroMedia.url || null;
  const featured_media_fallback_url = payload.featured_media_fallback_url?.trim() || existing?.heroMedia.fallbackUrl || base.heroMedia.fallbackUrl || null;
  const duration_label = existing?.durationLabel ?? base.durationLabel ?? 'Custom';
  const duration_days = existing?.durationDays ?? base.durationDays ?? 1;
  const capacity_default = existing?.capacityDefault ?? base.capacityDefault ?? 10;
  const unit_capacity_default = existing?.unitCapacityDefault ?? base.unitCapacityDefault ?? 0;

  const meta: ExperienceMeta = {
    showOnHome: payload.show_on_home ?? existing?.showOnHome ?? base.showOnHome ?? false,
    showOnBookingPrimary:
      payload.show_on_booking_primary ?? existing?.showOnBookingPrimary ?? base.showOnBookingPrimary ?? false,
    showOnBookingExtras:
      payload.show_on_booking_extras ?? existing?.showOnBookingExtras ?? base.showOnBookingExtras ?? false,
    shortListRank: payload.short_list_rank ?? existing?.shortListRank ?? base.shortListRank ?? 999,
    adminBadge: payload.admin_badge ?? existing?.adminBadge ?? base.adminBadge ?? null,
    cardLabel: payload.card_label ?? existing?.cardLabel ?? base.cardLabel ?? null,
  };

  const { error } = await supabase.from('experiences').upsert(
    {
      slug: payload.slug,
      category: payload.category,
      is_featured: payload.is_featured,
      is_active: payload.is_active,
      sort_order: payload.sort_order ?? existing?.sortOrder ?? base.sortOrder ?? 999,
      duration_label,
      duration_days,
      starting_price: payload.starting_price,
      base_adult_price: payload.base_adult_price,
      base_child_price: payload.base_child_price,
      private_surcharge: payload.private_surcharge,
      transfer_price: payload.transfer_price,
      capacity_default,
      unit_capacity_default,
      featured_media_url,
      featured_media_fallback_url,
      add_ons,
      content,
      meta,
    },
    { onConflict: 'slug' },
  );
  if (error) throw error;
}
