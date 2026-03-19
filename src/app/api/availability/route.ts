export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/services/availability';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const experience = url.searchParams.get('experience');
  const startDate = url.searchParams.get('start_date');
  const endDate = url.searchParams.get('end_date') || undefined;
  const guestCount = Number(url.searchParams.get('guest_count') || '1');

  if (!experience || !startDate) {
    return NextResponse.json({ error: 'experience and start_date are required.' }, { status: 400 });
  }

  const data = await checkAvailability({ experienceSlug: experience, startDate, endDate, guestCount });
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
