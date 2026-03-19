import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { getBookingById } from '@/lib/services/bookings';
import { sendCustomerBookingEmail } from '@/lib/services/email';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const template = body?.template;
  if (!['bookingReceived', 'confirmed', 'declined', 'cancelled'].includes(template)) {
    return NextResponse.json({ error: 'Invalid email template.' }, { status: 400 });
  }

  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });

  try {
    const result = await sendCustomerBookingEmail(booking, template);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Email send failed.' }, { status: 500 });
  }
}
