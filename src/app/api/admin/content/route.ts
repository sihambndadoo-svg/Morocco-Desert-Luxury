import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { upsertContentBlock } from '@/lib/services/content';
import { addRecentActivity } from '@/lib/services/activity';

export async function POST(request: Request) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const body = await request.json().catch(() => null);
  try {
    await upsertContentBlock(body);
    await addRecentActivity('content_saved', `Content block saved for ${body?.block_key}`, 'content', body?.block_key, body ?? {}, 'owner-dashboard');
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Content save failed.' }, { status: 500 });
  }
}
