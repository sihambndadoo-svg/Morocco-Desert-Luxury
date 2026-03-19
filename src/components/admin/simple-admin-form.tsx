'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function SimpleAdminForm({
  endpoint,
  title,
  description,
  defaultJson,
}: {
  endpoint: string;
  title: string;
  description: string;
  defaultJson: string;
}) {
  const [value, setValue] = useState(defaultJson);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true);
    setMessage(null);
    try {
      const parsed = JSON.parse(value);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not save record.');
      setMessage('Saved successfully.');
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save record.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-[1.75rem] border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-stone-950/60">
      <div>
        <h2 className="font-serif text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">{description}</p>
      </div>
      <textarea value={value} onChange={(event) => setValue(event.target.value)} rows={14} className="w-full rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 font-mono text-sm dark:border-white/10 dark:bg-stone-900" />
      {message ? <p className="text-sm text-stone-600 dark:text-stone-300">{message}</p> : null}
      <button type="button" onClick={onSubmit} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white dark:bg-amber-300 dark:text-stone-950">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Save JSON payload
      </button>
    </div>
  );
}
