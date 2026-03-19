import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { addOwnerNote } from '@/lib/services/bookings';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body?.note || typeof body.note !== 'string') {
    return NextResponse.json({ error: 'A note is required.' }, { status: 400 });
  }

  try {
    const booking = await addOwnerNote(id, body.note, 'owner-dashboard');
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Note save failed.' }, { status: 500 });
  }
}
