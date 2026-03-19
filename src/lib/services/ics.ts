export function generateBookingIcs(booking: any) {
  const start = booking.check_in_date ?? booking.preferred_date;
  const end = booking.check_out_date ?? booking.preferred_date ?? start;
  const formatIcsDate = (value: string) => value.replaceAll('-', '');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Morocco Desert Luxury//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${booking.booking_reference}@ergchebbiluxury.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
    `DTSTART;VALUE=DATE:${formatIcsDate(start)}`,
    `DTEND;VALUE=DATE:${formatIcsDate(end)}`,
    `SUMMARY:${booking.experience_name} • ${booking.booking_reference}`,
    `DESCRIPTION:Booking for ${booking.full_name}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
