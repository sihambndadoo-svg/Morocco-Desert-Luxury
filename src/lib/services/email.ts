import { Resend } from 'resend';
import { env } from '@/lib/env';
import { Locale } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { siteConfig } from '@/lib/constants';
import { addRecentActivity } from '@/lib/services/activity';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

function wrapEmail(title: string, intro: string, content: string) {
  return `
    <div style="font-family: Inter, Arial, sans-serif; background:#f7f2ea; padding:32px; color:#1d1d1b;">
      <div style="max-width:640px; margin:0 auto; background:#fffdf8; border:1px solid rgba(123,94,54,0.12); border-radius:22px; overflow:hidden; box-shadow:0 18px 50px rgba(32,24,14,0.08);">
        <div style="padding:28px 32px; background:linear-gradient(135deg,#f7efe2 0%,#f2e0b8 100%); border-bottom:1px solid rgba(123,94,54,0.1);">
          <div style="font-size:12px; letter-spacing:0.24em; text-transform:uppercase; color:#7a643f;">Morocco Desert Luxury</div>
          <h1 style="margin:12px 0 0; font-size:28px; line-height:1.2; font-family: Georgia, 'Times New Roman', serif;">${title}</h1>
        </div>
        <div style="padding:28px 32px; font-size:16px; line-height:1.7;">
          <p style="margin-top:0;">${intro}</p>
          ${content}
          <p style="margin-bottom:0; color:#5e5547;">${siteConfig.location}<br/>WhatsApp: ${siteConfig.whatsapp}<br/>Email: ${siteConfig.ownerEmail}</p>
        </div>
      </div>
    </div>
  `;
}

const copy = {
  bookingReceived: {
    en: {
      subject: 'We received your booking request',
      title: 'Your booking request is safely received',
      intro: 'Thank you for reaching out to Morocco Desert Luxury. We have received your request and will review the details carefully.'
    },
    fr: {
      subject: 'Nous avons bien reçu votre demande de réservation',
      title: 'Votre demande de réservation a bien été reçue',
      intro: 'Merci d’avoir contacté Morocco Desert Luxury. Nous avons bien reçu votre demande et allons vérifier les détails avec attention.'
    },
    es: {
      subject: 'Hemos recibido tu solicitud de reserva',
      title: 'Tu solicitud de reserva ha sido recibida',
      intro: 'Gracias por contactar con Morocco Desert Luxury. Hemos recibido tu solicitud y revisaremos los detalles con atención.'
    },
    ar: {
      subject: 'تم استلام طلب الحجز الخاص بك',
      title: 'تم استلام طلب الحجز بنجاح',
      intro: 'شكراً لتواصلك مع Morocco Desert Luxury. لقد استلمنا طلبك وسنراجع التفاصيل بعناية.'
    }
  },
  confirmed: {
    en: {
      subject: 'Your booking has been confirmed',
      title: 'Your desert booking is confirmed',
      intro: 'We are pleased to confirm your reservation. Below you will find the key travel details and next steps.'
    },
    fr: {
      subject: 'Votre réservation est confirmée',
      title: 'Votre réservation désert est confirmée',
      intro: 'Nous avons le plaisir de confirmer votre réservation. Vous trouverez ci-dessous les informations clés et les prochaines étapes.'
    },
    es: {
      subject: 'Tu reserva está confirmada',
      title: 'Tu reserva en el desierto está confirmada',
      intro: 'Nos complace confirmar tu reserva. A continuación encontrarás los detalles principales y los próximos pasos.'
    },
    ar: {
      subject: 'تم تأكيد حجزك',
      title: 'تم تأكيد حجزك الصحراوي',
      intro: 'يسرنا تأكيد حجزك. ستجد أدناه أهم التفاصيل والخطوات التالية.'
    }
  },
  declined: {
    en: {
      subject: 'Update on your booking request',
      title: 'We could not confirm the requested plan',
      intro: 'Thank you again for your interest. Unfortunately, we are not able to confirm the requested arrangement at this time.'
    },
    fr: {
      subject: 'Mise à jour concernant votre demande de réservation',
      title: 'Nous ne pouvons pas confirmer la formule demandée',
      intro: 'Merci encore pour votre intérêt. Malheureusement, nous ne pouvons pas confirmer l’arrangement demandé à cette date.'
    },
    es: {
      subject: 'Actualización sobre tu solicitud de reserva',
      title: 'No podemos confirmar la fórmula solicitada',
      intro: 'Gracias de nuevo por tu interés. Lamentablemente no podemos confirmar la opción solicitada en este momento.'
    },
    ar: {
      subject: 'تحديث بخصوص طلب الحجز',
      title: 'تعذر تأكيد الترتيب المطلوب',
      intro: 'شكراً مرة أخرى على اهتمامك. للأسف لا يمكننا تأكيد الترتيب المطلوب في الوقت الحالي.'
    }
  },
  cancelled: {
    en: {
      subject: 'Your booking has been cancelled',
      title: 'Your booking has been cancelled',
      intro: 'This email confirms that your booking is now marked as cancelled in our system.'
    },
    fr: {
      subject: 'Votre réservation a été annulée',
      title: 'Votre réservation a été annulée',
      intro: 'Cet email confirme que votre réservation est désormais marquée comme annulée dans notre système.'
    },
    es: {
      subject: 'Tu reserva ha sido cancelada',
      title: 'Tu reserva ha sido cancelada',
      intro: 'Este correo confirma que tu reserva ha sido marcada como cancelada en nuestro sistema.'
    },
    ar: {
      subject: 'تم إلغاء حجزك',
      title: 'تم إلغاء الحجز',
      intro: 'يؤكد هذا البريد أن حجزك أصبح ملغى في نظامنا.'
    }
  }
} as const;

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  bookingReference?: string;
}) {
  if (!resend) return { id: null, skipped: true };
  const response = await resend.emails.send({
    from: env.BOOKING_FROM_EMAIL,
    to: params.to,
    subject: params.subject,
    html: params.html,
    replyTo: params.replyTo ?? env.BOOKING_REPLY_TO,
  });
  if (params.bookingReference) {
    await addRecentActivity(
      'email_sent',
      `Email sent for ${params.bookingReference}`,
      'booking',
      params.bookingReference,
      { subject: params.subject },
      'system'
    );
  }
  return response;
}

