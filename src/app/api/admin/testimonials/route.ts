import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { deleteTestimonial, saveTestimonial } from '@/lib/services/testimonials';
import { addRecentActivity } from '@/lib/services/activity';

export async function POST(request: Request) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const body = await request.json().catch(() => null);
  try {
    const testimonial = await saveTestimonial(body ?? {});
    await addRecentActivity(
      'testimonial_saved',
      `Testimonial saved for ${testimonial?.full_name}`,
      'testimonial',
      testimonial?.id ?? testimonial?.full_name,
      (testimonial ?? {}) as unknown as Record<string, unknown>,
      'owner-dashboard'
    );
    return NextResponse.json({ ok: true, testimonial });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Testimonial save failed.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required.' }, { status: 400 });
  }

  try {
    await deleteTestimonial(id);
    await addRecentActivity('testimonial_deleted', `Testimonial deleted ${id}`, 'testimonial', id, { id }, 'owner-dashboard');
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Testimonial delete failed.' }, { status: 500 });
  }
}
