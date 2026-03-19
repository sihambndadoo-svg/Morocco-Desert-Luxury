import { AdminShell } from '@/components/admin/admin-shell';
import { SimpleAdminForm } from '@/components/admin/simple-admin-form';
import { ExperienceBasePriceForm } from '@/components/admin/experience-base-price-form';
import { fetchExperiences } from '@/lib/services/experiences';
import { fetchPricingRules } from '@/lib/services/pricing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const categoryLabels: Record<string, string> = {
  camp: 'Camp stays',
  camel: 'Camel experiences',
  quad: 'Quad / ATV',
  fourByFour: '4x4 journeys',
  transfer: 'Transfers',
  multiDay: 'Multi-day tours',
  romantic: 'Romantic experiences',
  family: 'Family experiences',
  photography: 'Photography & private sunset',
};

export default async function AdminPricingPage() {
  const [experiences, pricingRules] = await Promise.all([
    fetchExperiences({ activeOnly: false }),
    fetchPricingRules(),
  ]);

  const grouped = Object.entries(
    experiences.reduce<Record<string, typeof experiences>>((acc, experience) => {
      const bucket = categoryLabels[experience.category] ?? 'Other experiences';
      acc[bucket] = acc[bucket] ?? [];
      acc[bucket].push(experience);
      return acc;
    }, {}),
  );

  const counts = {
    total: experiences.length,
    home: experiences.filter((item) => item.showOnHome && item.active).length,
    primary: experiences.filter((item) => item.showOnBookingPrimary && item.active).length,
    extras: experiences.filter((item) => item.showOnBookingExtras && item.active).length,
  };

  return (
    <AdminShell
      title="Pricing, visibility, and experience cards"
      description="Control live public prices, whether an experience appears on the homepage or booking flow, shortlist order, and hero image links without editing code."
    >
      <section className="grid gap-4 xl:grid-cols-4">
        {[
          ['Total experiences', counts.total],
          ['Shown on homepage', counts.home],
          ['Shown in main booking', counts.primary],
          ['Shown in extra services', counts.extras],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[1.6rem] border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-[#15110d]">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-300">{label}</div>
            <div className="mt-3 font-serif text-4xl text-stone-950 dark:text-white">{value}</div>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        {grouped.map(([label, items]) => (
          <div key={label} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-stone-950 dark:text-white">{label}</h2>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">Organise the live website from here: pricing, visibility, shortlist, and image preview.</p>
              </div>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 dark:bg-white/10 dark:text-stone-200">
                {items.length} items
              </span>
            </div>
            <div className="grid gap-4 2xl:grid-cols-2">
              {items.map((experience) => (
                <ExperienceBasePriceForm key={experience.slug} experience={experience} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SimpleAdminForm
          endpoint="/api/admin/pricing"
          title="Create or update an advanced pricing rule"
          description="Use this for weekend surcharges, seasonal rates, festive periods, or one-off price overrides."
          defaultJson={JSON.stringify(
            {
              type: 'pricing_rule',
              experience_slug: 'luxury-desert-camp-1-night',
              rule_name: 'Spring demand uplift',
              rule_type: 'date_range',
              start_date: '2026-03-20',
              end_date: '2026-03-25',
              amount_mode: 'surcharge',
              adult_amount: 35,
              child_amount: 20,
              private_surcharge: 40,
              is_active: true,
              priority: 120,
              notes: 'Higher demand week',
            },
            null,
            2,
          )}
        />
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-[#15110d]">
          <h2 className="font-serif text-2xl text-stone-950 dark:text-white">Active pricing rules</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-stone-500 dark:text-stone-300">
                <tr>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Experience</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Mode</th>
                  <th className="pb-3">Adult</th>
                  <th className="pb-3">Dates</th>
                </tr>
              </thead>
              <tbody>
                {pricingRules.map((rule: any) => (
                  <tr key={rule.id} className="border-t border-black/5 dark:border-white/10">
                    <td className="py-3 text-stone-900 dark:text-white">{rule.rule_name}</td>
                    <td className="py-3 text-stone-600 dark:text-stone-300">{rule.experience_slug}</td>
                    <td className="py-3">{rule.rule_type}</td>
                    <td className="py-3">{rule.amount_mode}</td>
                    <td className="py-3">{rule.adult_amount}</td>
                    <td className="py-3">{rule.specific_date ?? `${rule.start_date ?? '—'} → ${rule.end_date ?? '—'}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
