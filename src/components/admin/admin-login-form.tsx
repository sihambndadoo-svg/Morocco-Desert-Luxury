'use client';

import { FormEvent, useState } from 'react';
import { Loader2, LockKeyhole } from 'lucide-react';

export function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = new URL(window.location.href);
      const next = url.searchParams.get('next') || '/admin';
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Login failed.');
      window.location.href = data.next || next;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_24px_60px_-28px_rgba(37,29,18,0.2)] dark:border-white/10 dark:bg-stone-950/60">
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">{error}</div> : null}
      <label className="grid gap-2 text-sm font-medium text-stone-800 dark:text-stone-200">
        Username
        <input value={username} onChange={(event) => setUsername(event.target.value)} required className="rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-stone-900" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-stone-800 dark:text-stone-200">
        Password
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-stone-900" />
      </label>
      <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-70 dark:bg-amber-300 dark:text-stone-950 dark:hover:bg-amber-200">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
        Sign in to dashboard
      </button>
    </form>
  );
}
