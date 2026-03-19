import { AdminShell } from '@/components/admin/admin-shell';
import { getAnalyticsSummary } from '@/lib/services/analytics';

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalyticsSummary();
  return (
    <AdminShell title="Analytics" description="Sessions, page views, conversions, top pages, traffic sources, and recent tracked events.">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Sessions', analytics.sessionCount],
          ['Page views', analytics.pageViews],
          ['Booking conversions', analytics.bookingConversions],
          ['Message conversions', analytics.messageConversions],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[1.75rem] border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-stone-950/60">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">{label}</p>
            <p className="mt-3 font-serif text-4xl">{value}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
          <h2 className="font-serif text-2xl">Top pages</h2>
          <div className="mt-5 grid gap-3 text-sm">
            {analytics.topPages.map((page) => <div key={page.page_path} className="flex items-center justify-between rounded-2xl border border-black/5 bg-stone-50 px-4 py-3 dark:border-white/10 dark:bg-stone-900/60"><span>{page.page_path}</span><span className="font-semibold">{page.count}</span></div>)}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
          <h2 className="font-serif text-2xl">Top sources</h2>
          <div className="mt-5 grid gap-3 text-sm">
            {analytics.topSources.map((source) => <div key={source.source} className="flex items-center justify-between rounded-2xl border border-black/5 bg-stone-50 px-4 py-3 dark:border-white/10 dark:bg-stone-900/60"><span>{source.source}</span><span className="font-semibold">{source.count}</span></div>)}
          </div>
        </div>
      </section>
      <section className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
        <h2 className="font-serif text-2xl">Recent events</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-stone-500"><tr><th className="pb-3">Time</th><th className="pb-3">Type</th><th className="pb-3">Page</th><th className="pb-3">Source</th><th className="pb-3">Locale</th></tr></thead>
            <tbody>
              {analytics.recentEvents.map((event: any) => <tr key={event.id} className="border-t border-black/5 dark:border-white/10"><td className="py-3">{new Date(event.created_at).toLocaleString()}</td><td className="py-3">{event.event_type}</td><td className="py-3">{event.page_path}</td><td className="py-3">{event.source}</td><td className="py-3">{event.locale}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
