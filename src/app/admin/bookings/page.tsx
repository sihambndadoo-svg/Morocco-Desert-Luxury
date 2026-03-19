import Link from 'next/link';
import { AdminShell } from '@/components/admin/admin-shell';
import { listBookings } from '@/lib/services/bookings';
import { formatCurrency } from '@/lib/utils';

export default async function AdminBookingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const status = typeof query.status === 'string' ? query.status : undefined;
  const search = typeof query.search === 'string' ? query.search : undefined;
  const bookings = await listBookings({ status, search });

  return (
    <AdminShell title="Bookings" description="Search, filter, export, and inspect booking requests in detail.">
      <section className="flex flex-wrap items-end gap-4 rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
        <form className="flex flex-wrap items-end gap-4" action="/admin/bookings" method="get">
          <label className="grid gap-2 text-sm font-medium">
            Search
            <input name="search" defaultValue={search} placeholder="Reference, guest, email" className="rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-stone-900" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Status
            <select name="status" defaultValue={status} className="rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-stone-900">
              <option value="">All statuses</option>
              {['pending','confirmed','declined','cancelled','completed'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <button className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white dark:bg-amber-300 dark:text-stone-950">Apply filters</button>
        </form>
        <a href="/api/admin/bookings/export" className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold dark:border-white/10">Export CSV</a>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white dark:border-white/10 dark:bg-stone-950/60">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 dark:bg-stone-900/60">
              <tr>
                {['Reference','Guest','Experience','Date','Guests','Total','Booking','Payment','Source'].map((label) => <th key={label} className="px-5 py-4">{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any) => (
                <tr key={booking.id} className="border-t border-black/5 dark:border-white/10">
                  <td className="px-5 py-4"><Link href={`/admin/bookings/${booking.id}` as any} className="font-semibold underline underline-offset-4">{booking.booking_reference}</Link></td>
                  <td className="px-5 py-4">{booking.full_name}<div className="text-xs text-stone-500">{booking.email}</div></td>
                  <td className="px-5 py-4">{booking.experience_name}</td>
                  <td className="px-5 py-4">{booking.check_in_date ?? booking.preferred_date ?? '—'}</td>
                  <td className="px-5 py-4">{booking.guest_count}</td>
                  <td className="px-5 py-4">{formatCurrency(Number(booking.estimated_total ?? 0), booking.currency ?? 'EUR')}</td>
                  <td className="px-5 py-4">{booking.booking_status}</td>
                  <td className="px-5 py-4">{booking.payment_status}</td>
                  <td className="px-5 py-4">{booking.source ?? 'direct'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
