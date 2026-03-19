import { NextResponse, type NextRequest } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/auth/admin-session';

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login']);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get('ecl_admin_session')?.value;
  const isValid = await verifyAdminSessionToken(sessionToken);

  if (!isValid) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
