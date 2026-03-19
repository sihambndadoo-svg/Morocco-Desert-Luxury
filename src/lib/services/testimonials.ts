import { Testimonial } from '@/types';
import { defaultTestimonials } from '@/lib/content/testimonials';
import { getServiceSupabase } from '@/lib/supabase/server';

export async function fetchTestimonials(featuredOnly = false, includeHidden = false) {
  const supabase = getServiceSupabase();
  if (supabase) {
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!includeHidden) query = query.eq('is_visible', true);
    if (featuredOnly) query = query.eq('is_featured', true);

    const { data } = await query;
    if (data?.length) return data as Testimonial[];
  }

  return defaultTestimonials.filter((item) => {
    if (!includeHidden && !item.is_visible) return false;
    if (featuredOnly && !item.is_featured) return false;
    return true;
  });
}

export async function saveTestimonial(payload: Record<string, unknown>) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const record = {
    ...payload,
    experience_slug: payload.experience_slug || null,
  };

  const { data, error } = await supabase.from('testimonials').upsert(record).select('*').single();
  if (error) throw error;
  return data as Testimonial;
}

export async function deleteTestimonial(id: string) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
  return { ok: true };
}
