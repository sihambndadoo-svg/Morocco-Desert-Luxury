import { AdminShell } from '@/components/admin/admin-shell';
import { SimpleAdminForm } from '@/components/admin/simple-admin-form';
import { fetchContentBlocks } from '@/lib/services/content';

export default async function AdminContentPage() {
  const blocks = await fetchContentBlocks();
  return (
    <AdminShell title="Content blocks" description="Use locale-aware content blocks for homepage edits, FAQ additions, banners, and other editable marketing sections.">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SimpleAdminForm endpoint="/api/admin/content" title="Upsert content block" description="Content blocks are flexible records with a block key, locale, title, body, and structured data payload." defaultJson={JSON.stringify({ block_key: 'seasonal-banner', locale: 'en', title: 'Spring dune light', body: 'Selected March dates now available for private camp stays and sunset camel rides.', data: { ctaLabel: 'Book spring dates', ctaHref: '/en/booking' }, is_active: true }, null, 2)} />
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
          <h2 className="font-serif text-2xl">Current content blocks</h2>
          <div className="mt-5 grid gap-4">
            {blocks.map((block: any) => <div key={block.id} className="rounded-2xl border border-black/5 bg-stone-50 px-5 py-4 text-sm dark:border-white/10 dark:bg-stone-900/60"><div className="font-semibold text-stone-900 dark:text-white">{block.block_key} · {block.locale}</div><div className="mt-1 text-stone-500">{block.title}</div><div className="mt-2 text-stone-600 dark:text-stone-300">{block.body}</div></div>)}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
