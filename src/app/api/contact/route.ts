import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validators/forms';
import { createContactMessage } from '@/lib/services/contact';
import { trackEvent } from '@/lib/services/analytics';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid contact data.' }, { status: 400 });
  }

  try {
    const message = await createContactMessage(parsed.data);
    const headerStore = await headers();
    await trackEvent({
      session_token: parsed.data.session_token,
      page_path: '/contact',
      page_title: 'Message conversion',
      event_type: 'message_conversion',
      locale: parsed.data.preferred_language,
      metadata: { subject: parsed.data.subject },
      user_agent: headerStore.get('user-agent') ?? '',
      ip: headerStore.get('x-forwarded-for') ?? '',
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Contact message failed.' }, { status: 500 });
  }
}
