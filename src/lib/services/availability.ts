import { endOfMonth, format, parseISO, startOfMonth } from 'date-fns';
import { getServiceSupabase } from '@/lib/supabase/server';
import { AvailabilityCalendarDay, AvailabilityRecord } from '@/types';
import { getDateRange, getInclusiveDateRange } from '@/lib/utils';
import { fetchExperienceBySlug } from '@/lib/services/experiences';

export type DerivedAvailabilityDay = AvailabilityCalendarDay;

const blockingStatuses: AvailabilityRecord['status'][] = ['blocked', 'maintenance', 'private_use', 'fully_booked'];
const activeBookingStatuses = ['pending', 'confirmed', 'completed'];

export async function fetchAvailability(experienceSlug: string, startDate: string, endDate?: string) {
  const supabase = getServiceSupabase();
  if (!supabase) return [] as AvailabilityRecord[];
  const range = getInclusiveDateRange(startDate, endDate);
  if (!range.length) return [];
  const { data } = await supabase
    .from('availability_calendar')
    .select('*')
    .eq('experience_slug', experienceSlug)
    .gte('date', range[0])
    .lte('date', range[range.length - 1])
    .order('date', { ascending: true });
  return (data ?? []) as AvailabilityRecord[];
}

async function fetchBookingDemand(experienceSlug: string, startDate: string, endDate?: string) {
  const supabase = getServiceSupabase();
  if (!supabase) return new Map<string, number>();

  const { data } = await supabase
    .from('booking_requests')
    .select('experience_slug, check_in_date, check_out_date, preferred_date, guest_count, booking_status')
    .eq('experience_slug', experienceSlug)
    .in('booking_status', activeBookingStatuses);

  const bookingMap = new Map<string, number>();
  const latestDate = endDate ?? startDate;

  for (const booking of data ?? []) {
    const start = booking.check_in_date ?? booking.preferred_date;
    const end = booking.check_out_date ?? booking.preferred_date ?? undefined;
    if (!start) continue;

    for (const date of getDateRange(start, end)) {
      if (date < startDate) continue;
      if (date > latestDate) continue;
      bookingMap.set(date, (bookingMap.get(date) ?? 0) + Number(booking.guest_count ?? 1));
    }
  }
  return bookingMap;
}

export async function deriveAvailabilityWindow(options: {
  experienceSlug: string;
  startDate: string;
  endDate?: string;
}) {
  const experience = await fetchExperienceBySlug(options.experienceSlug);
  const range = getInclusiveDateRange(options.startDate, options.endDate);
  const records = await fetchAvailability(options.experienceSlug, options.startDate, options.endDate);
  const bookingsByDate = await fetchBookingDemand(options.experienceSlug, options.startDate, options.endDate);
  const recordMap = new Map(records.map((record) => [record.date, record]));
  const fallbackCapacity = experience?.capacityDefault ?? null;
  const fallbackUnits = experience?.unitCapacityDefault ?? null;

  const days: DerivedAvailabilityDay[] = range.map((date) => {
    const record = recordMap.get(date);
    const bookedCount = bookingsByDate.get(date) ?? 0;
    const guestCapacity = record?.guest_capacity ?? fallbackCapacity;
    const baseRemaining = record?.remaining_capacity ?? guestCapacity;
    const effectiveRemaining = typeof baseRemaining === 'number' ? Math.max(baseRemaining - bookedCount, 0) : null;

    const unitCapacity = record?.unit_capacity ?? fallbackUnits;
    const baseUnitsRemaining = record?.units_remaining ?? unitCapacity;
    const effectiveUnitsRemaining = typeof baseUnitsRemaining === 'number' ? Math.max(baseUnitsRemaining, 0) : null;

    let displayStatus: AvailabilityRecord['status'] = record?.status ?? 'available';
    if (blockingStatuses.includes(displayStatus)) {
      displayStatus = displayStatus;
    } else if (
      (typeof effectiveRemaining === 'number' && effectiveRemaining <= 0) ||
      (typeof effectiveUnitsRemaining === 'number' && effectiveUnitsRemaining <= 0)
    ) {
      displayStatus = 'fully_booked';
    } else if (
      displayStatus === 'limited' ||
      (typeof effectiveRemaining === 'number' &&
        typeof guestCapacity === 'number' &&
        guestCapacity > 0 &&
        effectiveRemaining <= Math.max(1, Math.ceil(guestCapacity * 0.35)))
    ) {
      displayStatus = 'limited';
    } else {
      displayStatus = 'available';
    }

    return {
      id: record?.id,
      experience_slug: options.experienceSlug,
      date,
      status: record?.status ?? displayStatus,
      guest_capacity: guestCapacity,
      remaining_capacity: record?.remaining_capacity ?? guestCapacity,
      unit_capacity: unitCapacity,
      units_remaining: record?.units_remaining ?? unitCapacity,
      waitlist_enabled: record?.waitlist_enabled ?? false,
      notes: record?.notes ?? null,
      booked_count: bookedCount,
      effective_remaining_capacity: effectiveRemaining,
      display_status: displayStatus,
    };
  });

  return { days, experience };
}

