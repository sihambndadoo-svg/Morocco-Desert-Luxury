import { heroMedia } from '@/lib/content/experiences';
import { defaultExperiences } from '@/lib/content/experiences';
import { getServiceSupabase } from '@/lib/supabase/server';

export async function fetchMediaAssets() {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data } = await supabase
      .from('media_assets')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (data?.length) return data;
  }

  const fallback = [
    {
      key: 'hero-video',
      media_type: 'video',
      url: heroMedia.url,
      fallback_url: heroMedia.fallbackUrl,
      page_key: 'home',
      category: 'hero',
      alt: heroMedia.alt,
      is_active: true,
      sort_order: 1
    },
    ...defaultExperiences.flatMap((experience, index) =>
      [experience.heroMedia, ...experience.gallery].slice(0, 2).map((asset, assetIndex) => ({
        key: `${experience.slug}-${assetIndex}`,
        media_type: asset.type,
        url: asset.url,
        fallback_url: asset.fallbackUrl,
        page_key: experience.slug,
        category: experience.category,
        alt: asset.alt,
        is_active: true,
        sort_order: index * 10 + assetIndex
      }))
    )
  ];

  return fallback;
}

export async function upsertMediaAsset(payload: Record<string, unknown>) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('media_assets').upsert(payload, { onConflict: 'key' });
  if (error) throw error;
}
