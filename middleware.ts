import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/auth/signin' || 
                      path === '/auth/signup' || 
                      path === '/api/auth';

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/api/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