export async function checkAvailability(options: {
  experienceSlug: string;
  startDate: string;
  endDate?: string;
  guestCount?: number;
}) {
  const experience = await fetchExperienceBySlug(options.experienceSlug);
  const dates = experience?.category === 'camp'
    ? getDateRange(options.startDate, options.endDate)
    : getInclusiveDateRange(options.startDate, options.endDate);
  if (!dates.length) {
    return { available: false, reason: 'No valid dates supplied.', records: [] as DerivedAvailabilityDay[] };
  }

  const { days } = await deriveAvailabilityWindow({
    experienceSlug: options.experienceSlug,
    startDate: dates[0],
    endDate: dates[dates.length - 1],
  });

  for (const day of days) {
    if (blockingStatuses.includes(day.display_status)) {
      return { available: false, reason: `Unavailable on ${day.date}.`, records: days };
    }
    if (
      typeof options.guestCount === 'number' &&
      typeof day.effective_remaining_capacity === 'number' &&
      day.effective_remaining_capacity < options.guestCount
    ) {
      return { available: false, reason: `Fully booked on ${day.date}.`, records: days };
    }
  }

  return {
    available: true,
    reason: experience ? null : 'Experience not found.',
    records: days,
    capacityDefault: experience?.capacityDefault ?? null,
  };
}

export async function fetchMonthlyAvailability(experienceSlug: string, month: string) {
  const anchor = parseISO(`${month}-01`);
  const startDate = format(startOfMonth(anchor), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(anchor), 'yyyy-MM-dd');
  const { days } = await deriveAvailabilityWindow({ experienceSlug, startDate, endDate });
  return days;
}

export async function upsertAvailabilityRange(payload: {
  experience_slug: string;
  start_date: string;
  end_date: string;
  status: AvailabilityRecord['status'];
  guest_capacity?: number | null;
  remaining_capacity?: number | null;
  unit_capacity?: number | null;
  units_remaining?: number | null;
  waitlist_enabled?: boolean;
  notes?: string | null;
}) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const rows = getInclusiveDateRange(payload.start_date, payload.end_date).map((date) => ({
    experience_slug: payload.experience_slug,
    date,
    status: payload.status,
    guest_capacity: payload.guest_capacity ?? null,
    remaining_capacity: payload.remaining_capacity ?? null,
    unit_capacity: payload.unit_capacity ?? null,
    units_remaining: payload.units_remaining ?? null,
    waitlist_enabled: payload.waitlist_enabled ?? false,
    notes: payload.notes ?? null,
  }));
  if (!rows.length) throw new Error('Please choose a valid date range.');
  const { error } = await supabase.from('availability_calendar').upsert(rows, {
    onConflict: 'experience_slug,date',
  });
  if (error) throw error;
}

export async function deleteAvailabilityRange(payload: {
  experience_slug: string;
  start_date: string;
  end_date: string;
}) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const range = getInclusiveDateRange(payload.start_date, payload.end_date);
  if (!range.length) throw new Error('Please choose a valid date range.');
  const { error } = await supabase
    .from('availability_calendar')
    .delete()
    .eq('experience_slug', payload.experience_slug)
    .gte('date', range[0])
    .lte('date', range[range.length - 1]);
  if (error) throw error;
}

export async function listAvailabilityRecords(limit = 120, experienceSlug?: string) {
  const supabase = getServiceSupabase();
  if (!supabase) return [] as AvailabilityRecord[];
  let query = supabase
    .from('availability_calendar')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);
  if (experienceSlug) query = query.eq('experience_slug', experienceSlug);
  const { data } = await query;
  return (data ?? []) as AvailabilityRecord[];
}
