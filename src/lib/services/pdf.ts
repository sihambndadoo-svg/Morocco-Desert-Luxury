import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { formatCurrency, formatDate } from '@/lib/utils';
import { siteConfig } from '@/lib/constants';

export async function generateBookingConfirmationPdf(booking: any) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const gold = rgb(0.72, 0.56, 0.28);
  const text = rgb(0.18, 0.15, 0.12);

  page.drawRectangle({ x: 0, y: 760, width: 595, height: 82, color: rgb(0.97, 0.93, 0.86) });
  page.drawText('Morocco Desert Luxury', { x: 40, y: 800, size: 24, font: serif, color: text });
  page.drawText('Booking confirmation', { x: 40, y: 775, size: 13, font: sans, color: gold });

  let y = 730;
  const line = (label: string, value: string) => {
    page.drawText(label, { x: 40, y, size: 10, font: sans, color: gold });
    page.drawText(value, { x: 180, y, size: 11, font: sans, color: text, maxWidth: 360 });
    y -= 24;
  };

  line('Reference', booking.booking_reference ?? '—');
  line('Guest', booking.full_name ?? '—');
  line('Email', booking.email ?? '—');
  line('Phone', booking.phone ?? '—');
  line('Services', (booking.selected_services ?? []).map((item: any) => item.name).join(', ') || booking.experience_name);
  line('Dates', booking.check_in_date ? `${formatDate(booking.check_in_date)}${booking.check_out_date ? ` – ${formatDate(booking.check_out_date)}` : ''}` : booking.preferred_date ? formatDate(booking.preferred_date) : 'To be finalized');
  line('Payment status', booking.payment_status ?? 'payment_pending');
  line('Booking status', booking.booking_status ?? 'pending');
  line('Estimated total', formatCurrency(Number(booking.estimated_total ?? 0), booking.currency ?? 'EUR'));

  y -= 8;
  page.drawText('Arrival and coordination', { x: 40, y, size: 14, font: serif, color: text });
  y -= 28;
  const arrivalText = booking.check_in_date
    ? 'Final arrival instructions and meeting details are confirmed directly with the guest before travel.'
    : 'Preferred timing and exact meeting arrangements are confirmed once the reservation is finalized.';
  page.drawText(arrivalText, { x: 40, y, size: 11, font: sans, color: text, maxWidth: 510, lineHeight: 16 });
  y -= 70;
  page.drawText(`${siteConfig.location} • ${siteConfig.ownerEmail} • ${siteConfig.whatsapp}`, {
    x: 40,
    y,
    size: 10,
    font: sans,
    color: rgb(0.4, 0.35, 0.3),
  });

  return Buffer.from(await pdf.save());
}
