'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import {
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react';
import { AvailabilityCalendarDay, AvailabilityRecord, Experience } from '@/types';
import { cn, formatDate, getLocalizedText } from '@/lib/utils';

const statusOptions: Array<{ value: AvailabilityRecord['status']; label: string; tone: string; calendarTone: string }> = [
  {
    value: 'available',
    label: 'Available',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100',
    calendarTone: 'border-emerald-300 bg-emerald-100 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-100',
  },
  {
    value: 'limited',
    label: 'Limited',
    tone: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100',
    calendarTone: 'border-amber-300 bg-amber-100 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-100',
  },
  {
    value: 'fully_booked',
    label: 'Fully booked',
    tone: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100',
    calendarTone: 'border-rose-300 bg-rose-100 text-rose-950 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-100',
  },
  {
    value: 'blocked',
    label: 'Blocked',
    tone: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100',
    calendarTone: 'border-rose-300 bg-rose-100 text-rose-950 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-100',
  },
  {
    value: 'maintenance',
    label: 'Maintenance',
    tone: 'border-stone-200 bg-stone-100 text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100',
    calendarTone: 'border-stone-300 bg-stone-100 text-stone-950 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100',
  },
  {
    value: 'private_use',
    label: 'Private use',
    tone: 'border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-100',
    calendarTone: 'border-violet-300 bg-violet-100 text-violet-950 dark:border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-100',
  },
];

const defaultCounts = {
  available: 0,
  limited: 0,
  fully_booked: 0,
  blocked: 0,
  maintenance: 0,
  private_use: 0,
};

type MonthPayload = {
  days: AvailabilityCalendarDay[];
  counts: Record<string, number>;
  defaults: {
    guest_capacity: number | null;
    unit_capacity: number | null;
  };
};

function monthKey(date: Date) {
  return format(date, 'yyyy-MM');
}

