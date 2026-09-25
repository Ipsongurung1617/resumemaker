import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/resume', '/admin'];
const ADMIN_EMAIL = 'ipsongrg221@gmail.com';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Strict Admin Gate: Only ipsongrg221@gmail.com can access /admin
  if (pathname.startsWith('/admin') && token.email !== ADMIN_EMAIL) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/resume/:path*', '/admin/:path*'],
};
