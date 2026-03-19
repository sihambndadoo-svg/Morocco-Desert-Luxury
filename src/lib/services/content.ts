import { siteCopy } from '@/lib/content/site-copy';
import { defaultPaymentSettings, normalizePaymentSettings } from '@/lib/payment-settings';
import { getServiceSupabase } from '@/lib/supabase/server';

export async function fetchSiteSettings() {
  const supabase = getServiceSupabase();
  if (!supabase) return {} as Record<string, unknown>;
  const { data } = await supabase.from('site_settings').select('*');
  return (data ?? []).reduce<Record<string, unknown>>((accumulator, row: any) => {
    accumulator[row.key] = row.value;
    return accumulator;
  }, {});
}


export async function getPaymentSettings() {
  const settings = await fetchSiteSettings();
  return normalizePaymentSettings(settings.paymentSettings ?? defaultPaymentSettings);
}
export async function fetchContentBlocks() {
  const supabase = getServiceSupabase();
  if (!supabase) return [] as any[];
  const { data } = await supabase.from('content_blocks').select('*').eq('is_active', true);
  return data ?? [];
}

export async function upsertSetting(key: string, value: unknown, updated_by = 'owner') {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('site_settings').upsert({ key, value, updated_by });
  if (error) throw error;
}

export async function upsertContentBlock(payload: Record<string, unknown>) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('content_blocks').upsert(payload, {
    onConflict: 'block_key,locale'
  });
  if (error) throw error;
}

export async function getMergedSiteCopy() {
  const settings = await fetchSiteSettings();
  return {
    ...siteCopy,
    responsePromise:
      (settings.responsePromise as typeof siteCopy.responsePromise | undefined) ?? siteCopy.responsePromise,
  };
}
