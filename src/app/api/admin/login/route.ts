import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { createAdminSessionToken, getAdminCookieName } from '@/lib/auth/admin-session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = body?.username;
  const password = body?.password;

  if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(getAdminCookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true, next: '/admin' });
}
