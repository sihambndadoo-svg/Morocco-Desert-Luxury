import { NextResponse } from 'next/server';
import { ensureAdminApiAccess } from '@/lib/auth/admin-api';
import { savePricingRule, deletePricingRule } from '@/lib/services/pricing';
import { upsertExperienceBase } from '@/lib/services/experiences';
import { addRecentActivity } from '@/lib/services/activity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const body = await request.json().catch(() => null);

  try {
    if (body?.type === 'experience_base') {
      await upsertExperienceBase(body);
      await addRecentActivity('experience_pricing_updated', `Base pricing updated for ${body.slug}`, 'experience', body.slug, body, 'owner-dashboard');
      return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }

    const { type: _type, ...rulePayload } = body ?? {};
    await savePricingRule(rulePayload);
    await addRecentActivity('pricing_rule_saved', `Pricing rule saved for ${rulePayload?.experience_slug}`, 'pricing_rule', rulePayload?.id ?? rulePayload?.experience_slug, rulePayload ?? {}, 'owner-dashboard');
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Pricing save failed.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await ensureAdminApiAccess();
  if (unauthorized) return unauthorized;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });
  try {
    await deletePricingRule(id);
    await addRecentActivity('pricing_rule_deleted', `Pricing rule deleted ${id}`, 'pricing_rule', id, {}, 'owner-dashboard');
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Pricing rule delete failed.' }, { status: 500 });
  }
}
