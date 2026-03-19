import { addDays, format, startOfDay } from 'date-fns';
import { autoConfirmBookings } from '@/lib/env';
import { getServiceSupabase } from '@/lib/supabase/server';
import { BookingRequestInput, BookingStatus, DashboardOverview, PaymentStatus } from '@/types';
import { calculateBookingEstimate } from '@/lib/services/pricing';
import { checkAvailability } from '@/lib/services/availability';
import { addRecentActivity, listRecentActivity } from '@/lib/services/activity';
import { sendCustomerBookingEmail, sendOwnerNewBookingNotification } from '@/lib/services/email';
import { listMessages } from '@/lib/services/contact';
import { getAnalyticsSummary } from '@/lib/services/analytics';
import { csvEscape } from '@/lib/utils';

async function insertStatusHistory(
  bookingId: string,
  fromStatus: BookingStatus | null,
  toStatus: BookingStatus,
  fromPaymentStatus: PaymentStatus | null,
  toPaymentStatus: PaymentStatus,
  note: string | null,
  changedBy = 'system'
) {
  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase.from('booking_status_history').insert({
    booking_id: bookingId,
    from_status: fromStatus,
    to_status: toStatus,
    from_payment_status: fromPaymentStatus,
    to_payment_status: toPaymentStatus,
    note,
    changed_by: changedBy,
  });
}

export async function createBooking(input: BookingRequestInput) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const estimate = await calculateBookingEstimate(input);
  const guestCount = Number(input.adults) + Number(input.children);

  const primaryAvailability = await checkAvailability({
    experienceSlug: input.experience_slug,
    startDate: input.check_in_date ?? input.preferred_date ?? new Date().toISOString().slice(0, 10),
    endDate: input.check_out_date,
    guestCount,
  });

  if (!primaryAvailability.available) {
    throw new Error(primaryAvailability.reason ?? 'Selected dates are unavailable.');
  }

  const autoStatus: BookingStatus = autoConfirmBookings ? 'confirmed' : 'pending';
  const payload = {
    full_name: input.full_name,
    email: input.email,
    phone: input.phone,
    whatsapp: input.whatsapp ?? null,
    country: input.country,
    preferred_language: input.preferred_language,
    preferred_contact_method: input.preferred_contact_method,
    experience_slug: input.experience_slug,
    experience_name: input.experience_name,
    selected_services: input.selected_services,
    check_in_date: input.check_in_date ?? null,
    check_out_date: input.check_out_date ?? null,
    preferred_date: input.preferred_date ?? null,
    adults: input.adults,
    children: input.children,
    guest_count: guestCount,
    add_ons: input.add_ons,
    special_requests: input.special_requests ?? null,
    estimated_total: estimate.total,
    currency: 'EUR',
    payment_method: input.payment_method,
    payment_status: input.payment_status,
    booking_status: autoStatus,
    source: input.source ?? 'direct',
    medium: input.medium ?? 'none',
    campaign: input.campaign ?? null,
    referrer: input.referrer ?? null,
    owner_notes: input.owner_notes ?? null,
    session_token: input.session_token ?? null,
  };

  const { data, error } = await supabase.from('booking_requests').insert(payload).select('*').single();
  if (error) throw error;

  await insertStatusHistory(data.id, null, autoStatus, null, input.payment_status, 'Booking submitted via website', 'website');
  await addRecentActivity(
    'booking_created',
    `New booking ${data.booking_reference} from ${data.full_name}`,
    'booking',
    data.id,
    { booking_reference: data.booking_reference },
    'website'
  );

  await sendCustomerBookingEmail(data, 'bookingReceived');
  await sendOwnerNewBookingNotification(data);

  return { ...data, estimated_total: estimate.total };
}

