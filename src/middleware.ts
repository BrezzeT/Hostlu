import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminPage) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
}; 