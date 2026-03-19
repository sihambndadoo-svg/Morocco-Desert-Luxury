import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { fetchMonthlyAvailability } from '@/lib/services/availability';
import { fetchExperienceBySlug } from '@/lib/services/experiences';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;

  const url = new URL(request.url);
  const experience = url.searchParams.get('experience');
  const month = url.searchParams.get('month');

  if (!experience || !month) {
    return NextResponse.json({ error: 'experience and month are required.' }, { status: 400 });
  }

  const [days, experienceData] = await Promise.all([
    fetchMonthlyAvailability(experience, month),
    fetchExperienceBySlug(experience),
  ]);

  const counts = days.reduce(
    (acc, day) => {
      acc[day.display_status] += 1;
      return acc;
    },
    {
      available: 0,
      limited: 0,
      fully_booked: 0,
      blocked: 0,
      maintenance: 0,
      private_use: 0,
    } as Record<string, number>
  );

  return NextResponse.json(
    {
      days,
      counts,
      defaults: {
        guest_capacity: experienceData?.capacityDefault ?? null,
        unit_capacity: experienceData?.unitCapacityDefault ?? null,
      },
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
