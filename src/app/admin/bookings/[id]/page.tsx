import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminShell } from '@/components/admin/admin-shell';
import { getBookingById } from '@/lib/services/bookings';
import { formatCurrency } from '@/lib/utils';
import { BookingStatusForm } from '@/components/admin/booking-status-form';
import { BookingNoteForm } from '@/components/admin/booking-note-form';
import { BookingEmailTrigger } from '@/components/admin/booking-email-trigger';

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) {
    notFound();
  }
  const currentBooking = booking as NonNullable<typeof booking>;

  return (
    <AdminShell title={`Booking ${currentBooking.booking_reference}`} description="Inspect customer details, booking composition, timeline, status history, and outbound communication tools.">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 text-sm">
              <div><div className="text-stone-500">Guest</div><div className="mt-2 font-semibold">{currentBooking.full_name}</div><div className="text-stone-500">{currentBooking.email}</div></div>
              <div><div className="text-stone-500">Phone</div><div className="mt-2 font-semibold">{currentBooking.phone}</div><div className="text-stone-500">WhatsApp: {currentBooking.whatsapp ?? '—'}</div></div>
              <div><div className="text-stone-500">Origin</div><div className="mt-2 font-semibold">{currentBooking.country}</div><div className="text-stone-500">Language: {currentBooking.preferred_language}</div></div>
              <div><div className="text-stone-500">Dates</div><div className="mt-2 font-semibold">{currentBooking.check_in_date ?? currentBooking.preferred_date ?? '—'}</div><div className="text-stone-500">{currentBooking.check_out_date ?? 'No checkout'}</div></div>
              <div><div className="text-stone-500">Guests</div><div className="mt-2 font-semibold">{currentBooking.guest_count}</div><div className="text-stone-500">Adults {currentBooking.adults} · Children {currentBooking.children}</div></div>
              <div><div className="text-stone-500">Total estimate</div><div className="mt-2 font-semibold">{formatCurrency(Number(currentBooking.estimated_total ?? 0), currentBooking.currency ?? 'EUR')}</div><div className="text-stone-500">{currentBooking.payment_method}</div></div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
            <h2 className="font-serif text-2xl">Selected services</h2>
            <div className="mt-5 grid gap-4">
              {(currentBooking.selected_services ?? []).map((item: any, index: number) => (
                <div key={`${item.slug}-${index}`} className="flex items-start justify-between gap-3 rounded-2xl border border-black/5 bg-stone-50 px-5 py-4 dark:border-white/10 dark:bg-stone-900/60">
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-white">{item.name}</div>
                    <div className="text-xs uppercase tracking-[0.24em] text-stone-500">{item.type}</div>
                  </div>
                  <div className="font-semibold">{formatCurrency(Number(item.price ?? 0), currentBooking.currency ?? 'EUR')}</div>
                </div>
              ))}
              {(currentBooking.add_ons ?? []).length ? (
                <div className="grid gap-4 pt-2">
                  <h3 className="font-semibold text-stone-900 dark:text-white">Add-ons</h3>
                  {(currentBooking.add_ons ?? []).map((item: any, index: number) => (
                    <div key={`${item.slug}-${index}`} className="flex items-start justify-between gap-3 rounded-2xl border border-black/5 bg-stone-50 px-5 py-4 dark:border-white/10 dark:bg-stone-900/60">
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-white">{item.name}</div>
                        <div className="text-xs uppercase tracking-[0.24em] text-stone-500">Addon · Qty {item.quantity ?? 1}</div>
                      </div>
                      <div className="font-semibold">{formatCurrency(Number(item.price ?? 0), currentBooking.currency ?? 'EUR')}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
            <h2 className="font-serif text-2xl">Timeline & status history</h2>
            <div className="mt-5 grid gap-4">
              {currentBooking.status_history.map((item: any) => (
                <div key={item.id} className="rounded-2xl border border-black/5 bg-stone-50 px-5 py-4 dark:border-white/10 dark:bg-stone-900/60">
                  <div className="font-semibold text-stone-900 dark:text-white">{item.from_status ?? 'new'} → {item.to_status}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.22em] text-stone-500">Payment {item.from_payment_status ?? '—'} → {item.to_payment_status}</div>
                  <div className="mt-2 text-sm text-stone-600 dark:text-stone-300">{item.note ?? 'No note provided.'}</div>
                  <div className="mt-2 text-xs text-stone-500">{item.changed_by} · {new Date(item.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BookingStatusForm bookingId={currentBooking.id} currentStatus={currentBooking.booking_status} currentPaymentStatus={currentBooking.payment_status} />
          <BookingNoteForm bookingId={currentBooking.id} />
          <BookingEmailTrigger bookingId={currentBooking.id} />
          <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
            <h2 className="font-serif text-2xl">Exports & documents</h2>
            <div className="mt-5 grid gap-3 text-sm">
              <a href={`/api/admin/bookings/${currentBooking.id}/confirmation-pdf`} className="rounded-full border border-black/10 px-5 py-3 font-semibold dark:border-white/10">Download confirmation PDF</a>
              <a href={`/api/bookings/${currentBooking.booking_reference}/ics`} className="rounded-full border border-black/10 px-5 py-3 font-semibold dark:border-white/10">Download ICS calendar file</a>
              <Link href="/admin/bookings" className="rounded-full border border-black/10 px-5 py-3 text-center font-semibold dark:border-white/10">Back to bookings</Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-stone-950/60">
            <h2 className="font-serif text-2xl">Owner notes</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-600 dark:text-stone-300">{currentBooking.owner_notes || 'No owner notes yet.'}</p>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
