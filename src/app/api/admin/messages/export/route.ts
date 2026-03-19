import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { exportMessagesCsv } from '@/lib/services/contact';

export async function GET() {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const csv = await exportMessagesCsv();
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="morocco-desert-luxury-messages.csv"',
    },
  });
}
