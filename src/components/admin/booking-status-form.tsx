'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BookingStatus, PaymentStatus } from '@/types';

const bookingStatuses: BookingStatus[] = ['pending', 'confirmed', 'declined', 'cancelled', 'completed'];
const paymentStatuses: PaymentStatus[] = ['payment_pending', 'deposit_requested', 'deposit_paid', 'fully_paid', 'refunded'];

export function BookingStatusForm({ bookingId, currentStatus, currentPaymentStatus }: { bookingId: string; currentStatus: BookingStatus; currentPaymentStatus: PaymentStatus }) {
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(currentPaymentStatus);
  const [ownerNotes, setOwnerNotes] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_status: bookingStatus, payment_status: paymentStatus, owner_notes: ownerNotes, send_email: sendEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Status update failed.');
      setMessage('Booking updated successfully.');
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Status update failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-[1.75rem] border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-stone-950/60">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Booking status
          <select value={bookingStatus} onChange={(event) => setBookingStatus(event.target.value as BookingStatus)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-stone-900">
            {bookingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Payment status
          <select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-stone-900">
            {paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Owner note for timeline
        <textarea value={ownerNotes} onChange={(event) => setOwnerNotes(event.target.value)} rows={4} className="rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-stone-900" />
      </label>
      <label className="inline-flex items-center gap-3 text-sm text-stone-700 dark:text-stone-300">
        <input type="checkbox" checked={sendEmail} onChange={(event) => setSendEmail(event.target.checked)} className="h-4 w-4" />
        Send customer status email when relevant
      </label>
      {message ? <p className="text-sm text-stone-600 dark:text-stone-300">{message}</p> : null}
      <button type="button" onClick={onSubmit} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white dark:bg-amber-300 dark:text-stone-950">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Update booking
      </button>
    </div>
  );
}