function bookingDetailsBlock(booking: any, locale: Locale) {
  const services = (booking.selected_services ?? []).map((item: any) => item.name).join(', ');
  return `
    <div style="background:#fbf7ef; border:1px solid rgba(123,94,54,0.1); border-radius:16px; padding:20px; margin:24px 0;">
      <p><strong>Reference:</strong> ${booking.booking_reference}</p>
      <p><strong>Services:</strong> ${services || booking.experience_name}</p>
      <p><strong>Dates:</strong> ${booking.check_in_date ? `${formatDate(booking.check_in_date, locale)}${booking.check_out_date ? ` – ${formatDate(booking.check_out_date, locale)}` : ''}` : booking.preferred_date ? formatDate(booking.preferred_date, locale) : 'To be finalized'}</p>
      <p><strong>Total estimate:</strong> ${formatCurrency(Number(booking.estimated_total ?? 0), booking.currency ?? 'EUR', locale)}</p>
      <p><strong>Payment status:</strong> ${booking.payment_status}</p>
    </div>
  `;
}

export async function sendCustomerBookingEmail(booking: any, template: keyof typeof copy) {
  const locale = (booking.preferred_language as Locale) || 'en';
  const localized = copy[template][locale];
  const html = wrapEmail(
    localized.title,
    localized.intro,
    `${bookingDetailsBlock(booking, locale)}<p>For questions or fast coordination, you can reply to this email or contact us on WhatsApp at ${siteConfig.whatsapp}.</p>`
  );
  return sendEmail({
    to: booking.email,
    subject: `${localized.subject} • ${booking.booking_reference}`,
    html,
    bookingReference: booking.booking_reference
  });
}

export async function sendOwnerNewBookingNotification(booking: any) {
  const services = (booking.selected_services ?? []).map((item: any) => item.name).join(', ');
  const html = wrapEmail(
    `New booking request • ${booking.booking_reference}`,
    `A new booking request has been submitted by ${booking.full_name}.`,
    `
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>WhatsApp:</strong> ${booking.whatsapp ?? '—'}</p>
      <p><strong>Services:</strong> ${services || booking.experience_name}</p>
      <p><strong>Preferred date:</strong> ${booking.preferred_date ?? booking.check_in_date ?? 'To be confirmed'}</p>
      <p><strong>Guests:</strong> ${booking.guest_count}</p>
      <p><strong>Estimated total:</strong> ${formatCurrency(Number(booking.estimated_total ?? 0), booking.currency ?? 'EUR')}</p>
      <p><strong>Special requests:</strong> ${booking.special_requests ?? 'None'}</p>
    `
  );
  return sendEmail({
    to: env.OWNER_NOTIFICATION_EMAIL,
    subject: `New booking • ${booking.booking_reference}`,
    html,
    bookingReference: booking.booking_reference
  });
}

export async function sendOwnerContactNotification(message: any) {
  const html = wrapEmail(
    'New website contact message',
    `A new contact message was submitted by ${message.full_name}.`,
    `
      <p><strong>Subject:</strong> ${message.subject}</p>
      <p><strong>Email:</strong> ${message.email}</p>
      <p><strong>Phone / WhatsApp:</strong> ${message.phone_or_whatsapp ?? '—'}</p>
      <p><strong>Message:</strong><br/>${message.message}</p>
    `
  );
  return sendEmail({
    to: env.OWNER_NOTIFICATION_EMAIL,
    subject: `Contact form • ${message.subject}`,
    html,
  });
}
