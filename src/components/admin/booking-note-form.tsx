'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function BookingNoteForm({ bookingId }: { bookingId: string }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not save note.');
      setMessage('Owner note saved.');
      setNote('');
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save note.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-[1.75rem] border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-stone-950/60">
      <label className="grid gap-2 text-sm font-medium">
        Add owner note
        <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-stone-900" />
      </label>
      {message ? <p className="text-sm text-stone-600 dark:text-stone-300">{message}</p> : null}
      <button type="button" onClick={onSubmit} disabled={loading || !note.trim()} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold dark:border-white/10">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Save note
      </button>
    </div>
  );
}
