'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Locale } from '@/types';
import { cn, formatDate } from '@/lib/utils';

type DayStatus = {
  date: string;
  display_status: 'available' | 'limited' | 'fully_booked' | 'blocked' | 'maintenance' | 'private_use';
  effective_remaining_capacity?: number | null;
  waitlist_enabled?: boolean;
  notes?: string | null;
};

const statusStyles: Record<DayStatus['display_status'], string> = {
  available: 'ecl-status-available',
  limited: 'ecl-status-limited',
  fully_booked: 'ecl-status-full',
  blocked: 'ecl-status-blocked',
  maintenance: 'ecl-status-maintenance',
  private_use: 'ecl-status-private',
};

function toMonthKey(date: Date) {
  return format(date, 'yyyy-MM');
}

function isBlocked(status?: DayStatus['display_status']) {
  return status === 'fully_booked' || status === 'blocked' || status === 'maintenance' || status === 'private_use';
}

export function AvailabilityDatePicker({
  label,
  experienceSlug,
  locale,
  value,
  onChange,
  guestCount,
  minDate,
}: {
  label: string;
  experienceSlug: string;
  locale: Locale;
  value: string;
  onChange: (value: string) => void;
  guestCount: number;
  minDate?: string;
}) {
  const [month, setMonth] = useState(() => toMonthKey(value ? parseISO(value) : new Date()));
  const [days, setDays] = useState<DayStatus[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!experienceSlug) return;
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/availability/month?experience=${encodeURIComponent(experienceSlug)}&month=${encodeURIComponent(month)}`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then((response) => response.json())
      .then((data) => {
        if (!controller.signal.aborted) {
          setDays(data.days ?? []);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setDays([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [experienceSlug, month]);

  const dayMap = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);
  const monthDate = parseISO(`${month}-01`);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 }),
  });

  const minimumDate = minDate ? parseISO(minDate) : null;

  return (
    <div className="space-y-3 rounded-[1.75rem] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,243,235,0.96))] p-4 shadow-[0_18px_48px_-30px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(25,20,15,0.98),rgba(14,12,10,0.98))]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{label}</p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-300">
            {value ? formatDate(value, locale) : 'Choose an available date'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMonth(toMonthKey(addMonths(monthDate, -1)))} className="rounded-full border border-black/10 bg-white p-2 text-stone-700 hover:border-stone-300 dark:border-white/10 dark:bg-[#191411] dark:text-stone-100">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setMonth(toMonthKey(addMonths(monthDate, 1)))} className="rounded-full border border-black/10 bg-white p-2 text-stone-700 hover:border-stone-300 dark:border-white/10 dark:bg-[#191411] dark:text-stone-100">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-[#17120f]">
        <span className="font-medium text-stone-900 dark:text-white">
          {new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : locale, { month: 'long', year: 'numeric' }).format(monthDate)}
        </span>
        <div className="mt-1 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full px-3 py-1 ecl-status-available">Available</span>
          <span className="rounded-full px-3 py-1 ecl-status-limited">Limited</span>
          <span className="rounded-full px-3 py-1 ecl-status-full">Fully booked</span>
          <span className="rounded-full px-3 py-1 ecl-status-blocked">Blocked</span>
          <span className="rounded-full px-3 py-1 ecl-status-maintenance">Maintenance</span>
          <span className="rounded-full px-3 py-1 ecl-status-private">Private use</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-300">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((dayName) => (
          <div key={dayName} className="py-2">{dayName}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const status = dayMap.get(key);
          const outOfMonth = !isSameMonth(day, monthDate);
          const beforeMin = minimumDate ? isBefore(day, minimumDate) && !isSameDay(day, minimumDate) : false;
          const blocked =
            beforeMin ||
            isBlocked(status?.display_status) ||
            (typeof status?.effective_remaining_capacity === 'number' && status.effective_remaining_capacity < guestCount);
          const selected = value ? isSameDay(parseISO(value), day) : false;
          const tone = status ? statusStyles[status.display_status] : statusStyles.available;
          return (
            <button
              key={key}
              type="button"
              disabled={blocked || outOfMonth}
              onClick={() => onChange(key)}
              className={cn(
                'relative min-h-[74px] rounded-2xl border p-2 text-left transition',
                outOfMonth && 'cursor-not-allowed opacity-35',
                !outOfMonth && !blocked && 'hover:-translate-y-0.5 hover:shadow-sm',
                blocked && !outOfMonth && 'cursor-not-allowed opacity-90',
                tone,
                selected && 'ring-2 ring-stone-900 ring-offset-2 dark:ring-amber-300 dark:ring-offset-stone-950',
              )}
              title={status?.notes ?? key}
            >
              <span className="text-sm font-semibold">{format(day, 'd')}</span>
              {!outOfMonth ? (
                <span className="mt-2 block text-[11px] font-semibold leading-4 opacity-95">
                  {status?.display_status === 'maintenance' ? 'Maintenance' : status?.display_status === 'private_use' ? 'Private' : blocked ? 'Full' : status?.display_status === 'limited' ? 'Limited' : 'Open'}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="text-xs leading-6 text-stone-600 dark:text-stone-300">
        {loading
          ? 'Refreshing live availability…'
          : 'Green dates are available, amber dates are limited, red dates are full or blocked, grey dates are maintenance, and purple dates are private use.'}
      </p>
    </div>
  );
}
