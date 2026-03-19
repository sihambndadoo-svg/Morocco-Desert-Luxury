import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { trackEvent } from '@/lib/services/analytics';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.page_path || !body?.event_type) {
    return NextResponse.json({ error: 'Missing page_path or event_type.' }, { status: 400 });
  }
  const headerStore = await headers();
  const data = await trackEvent({
    session_token: body.session_token,
    page_path: String(body.page_path),
    page_title: typeof body.page_title === 'string' ? body.page_title : undefined,
    event_type: String(body.event_type),
    locale: typeof body.locale === 'string' ? body.locale : undefined,
    referrer: typeof body.referrer === 'string' ? body.referrer : undefined,
    source: typeof body.source === 'string' ? body.source : undefined,
    medium: typeof body.medium === 'string' ? body.medium : undefined,
    campaign: typeof body.campaign === 'string' ? body.campaign : undefined,
    metadata: typeof body.metadata === 'object' && body.metadata ? body.metadata : {},
    user_agent: headerStore.get('user-agent') ?? '',
    ip: headerStore.get('x-forwarded-for') ?? '',
  });
  return NextResponse.json(data);
}
