import { NextRequest, NextResponse } from 'next/server';

// Basic HTTP auth for the prototype. Set SITE_USER and SITE_PASSWORD in
// Vercel project settings → Environment Variables. If either is missing,
// auth is skipped (handy for local development).
export function middleware(request: NextRequest) {
  const USER = process.env.SITE_USER;
  const PASS = process.env.SITE_PASSWORD;

  if (!USER || !PASS) {
    return NextResponse.next();
  }

  const header = request.headers.get('authorization');

  if (header) {
    const encoded = header.split(' ')[1] ?? '';
    const decoded = Buffer.from(encoded, 'base64').toString();
    const [user, pass] = decoded.split(':');
    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Bunny AI Gateway Prototype"',
    },
  });
}

export const config = {
  // Run on every route except Next.js internals and static files.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)'],
};
