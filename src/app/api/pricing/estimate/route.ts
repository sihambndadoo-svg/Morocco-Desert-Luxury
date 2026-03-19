import { NextResponse } from 'next/server';
import { calculateBookingEstimate } from '@/lib/services/pricing';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  try {
    const estimate = await calculateBookingEstimate(body ?? {});
    return NextResponse.json(estimate);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not calculate estimate.' }, { status: 500 });
  }
}
