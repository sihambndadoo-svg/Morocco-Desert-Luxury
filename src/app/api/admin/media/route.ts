import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { upsertMediaAsset } from '@/lib/services/media';
import { addRecentActivity } from '@/lib/services/activity';

export async function POST(request: Request) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const body = await request.json().catch(() => null);
  try {
    await upsertMediaAsset(body);
    await addRecentActivity('media_saved', `Media asset saved for ${body?.key}`, 'media', body?.key, body ?? {}, 'owner-dashboard');
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Media save failed.' }, { status: 500 });
  }
}
