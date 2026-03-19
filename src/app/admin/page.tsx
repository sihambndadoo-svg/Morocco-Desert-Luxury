import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { getDashboardOverview } from '@/lib/services/bookings';
import { formatCurrency } from '@/lib/utils';

export default async function AdminOverviewPage() {
  const overview = await getDashboardOverview();
  const cards = [
    { label: 'Total bookings', value: overview.totalBookings },
    { label: 'Pending bookings', value: overview.pendingBookings },
    { label: 'Confirmed bookings', value: overview.confirmedBookings },
    { label: 'Estimated revenue', value: formatCurrency(overview.estimatedRevenue) },
    { label: 'Messages', value: overview.messageCount },
    { label: 'Sessions', value: overview.sessionCount },
    { label: 'Arrivals today', value: overview.arrivalsToday },
    { label: 'Arrivals tomorrow', value: overview.arrivalsTomorrow },
    { label: 'Payment follow-ups', value: overview.paymentFollowUps },
    { label: 'Transfers scheduled', value: overview.transfersScheduled },
  ];

  return (
    <AdminShell title="Overview" description="Daily operations, booking health, customer activity, and commercial performance in one place.">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[1.75rem] border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-stone-950/60">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">{card.label}</p>
            <p className="mt-3 font-serif text-3xl">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl">Recent bookings</h2>
            <Link href="/admin/bookings" className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-stone-500">
                <tr>
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Guest</th>
                  <th className="pb-3">Experience</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentBookings.map((booking: any) => (
                  <tr key={booking.id} className="border-t border-black/5 dark:border-white/10">
                    <td className="py-3"><Link href={`/admin/bookings/${booking.id}` as any} className="font-semibold underline underline-offset-4">{booking.booking_reference}</Link></td>
                    <td className="py-3">{booking.full_name}</td>
                    <td className="py-3">{booking.experience_name}</td>
                    <td className="py-3">{booking.booking_status}</td>
                    <td className="py-3">{formatCurrency(Number(booking.estimated_total ?? 0), booking.currency ?? 'EUR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
            <h2 className="font-serif text-2xl">Top sources</h2>
            <div className="mt-5 grid gap-3 text-sm">
              {overview.topSources.length ? overview.topSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between rounded-2xl border border-black/5 bg-stone-50 px-4 py-3 dark:border-white/10 dark:bg-stone-900/60">
                  <span>{source.source}</span>
                  <span className="font-semibold">{source.count}</span>
                </div>
              )) : <p className="text-stone-500">No tracked sources yet.</p>}
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
            <h2 className="font-serif text-2xl">Recent activity</h2>
            <div className="mt-5 grid gap-4 text-sm">
              {overview.recentActivity.map((activity: any) => (
                <div key={activity.id} className="rounded-2xl border border-black/5 bg-stone-50 px-4 py-4 dark:border-white/10 dark:bg-stone-900/60">
                  <div className="font-semibold text-stone-900 dark:text-white">{activity.description}</div>
                  <div className="mt-1 text-stone-500 dark:text-stone-400">{activity.activity_type} · {new Date(activity.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl">Recent messages</h2>
          <Link href="/admin/messages" className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">Messages <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {overview.recentMessages.map((message: any) => (
            <div key={message.id} className="rounded-2xl border border-black/5 bg-stone-50 px-5 py-4 dark:border-white/10 dark:bg-stone-900/60">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-stone-900 dark:text-white">{message.full_name}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{new Date(message.created_at).toLocaleDateString()}</p>
              </div>
              <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-300">{message.subject}</p>
              <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">{message.message}</p>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
