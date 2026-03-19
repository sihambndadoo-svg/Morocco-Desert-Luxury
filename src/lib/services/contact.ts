import { getServiceSupabase } from '@/lib/supabase/server';
import { ContactMessageInput } from '@/types';
import { addRecentActivity } from '@/lib/services/activity';
import { sendOwnerContactNotification } from '@/lib/services/email';

export async function createContactMessage(input: ContactMessageInput) {
  const supabase = getServiceSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      full_name: input.full_name,
      email: input.email,
      phone_or_whatsapp: input.phone_or_whatsapp ?? null,
      subject: input.subject,
      message: input.message,
      preferred_language: input.preferred_language,
    })
    .select('*')
    .single();

  if (error) throw error;

  await addRecentActivity(
    'contact_message',
    `New message from ${input.full_name}`,
    'message',
    data.id,
    { subject: input.subject },
    'website'
  );

  await sendOwnerContactNotification(data);
  return data;
}

export async function listMessages() {
  const supabase = getServiceSupabase();
  if (!supabase) return [] as any[];
  const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  return data ?? [];
}

function csvEscape(value: unknown) {
  const normalized = String(value ?? '');
  return `"${normalized.replaceAll('"', '""')}"`;
}

export async function exportMessagesCsv() {
  const messages = await listMessages();
  const header = ['full_name', 'email', 'phone_or_whatsapp', 'subject', 'message', 'preferred_language', 'created_at'];
  const rows = messages.map((message: any) =>
    [
      message.full_name,
      message.email,
      message.phone_or_whatsapp,
      message.subject,
      message.message,
      message.preferred_language,
      message.created_at,
    ]
      .map(csvEscape)
      .join(',')
  );
  return [header.join(','), ...rows].join('\n');
}
