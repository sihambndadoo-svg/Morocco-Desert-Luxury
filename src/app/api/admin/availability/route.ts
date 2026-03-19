import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { deleteAvailabilityRange, upsertAvailabilityRange } from '@/lib/services/availability';
import { addRecentActivity } from '@/lib/services/activity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const body = await request.json().catch(() => null);
  try {
    await upsertAvailabilityRange(body);
    await addRecentActivity(
      'availability_updated',
      `Availability updated for ${body?.experience_slug}`,
      'availability',
      body?.experience_slug,
      body ?? {},
      'owner-dashboard'
    );
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Availability update failed.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const body = await request.json().catch(() => null);
  try {
    await deleteAvailabilityRange(body);
    await addRecentActivity(
      'availability_cleared',
      `Availability override cleared for ${body?.experience_slug}`,
      'availability',
      body?.experience_slug,
      body ?? {},
      'owner-dashboard'
    );
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Availability clear failed.' },
      { status: 500 }
    );
  }
}
