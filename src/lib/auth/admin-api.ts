import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAdminCookieName, verifyAdminSessionToken } from '@/lib/auth/admin-session';

export async function ensureAdminApiAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminCookieName())?.value;
  const valid = await verifyAdminSessionToken(token);
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return null;
}
