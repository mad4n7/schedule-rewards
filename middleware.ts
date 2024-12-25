import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { languages, defaultLanguage } from './config/languages'
import createMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';

const publicPages = [
  '/auth/signin',
  '/auth/signup',
  '/auth/verify',
  '/auth/verify-success',
]

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales: Object.keys(languages),
  defaultLocale: defaultLanguage,
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  // Get locale from URL (e.g., /en/... or /pt/...)
  const pathnameLocale = pathname.split('/')[1];
  const isValidLocale = Object.keys(languages).includes(pathnameLocale);
  const locale = isValidLocale ? pathnameLocale : defaultLanguage;

  // Strip locale prefix for checking paths
  const pathnameWithoutLocale = isValidLocale 
    ? pathname.replace(`/${pathnameLocale}`, '')
    : pathname;

  // If it's a public page, allow access
  if (publicPages.some(page => pathnameWithoutLocale.startsWith(page))) {
    // If user is authenticated and trying to access auth pages, redirect to home
    if (token && pathnameWithoutLocale.startsWith('/auth')) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    return intlMiddleware(request);
  }

  // For the root path, redirect to the default locale if not authenticated
  if (pathnameWithoutLocale === '/') {
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url));
    }
    return intlMiddleware(request);
  }

  // Protected routes
  if (!token) {
    const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
