import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { updateBookingStatus } from '@/lib/services/bookings';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const body = await request.json().catch(() => null);

  try {
    const booking = await updateBookingStatus({
      id,
      booking_status: body?.booking_status,
      payment_status: body?.payment_status,
      owner_notes: body?.owner_notes,
      changed_by: 'owner-dashboard',
      send_email: Boolean(body?.send_email),
    });
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Status update failed.' }, { status: 500 });
  }
}
