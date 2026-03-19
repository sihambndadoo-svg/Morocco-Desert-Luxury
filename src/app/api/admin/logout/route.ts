import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAdminCookieName } from '@/lib/auth/admin-session';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.set(getAdminCookieName(), '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  });
  return NextResponse.redirect(new URL('/admin/login', request.url));
}
