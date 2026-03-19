'use client';

import { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';

export function BookingEmailTrigger({ bookingId }: { bookingId: string }) {
  const [template, setTemplate] = useState<'bookingReceived' | 'confirmed' | 'declined' | 'cancelled'>('confirmed');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSend() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Email could not be sent.');
      setMessage('Email sent successfully.');
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Email could not be sent.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-[1.75rem] border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-stone-950/60">
      <label className="grid gap-2 text-sm font-medium">
        Trigger customer email
        <select value={template} onChange={(event) => setTemplate(event.target.value as typeof template)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-stone-900">
          <option value="bookingReceived">Booking received</option>
          <option value="confirmed">Booking confirmed</option>
          <option value="declined">Booking declined</option>
          <option value="cancelled">Booking cancelled</option>
        </select>
      </label>
      {message ? <p className="text-sm text-stone-600 dark:text-stone-300">{message}</p> : null}
      <button type="button" onClick={onSend} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold dark:border-white/10">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        Send email
      </button>
    </div>
  );
}
