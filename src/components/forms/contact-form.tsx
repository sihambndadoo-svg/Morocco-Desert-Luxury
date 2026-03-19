'use client';

import { FormEvent, useRef, useState } from 'react';
import { Loader2, MessageCircleMore } from 'lucide-react';
import { Locale } from '@/types';

const sessionStorageKey = 'ecl_session_token';

export function ContactForm({ locale }: { locale: Locale }) {
  const successRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_or_whatsapp: '',
    subject: '',
    message: '',
    preferred_language: locale,
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMessage(null);
    try {
      const sessionToken = window.localStorage.getItem(sessionStorageKey) ?? undefined;
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, session_token: sessionToken }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Message could not be sent.');
      setSuccess(true);
      setForm({
        full_name: '',
        email: '',
        phone_or_whatsapp: '',
        subject: '',
        message: '',
        preferred_language: locale,
      });
      successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Contact form failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_60px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60 md:p-8">
      <div ref={successRef}>
        {success ? (
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
            Your message has been delivered successfully. We will reply soon.
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
            {errorMessage}
          </div>
        ) : null}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-200">
          Full name
          <input required value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-stone-900 dark:text-white" />
        </label>
        <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-200">
          Email
          <input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-stone-900 dark:text-white" />
        </label>
        <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-200">
          Phone or WhatsApp
          <input value={form.phone_or_whatsapp} onChange={(event) => setForm((current) => ({ ...current, phone_or_whatsapp: event.target.value }))} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-stone-900 dark:text-white" />
        </label>
        <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-200">
          Preferred language
          <select value={form.preferred_language} onChange={(event) => setForm((current) => ({ ...current, preferred_language: event.target.value as Locale }))} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-stone-900 dark:text-white">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="ar">العربية</option>
          </select>
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-200">
        Subject
        <input required value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-stone-900 dark:text-white" />
      </label>
      <label className="space-y-2 text-sm font-medium text-stone-800 dark:text-stone-200">
        Message
        <textarea required rows={7} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} className="w-full rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-stone-900 dark:text-white" placeholder="Share your travel dates, group style, or custom request…" />
      </label>
      <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-amber-300 dark:text-stone-950 dark:hover:bg-amber-200">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircleMore className="h-4 w-4" />}
        Send message
      </button>
    </form>
  );
}
