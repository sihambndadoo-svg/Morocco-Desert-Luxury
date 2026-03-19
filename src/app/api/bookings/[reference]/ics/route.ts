import { NextResponse } from 'next/server';
import { getBookingByReference } from '@/lib/services/bookings';
import { generateBookingIcs } from '@/lib/services/ics';

export async function GET(_: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const booking = await getBookingByReference(reference);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  const ics = generateBookingIcs(booking);
  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${booking.booking_reference}.ics"`,
    },
  });
}
