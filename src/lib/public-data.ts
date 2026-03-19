import { fetchExperiences } from '@/lib/services/experiences';
import { fetchTestimonials } from '@/lib/services/testimonials';
import { faqs } from '@/lib/content/faqs';
import { guides } from '@/lib/content/guides';
import { fetchMediaAssets } from '@/lib/services/media';
import { getMergedSiteCopy } from '@/lib/services/content';
import { Locale } from '@/types';

const DEFAULT_SHORTLIST_RANK = 999;

export async function getPublicData() {
  const [experiences, testimonials, mediaAssets, copy] = await Promise.all([
    fetchExperiences(),
    fetchTestimonials(true),
    fetchMediaAssets(),
    getMergedSiteCopy(),
  ]);

  const featuredExperiences = experiences
    .filter((item) => Boolean(item.showOnHome) && item.active)
    .sort((a, b) => {
      const rankDelta = (a.shortListRank ?? DEFAULT_SHORTLIST_RANK) - (b.shortListRank ?? DEFAULT_SHORTLIST_RANK);
      if (rankDelta !== 0) return rankDelta;
      return a.sortOrder - b.sortOrder;
    })
    .slice(0, 5);

  return {
    experiences,
    featuredExperiences,
    testimonials,
    mediaAssets,
    copy,
    faqs,
    guides,
  };
}

export function getLocalizedFaqItems(locale: Locale, category?: string) {
  return faqs
    .filter((item) => (category ? item.category === category : true))
    .map((item) => ({ question: item.question[locale], answer: item.answer[locale] }));
}
