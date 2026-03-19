export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { fetchMonthlyAvailability } from '@/lib/services/availability';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const experience = url.searchParams.get('experience');
  const month = url.searchParams.get('month');

  if (!experience || !month) {
    return NextResponse.json({ error: 'experience and month are required.' }, { status: 400 });
  }

  const days = await fetchMonthlyAvailability(experience, month);
  return NextResponse.json({ days }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
