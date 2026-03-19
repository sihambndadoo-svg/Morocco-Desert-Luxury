import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { exportBookingsCsv } from '@/lib/services/bookings';

export async function GET() {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const csv = await exportBookingsCsv();
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="morocco-desert-luxury-bookings.csv"',
    },
  });
}
