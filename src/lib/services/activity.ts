import { getServiceSupabase } from '@/lib/supabase/server';

export async function addRecentActivity(
  activity_type: string,
  description: string,
  entity_type?: string,
  entity_id?: string,
  metadata: Record<string, unknown> = {},
  created_by = 'system'
) {
  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase.from('admin_recent_activity').insert({
    activity_type,
    entity_type,
    entity_id,
    description,
    metadata,
    created_by
  });
}

export async function listRecentActivity(limit = 12) {
  const supabase = getServiceSupabase();
  if (!supabase) return [] as Record<string, unknown>[];
  const { data } = await supabase
    .from('admin_recent_activity')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}
