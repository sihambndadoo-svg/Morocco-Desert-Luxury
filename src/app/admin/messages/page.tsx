import { AdminShell } from '@/components/admin/admin-shell';
import { listMessages } from '@/lib/services/contact';

export default async function AdminMessagesPage() {
  const messages = await listMessages();
  return (
    <AdminShell title="Messages" description="Website contact messages saved to Supabase and visible for daily follow-up.">
      <section className="flex justify-end">
        <a href="/api/admin/messages/export" className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold dark:border-white/10">Export CSV</a>
      </section>
      <section className="grid gap-4">
        {messages.map((message: any) => (
          <article key={message.id} className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-stone-900 dark:text-white">{message.subject}</h2>
                <p className="mt-1 text-sm text-stone-500">{message.full_name} · {message.email} · {message.phone_or_whatsapp ?? 'No phone'}</p>
              </div>
              <div className="text-xs uppercase tracking-[0.22em] text-stone-500">{new Date(message.created_at).toLocaleString()}</div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-600 dark:text-stone-300">{message.message}</p>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