export async function listBookings(filters?: { status?: string; search?: string }) {
  const supabase = getServiceSupabase();
  if (!supabase) return [] as any[];

  let query = supabase.from('booking_requests').select('*').order('created_at', { ascending: false });
  if (filters?.status) query = query.eq('booking_status', filters.status);
  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,booking_reference.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getBookingById(id: string) {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const [{ data: booking }, { data: history }] = await Promise.all([
    supabase.from('booking_requests').select('*').eq('id', id).maybeSingle(),
    supabase.from('booking_status_history').select('*').eq('booking_id', id).order('created_at', { ascending: true }),
  ]);

  if (!booking) return null;
  return { ...booking, status_history: history ?? [] };
}

export async function getBookingByReference(reference: string) {
  const supabase = getServiceSupabase();
  if (!supabase) return null;
  const { data } = await supabase.from('booking_requests').select('*').eq('booking_reference', reference).maybeSingle();
  return data;
}

export async function updateBookingStatus(payload: {
  id: string;
  booking_status: BookingStatus;
  payment_status?: PaymentStatus;
  owner_notes?: string;
  changed_by?: string;
  send_email?: boolean;
}) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const booking = await getBookingById(payload.id);
  if (!booking) throw new Error('Booking not found.');

  const nextPaymentStatus = payload.payment_status ?? booking.payment_status;
  const { data, error } = await supabase
    .from('booking_requests')
    .update({
      booking_status: payload.booking_status,
      payment_status: nextPaymentStatus,
      owner_notes: payload.owner_notes ?? booking.owner_notes,
    })
    .eq('id', payload.id)
    .select('*')
    .single();

  if (error) throw error;

  await insertStatusHistory(
    payload.id,
    booking.booking_status,
    payload.booking_status,
    booking.payment_status,
    nextPaymentStatus,
    payload.owner_notes ?? null,
    payload.changed_by ?? 'owner'
  );

  await addRecentActivity(
    'booking_status_updated',
    `Booking ${data.booking_reference} changed to ${payload.booking_status}`,
    'booking',
    payload.id,
    { payment_status: nextPaymentStatus },
    payload.changed_by ?? 'owner'
  );

  const shouldSendStatusEmail = payload.send_email !== false && booking.booking_status !== payload.booking_status;

  if (shouldSendStatusEmail) {
    if (payload.booking_status === 'confirmed') await sendCustomerBookingEmail(data, 'confirmed');
    if (payload.booking_status === 'declined') await sendCustomerBookingEmail(data, 'declined');
    if (payload.booking_status === 'cancelled') await sendCustomerBookingEmail(data, 'cancelled');
  }

  return data;
}

export async function addOwnerNote(bookingId: string, note: string, changedBy = 'owner') {
  const booking = await getBookingById(bookingId);
  if (!booking) throw new Error('Booking not found.');

  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const combined = [booking.owner_notes, note].filter(Boolean).join('\n\n');
  const { data, error } = await supabase.from('booking_requests').update({ owner_notes: combined }).eq('id', bookingId).select('*').single();
  if (error) throw error;

  await addRecentActivity('booking_note', `Owner note added to ${data.booking_reference}`, 'booking', bookingId, { note }, changedBy);
  await insertStatusHistory(bookingId, booking.booking_status, booking.booking_status, booking.payment_status, booking.payment_status, note, changedBy);

  return data;
}

export async function exportBookingsCsv() {
  const bookings = await listBookings();
  const header = [
    'booking_reference',
    'full_name',
    'email',
    'phone',
    'experience_name',
    'preferred_date',
    'check_in_date',
    'check_out_date',
    'guest_count',
    'estimated_total',
    'currency',
    'booking_status',
    'payment_status',
    'source',
    'created_at',
  ];

  const rows = bookings.map((booking: any) =>
    [
      booking.booking_reference,
      booking.full_name,
      booking.email,
      booking.phone,
      booking.experience_name,
      booking.preferred_date,
      booking.check_in_date,
      booking.check_out_date,
      booking.guest_count,
      booking.estimated_total,
      booking.currency,
      booking.booking_status,
      booking.payment_status,
      booking.source,
      booking.created_at,
    ]
      .map(csvEscape)
      .join(',')
  );

  return [header.join(','), ...rows].join('\n');
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const [bookings, messages, recentActivity, analytics] = await Promise.all([
    listBookings(),
    listMessages(),
    listRecentActivity(12),
    getAnalyticsSummary(),
  ]);

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const todayString = format(today, 'yyyy-MM-dd');
  const tomorrowString = format(tomorrow, 'yyyy-MM-dd');

  const arrivalsToday = bookings.filter((booking: any) => booking.check_in_date === todayString || booking.preferred_date === todayString).length;
  const arrivalsTomorrow = bookings.filter((booking: any) => booking.check_in_date === tomorrowString || booking.preferred_date === tomorrowString).length;
  const transfersScheduled = bookings.filter((booking: any) => JSON.stringify(booking.selected_services ?? []).toLowerCase().includes('transfer')).length;
  const paymentFollowUps = bookings.filter((booking: any) => ['payment_pending', 'deposit_requested'].includes(booking.payment_status)).length;

  return {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((booking: any) => booking.booking_status === 'pending').length,
    confirmedBookings: bookings.filter((booking: any) => booking.booking_status === 'confirmed').length,
    completedBookings: bookings.filter((booking: any) => booking.booking_status === 'completed').length,
    estimatedRevenue: bookings
      .filter((booking: any) => ['confirmed', 'completed'].includes(booking.booking_status))
      .reduce((sum: number, booking: any) => sum + Number(booking.estimated_total ?? 0), 0),
    messageCount: messages.length,
    sessionCount: analytics.sessionCount,
    bookingConversions: analytics.bookingConversions,
    messageConversions: analytics.messageConversions,
    arrivalsToday,
    arrivalsTomorrow,
    paymentFollowUps,
    transfersScheduled,
    topSources: analytics.topSources.slice(0, 5),
    recentMessages: messages.slice(0, 5),
    recentBookings: bookings.slice(0, 6),
    recentActivity,
  };
}
