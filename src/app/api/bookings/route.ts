import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/validators/forms';
import { createBooking } from '@/lib/services/bookings';
import { trackEvent } from '@/lib/services/analytics';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid booking data.' }, { status: 400 });
  }

  try {
    const booking = await createBooking(parsed.data);
    const headerStore = await headers();
    await trackEvent({
      session_token: parsed.data.session_token,
      page_path: '/booking',
      page_title: 'Booking conversion',
      event_type: 'booking_conversion',
      locale: parsed.data.preferred_language,
      referrer: parsed.data.referrer,
      source: parsed.data.source,
      medium: parsed.data.medium,
      campaign: parsed.data.campaign,
      metadata: { booking_reference: booking.booking_reference, experience_slug: parsed.data.experience_slug },
      user_agent: headerStore.get('user-agent') ?? '',
      ip: headerStore.get('x-forwarded-for') ?? '',
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Booking submission failed.' }, { status: 500 });
  }
}
