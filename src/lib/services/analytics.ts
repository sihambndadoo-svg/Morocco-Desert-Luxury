import { getServiceSupabase } from '@/lib/supabase/server';
import { addRecentActivity } from '@/lib/services/activity';
import { hashText } from '@/lib/utils';

function detectDevice(userAgent: string) {
  const normalized = userAgent.toLowerCase();
  if (/tablet|ipad/.test(normalized)) return 'tablet';
  if (/mobile|iphone|android/.test(normalized)) return 'mobile';
  return 'desktop';
}

function detectBrowser(userAgent: string) {
  const normalized = userAgent.toLowerCase();
  if (normalized.includes('edg')) return 'Edge';
  if (normalized.includes('chrome')) return 'Chrome';
  if (normalized.includes('safari')) return 'Safari';
  if (normalized.includes('firefox')) return 'Firefox';
  return 'Unknown';
}

export async function trackEvent(payload: {
  session_token?: string;
  page_path: string;
  page_title?: string;
  event_type: string;
  locale?: string;
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  metadata?: Record<string, unknown>;
  user_agent?: string;
  ip?: string;
}) {
  const supabase = getServiceSupabase();
  const now = new Date().toISOString();
  if (!supabase) {
    return {
      session_token: payload.session_token ?? crypto.randomUUID(),
      session_id: null,
    };
  }

  const sessionToken = payload.session_token || crypto.randomUUID();
  const userAgent = payload.user_agent ?? '';
  const ipHash = payload.ip ? hashText(payload.ip) : null;

  let sessionRow: any = null;
  const { data: existingSession } = await supabase
    .from('visitor_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .maybeSingle();
  sessionRow = existingSession;

  if (!sessionRow) {
    const { data } = await supabase
      .from('visitor_sessions')
      .insert({
        session_token: sessionToken,
        started_at: now,
        last_seen_at: now,
        entry_page: payload.page_path,
        last_page: payload.page_path,
        referrer: payload.referrer ?? null,
        source: payload.source ?? 'direct',
        medium: payload.medium ?? 'none',
        campaign: payload.campaign ?? null,
        device_type: detectDevice(userAgent),
        browser: detectBrowser(userAgent),
        user_agent: userAgent,
        locale: payload.locale ?? 'en',
        ip_hash: ipHash,
      })
      .select('*')
      .single();
    sessionRow = data;
  } else {
    await supabase
      .from('visitor_sessions')
      .update({
        last_seen_at: now,
        last_page: payload.page_path,
        locale: payload.locale ?? sessionRow.locale,
      })
      .eq('id', sessionRow.id);
  }

  await supabase.from('page_events').insert({
    session_id: sessionRow.id,
    event_type: payload.event_type,
    page_path: payload.page_path,
    page_title: payload.page_title ?? null,
    referrer: payload.referrer ?? null,
    source: payload.source ?? 'direct',
    medium: payload.medium ?? 'none',
    campaign: payload.campaign ?? null,
    locale: payload.locale ?? 'en',
    metadata: payload.metadata ?? {},
  });

  if (payload.event_type !== 'page_view') {
    await addRecentActivity(
      'analytics_event',
      `${payload.event_type} tracked on ${payload.page_path}`,
      'analytics',
      sessionRow.id,
      payload.metadata ?? {},
      'system'
    );
  }

  return {
    session_token: sessionToken,
    session_id: sessionRow.id,
  };
}

export async function getAnalyticsSummary() {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return {
      sessionCount: 0,
      pageViews: 0,
      bookingConversions: 0,
      messageConversions: 0,
      topPages: [] as Array<{ page_path: string; count: number }>,
      topSources: [] as Array<{ source: string; count: number }>,
      recentEvents: [] as any[],
    };
  }

  const [{ data: sessions }, { data: events }] = await Promise.all([
    supabase.from('visitor_sessions').select('*'),
    supabase.from('page_events').select('*').order('created_at', { ascending: false }).limit(100),
  ]);

  const pageViews = (events ?? []).filter((event: any) => event.event_type === 'page_view').length;
  const bookingConversions = (events ?? []).filter((event: any) => event.event_type === 'booking_conversion').length;
  const messageConversions = (events ?? []).filter((event: any) => event.event_type === 'message_conversion').length;

  const topPagesMap = new Map<string, number>();
  const topSourcesMap = new Map<string, number>();
  for (const event of events ?? []) {
    if (event.page_path) {
      topPagesMap.set(event.page_path, (topPagesMap.get(event.page_path) ?? 0) + 1);
    }
    if (event.source) {
      topSourcesMap.set(event.source, (topSourcesMap.get(event.source) ?? 0) + 1);
    }
  }

  const topPages = [...topPagesMap.entries()]
    .map(([page_path, count]) => ({ page_path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const topSources = [...topSourcesMap.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    sessionCount: sessions?.length ?? 0,
    pageViews,
    bookingConversions,
    messageConversions,
    topPages,
    topSources,
    recentEvents: events ?? [],
  };
}
