import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to /ar
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ar', request.url));
  }

  // Handle redirects dashboard aliases
  if (
    pathname === '/selora-link' ||
    pathname === '/ar/selora-links' ||
    pathname === '/ar/selora-link'
  ) {
    return NextResponse.redirect(new URL('/selora-links', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