function numericValue(value: string) {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function labelForStatus(status: AvailabilityRecord['status']) {
  return statusOptions.find((option) => option.value === status)?.label ?? status;
}

export function AdminAvailabilityManager({ experiences }: { experiences: Experience[] }) {
  const [experienceSlug, setExperienceSlug] = useState(experiences[0]?.slug ?? '');
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const [days, setDays] = useState<AvailabilityCalendarDay[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>(defaultCounts);
  const [defaults, setDefaults] = useState<{ guest_capacity: number | null; unit_capacity: number | null }>({
    guest_capacity: null,
    unit_capacity: null,
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
    status: 'available' as AvailabilityRecord['status'],
    guest_capacity: '',
    remaining_capacity: '',
    unit_capacity: '',
    units_remaining: '',
    waitlist_enabled: false,
    notes: '',
  });

  const activeExperience = useMemo(
    () => experiences.find((experience) => experience.slug === experienceSlug) ?? experiences[0] ?? null,
    [experiences, experienceSlug]
  );

  const dayMap = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);
  const monthDate = parseISO(`${month}-01`);
  const calendarDays = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 }),
      }),
    [monthDate]
  );

  async function loadMonth() {
    if (!experienceSlug) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/availability/month?experience=${encodeURIComponent(experienceSlug)}&month=${encodeURIComponent(month)}`,
        { cache: 'no-store' }
      );
      const payload = (await response.json()) as MonthPayload;
      if (!response.ok) throw new Error((payload as any)?.error ?? 'Could not load availability month.');
      setDays(payload.days ?? []);
      setCounts({ ...defaultCounts, ...(payload.counts ?? {}) });
      setDefaults(payload.defaults ?? { guest_capacity: null, unit_capacity: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load availability month.');
      setDays([]);
      setCounts(defaultCounts);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMonth();
  }, [experienceSlug, month]);

  function prefillFromDay(date: string) {
    const day = dayMap.get(date);
    setSelectedDay(date);
    setMessage(null);
    setError(null);
    setForm({
      start_date: date,
      end_date: date,
      status: day?.status ?? day?.display_status ?? 'available',
      guest_capacity: day?.guest_capacity != null ? String(day.guest_capacity) : defaults.guest_capacity != null ? String(defaults.guest_capacity) : '',
      remaining_capacity: day?.remaining_capacity != null ? String(day.remaining_capacity) : '',
      unit_capacity: day?.unit_capacity != null ? String(day.unit_capacity) : defaults.unit_capacity != null ? String(defaults.unit_capacity) : '',
      units_remaining: day?.units_remaining != null ? String(day.units_remaining) : '',
      waitlist_enabled: day?.waitlist_enabled ?? false,
      notes: day?.notes ?? '',
    });
  }

  async function saveRange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience_slug: experienceSlug,
          start_date: form.start_date,
          end_date: form.end_date || form.start_date,
          status: form.status,
          guest_capacity: numericValue(form.guest_capacity),
          remaining_capacity: numericValue(form.remaining_capacity),
          unit_capacity: numericValue(form.unit_capacity),
          units_remaining: numericValue(form.units_remaining),
          waitlist_enabled: form.waitlist_enabled,
          notes: form.notes.trim() || null,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? 'Could not save availability.');
      setMessage('Availability saved. The public booking calendar now reflects the new status and capacities.');
      await loadMonth();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save availability.');
    } finally {
      setSaving(false);
    }
  }

  async function clearRange() {
    setClearing(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch('/api/admin/availability', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience_slug: experienceSlug,
          start_date: form.start_date,
          end_date: form.end_date || form.start_date,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? 'Could not clear availability override.');
      setMessage('Availability override removed. Defaults and real booking demand are now back in control for that range.');
      await loadMonth();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not clear availability override.');
    } finally {
      setClearing(false);
    }
  }

  const upcomingOverrides = useMemo(
    () => [...days].filter((day) => day.display_status !== 'available' || day.notes || day.waitlist_enabled).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 10),
    [days]
  );

  return (
    <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="rounded-[1.9rem] p-6 ecl-surface shadow-[0_18px_48px_-30px_rgba(37,29,18,0.18)]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Availability</p>
              <h2 className="font-serif text-3xl text-stone-900 dark:text-white">Professional date controls</h2>
              <p className="max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-300">
                Manage each experience month by month, jump into future months, and publish open, limited, full, blocked, or private dates straight to the guest-facing booking calendar.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,260px)_auto_auto_auto] sm:items-center">
              <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                Experience
                <select
                  value={experienceSlug}
                  onChange={(event) => setExperienceSlug(event.target.value)}
                  className="w-full min-w-[320px] max-w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-stone-900 shadow-sm dark:border-white/10 dark:bg-stone-900 dark:text-white"
                >
                  {experiences.map((experience) => (
                    <option key={experience.slug} value={experience.slug}>
                      {getLocalizedText(experience.content.title, 'en')}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => setMonth(monthKey(addMonths(monthDate, -1)))}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-stone-700 hover:border-stone-300 dark:border-white/10 dark:bg-stone-900 dark:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setMonth(monthKey(new Date()))}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-stone-900 hover:border-stone-300 dark:border-white/10 dark:bg-stone-900 dark:text-white"
              >
                This month
              </button>
              <button
                type="button"
                onClick={() => setMonth(monthKey(addMonths(monthDate, 1)))}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-stone-700 hover:border-stone-300 dark:border-white/10 dark:bg-stone-900 dark:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {statusOptions.map((status) => (
              <div key={status.value} className={cn('rounded-2xl border px-4 py-3', status.tone)}>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{status.label}</div>
                <div className="mt-2 text-2xl font-semibold">{counts[status.value] ?? 0}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.7rem] border border-black/5 bg-stone-50/90 p-4 dark:border-white/10 dark:bg-stone-900/70">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">Viewing month</p>
                <h3 className="mt-1 font-serif text-3xl text-stone-900 dark:text-white">
                  {new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(monthDate)}
                </h3>
              </div>
              <button
                type="button"
                onClick={loadMonth}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-stone-900 hover:border-stone-300 dark:border-white/10 dark:bg-stone-950 dark:text-white"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh month
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
                <div key={dayName} className="py-2">{dayName}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const date = format(day, 'yyyy-MM-dd');
                const outOfMonth = !isSameMonth(day, monthDate);
                const availabilityDay = dayMap.get(date);
                const tone = statusOptions.find((option) => option.value === (availabilityDay?.display_status ?? 'available'))?.calendarTone;
                const selected = selectedDay ? isSameDay(parseISO(selectedDay), day) : false;

                return (
                  <button
                    key={date}
                    type="button"
                    disabled={outOfMonth}
                    onClick={() => prefillFromDay(date)}
                    className={cn(
                      'min-h-[102px] rounded-[1.35rem] border p-3 text-left transition',
                      outOfMonth && 'cursor-not-allowed opacity-35',
                      !outOfMonth && 'hover:-translate-y-0.5 hover:shadow-sm',
                      tone,
                      selected && 'ring-2 ring-stone-950 ring-offset-2 dark:ring-amber-300 dark:ring-offset-stone-950'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold">{format(day, 'd')}</span>
                      {!outOfMonth ? (
                        <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-current dark:bg-black/10">
                          {labelForStatus(availabilityDay?.display_status ?? 'available')}
                        </span>
                      ) : null}
                    </div>
                    {!outOfMonth ? (
                      <div className="mt-3 space-y-1 text-[11px] leading-4 opacity-95">
                        <div>Guests left: {availabilityDay?.effective_remaining_capacity ?? availabilityDay?.remaining_capacity ?? defaults.guest_capacity ?? '—'}</div>
                        <div>Booked: {availabilityDay?.booked_count ?? 0}</div>
                        <div>Units left: {availabilityDay?.units_remaining ?? defaults.unit_capacity ?? '—'}</div>
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <form onSubmit={saveRange} className="rounded-[1.9rem] p-6 ecl-surface shadow-[0_18px_48px_-30px_rgba(37,29,18,0.18)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Apply range</p>
              <h3 className="mt-2 font-serif text-3xl text-stone-900 dark:text-white">Make changes that reach future months</h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-300">
                Choose one date or a long future range. Every day from start to end will update immediately on the public booking form.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  guest_capacity: defaults.guest_capacity != null ? String(defaults.guest_capacity) : '',
                  unit_capacity: defaults.unit_capacity != null ? String(defaults.unit_capacity) : '',
                }))
              }
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-stone-900 hover:border-stone-300 dark:border-white/10 dark:bg-stone-900 dark:text-white"
            >
              <CalendarDays className="h-4 w-4" />
              Load default capacities
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
              Start date
              <input
                type="date"
                value={form.start_date}
                onChange={(event) => setForm((current) => ({ ...current, start_date: event.target.value }))}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 dark:border-white/10 dark:bg-stone-900 dark:text-white"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
              End date
              <input
                type="date"
                value={form.end_date}
                onChange={(event) => setForm((current) => ({ ...current, end_date: event.target.value }))}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 dark:border-white/10 dark:bg-stone-900 dark:text-white"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
              Status
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as AvailabilityRecord['status'] }))}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 dark:border-white/10 dark:bg-stone-900 dark:text-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
              Guest capacity
              <input
                type="number"
                min="0"
                value={form.guest_capacity}
                onChange={(event) => setForm((current) => ({ ...current, guest_capacity: event.target.value }))}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 dark:border-white/10 dark:bg-stone-900 dark:text-white"
                placeholder={defaults.guest_capacity != null ? String(defaults.guest_capacity) : 'Use default'}
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
              Remaining guests
              <input
                type="number"
                min="0"
                value={form.remaining_capacity}
                onChange={(event) => setForm((current) => ({ ...current, remaining_capacity: event.target.value }))}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 dark:border-white/10 dark:bg-stone-900 dark:text-white"
                placeholder="Leave blank to use capacity"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
              Unit capacity
              <input
                type="number"
                min="0"
                value={form.unit_capacity}
                onChange={(event) => setForm((current) => ({ ...current, unit_capacity: event.target.value }))}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 dark:border-white/10 dark:bg-stone-900 dark:text-white"
                placeholder={defaults.unit_capacity != null ? String(defaults.unit_capacity) : 'Optional'}
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
              Units remaining
              <input
                type="number"
                min="0"
                value={form.units_remaining}
                onChange={(event) => setForm((current) => ({ ...current, units_remaining: event.target.value }))}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 dark:border-white/10 dark:bg-stone-900 dark:text-white"
                placeholder="Optional"
              />
            </label>
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-2xl border border-black/5 bg-stone-50 px-4 py-4 text-sm text-stone-700 dark:border-white/10 dark:bg-stone-900/60 dark:text-stone-200">
            <input
              type="checkbox"
              checked={form.waitlist_enabled}
              onChange={(event) => setForm((current) => ({ ...current, waitlist_enabled: event.target.checked }))}
              className="h-4 w-4 rounded"
            />
            Enable waitlist when the date is full
          </label>

          <label className="mt-5 block space-y-2 text-sm font-medium text-stone-800 dark:text-stone-100">
            Internal note
            <textarea
              rows={4}
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              className="w-full rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 text-stone-900 dark:border-white/10 dark:bg-stone-900 dark:text-white"
              placeholder="High demand week, buyout, maintenance, wedding, VIP hold…"
            />
          </label>

          {message ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
              {message}
            </div>
          ) : null}
          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-70 dark:bg-amber-300 dark:text-stone-950 dark:hover:bg-amber-200"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save to website
            </button>
            <button
              type="button"
              disabled={clearing}
              onClick={clearRange}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-6 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-70 dark:border-rose-500/20 dark:bg-stone-950 dark:text-rose-200 dark:hover:bg-rose-500/10"
            >
              {clearing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Clear override
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <aside className="rounded-[1.9rem] p-6 ecl-surface shadow-[0_18px_48px_-30px_rgba(37,29,18,0.18)]">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Selected range</p>
            <h3 className="font-serif text-3xl text-stone-900 dark:text-white">
              {form.start_date === form.end_date ? formatDate(form.start_date, 'en') : `${formatDate(form.start_date, 'en')} → ${formatDate(form.end_date, 'en')}`}
            </h3>
            <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">
              {selectedDay
                ? `You selected ${formatDate(selectedDay, 'en')}. Click another day to prefill a new date or change the range manually.`
                : 'Click any date in the calendar to prefill the form instantly.'}
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            <div className={cn('rounded-2xl border px-4 py-3', statusOptions.find((option) => option.value === form.status)?.tone)}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">Current status</div>
              <div className="mt-2 text-lg font-semibold">{labelForStatus(form.status)}</div>
            </div>
            <div className="rounded-2xl border border-black/5 bg-stone-50/80 px-4 py-4 dark:border-white/10 dark:bg-stone-900/70">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-white">
                <CalendarRange className="h-4 w-4" />
                Experience defaults
              </div>
              <div className="mt-3 grid gap-3 text-sm text-stone-600 dark:text-stone-300 sm:grid-cols-2">
                <div>Guest capacity: <span className="font-semibold text-stone-900 dark:text-white">{defaults.guest_capacity ?? '—'}</span></div>
                <div>Unit capacity: <span className="font-semibold text-stone-900 dark:text-white">{defaults.unit_capacity ?? '—'}</span></div>
              </div>
            </div>
          </div>
        </aside>

        <aside className="rounded-[1.9rem] p-6 ecl-surface shadow-[0_18px_48px_-30px_rgba(37,29,18,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Status legend</p>
          <div className="mt-4 grid gap-3">
            {statusOptions.map((option) => (
              <div key={option.value} className={cn('rounded-2xl border px-4 py-3', option.tone)}>
                <div className="font-semibold">{option.label}</div>
                <div className="mt-1 text-sm opacity-85">
                  {option.value === 'available' ? 'Guests can book immediately.' : null}
                  {option.value === 'limited' ? 'Show urgency while still allowing booking.' : null}
                  {option.value === 'fully_booked' ? 'Show sold out on the public calendar.' : null}
                  {option.value === 'blocked' ? 'Prevent booking for any operational reason.' : null}
                  {option.value === 'maintenance' ? 'Use for camp or vehicle maintenance windows.' : null}
                  {option.value === 'private_use' ? 'Reserve dates for a full private buyout.' : null}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <aside className="rounded-[1.9rem] p-6 ecl-surface shadow-[0_18px_48px_-30px_rgba(37,29,18,0.18)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Recent records</p>
              <h3 className="mt-2 font-serif text-3xl text-stone-900 dark:text-white">Operational preview</h3>
            </div>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-100">
              {activeExperience ? getLocalizedText(activeExperience.content.title, 'en') : 'Experience'}
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {upcomingOverrides.length ? (
              upcomingOverrides.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => prefillFromDay(day.date)}
                  className="w-full rounded-2xl border border-black/5 bg-stone-50/80 px-4 py-4 text-left hover:border-stone-300 dark:border-white/10 dark:bg-stone-900/70"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-white">{formatDate(day.date, 'en')}</div>
                      <div className="mt-1 text-sm text-stone-600 dark:text-stone-300">Booked: {day.booked_count} • Guests left: {day.effective_remaining_capacity ?? day.remaining_capacity ?? '—'} • Units left: {day.units_remaining ?? '—'}</div>
                    </div>
                    <span className={cn('rounded-full border px-3 py-1 text-xs font-semibold', statusOptions.find((option) => option.value === day.display_status)?.tone)}>
                      {labelForStatus(day.display_status)}
                    </span>
                  </div>
                  {day.notes ? <div className="mt-2 text-sm text-stone-600 dark:text-stone-300">{day.notes}</div> : null}
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-black/10 px-4 py-6 text-sm text-stone-600 dark:border-white/10 dark:text-stone-300">
                No overrides yet for this month. The public booking form will use experience defaults and live booking demand until you add a custom rule here.
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
