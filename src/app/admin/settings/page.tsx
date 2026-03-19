import { AdminShell } from '@/components/admin/admin-shell';
import { SimpleAdminForm } from '@/components/admin/simple-admin-form';
import { fetchSiteSettings } from '@/lib/services/content';

export default async function AdminSettingsPage() {
  const settings = await fetchSiteSettings();
  return (
    <AdminShell title="Settings" description="Store brand-wide settings such as response promise copy, social values, and editable contact information.">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SimpleAdminForm endpoint="/api/admin/settings" title="Upsert site setting" description="Use a key and a JSON-serializable value. The system stores values in the site_settings table." defaultJson={JSON.stringify({ key: 'responsePromise', value: { en: 'Most booking requests are answered within a few hours.', fr: 'La plupart des demandes reçoivent une réponse en quelques heures.', es: 'La mayoría de las solicitudes reciben respuesta en pocas horas.', ar: 'يتم الرد على معظم الطلبات خلال بضع ساعات.' } }, null, 2)} />
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
          <h2 className="font-serif text-2xl">Current settings</h2>
          <pre className="mt-5 overflow-auto rounded-[1.5rem] border border-black/5 bg-stone-50 p-5 text-xs leading-6 dark:border-white/10 dark:bg-stone-900/60">{JSON.stringify(settings, null, 2)}</pre>
        </div>
      </section>
    </AdminShell>
  );
}
