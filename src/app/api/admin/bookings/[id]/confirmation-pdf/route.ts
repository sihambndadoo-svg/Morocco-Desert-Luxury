import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { getBookingById } from '@/lib/services/bookings';
import { generateBookingConfirmationPdf } from '@/lib/services/pdf';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  const pdf = await generateBookingConfirmationPdf(booking);
  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${booking.booking_reference}.pdf"`,
    },
  });
}
