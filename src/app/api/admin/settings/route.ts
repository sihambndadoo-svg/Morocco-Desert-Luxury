import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { upsertSetting } from '@/lib/services/content';
import { addRecentActivity } from '@/lib/services/activity';

export async function POST(request: Request) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const body = await request.json().catch(() => null);
  if (!body?.key) return NextResponse.json({ error: 'key is required.' }, { status: 400 });
  try {
    await upsertSetting(body.key, body.value, 'owner-dashboard');
    await addRecentActivity('setting_saved', `Setting saved for ${body.key}`, 'setting', body.key, body ?? {}, 'owner-dashboard');
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Setting save failed.' }, { status: 500 });
  }
}
