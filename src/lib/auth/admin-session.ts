import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

const COOKIE_NAME = 'ecl_admin_session';
const secretKey = new TextEncoder().encode(env.ADMIN_SESSION_SECRET);

export async function createAdminSessionToken() {
  return new SignJWT({ role: 'owner' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyAdminSessionToken(token?: string | null) {
  if (!token) return false;
  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export async function getAdminCookieValue() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}
