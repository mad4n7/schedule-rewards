import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { languages, defaultLanguage } from './config/languages'
import createIntlMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

const publicPages = [
  '/auth/signin',
  '/auth/signup',
  '/auth/verify',
  '/auth/verify-success',
  '/auth/error'
];

const intlMiddleware = createIntlMiddleware({
  locales: Object.keys(languages),
  defaultLocale: defaultLanguage,
  localePrefix: 'always'
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
      verifyRequest: '/auth/verify'
    }
  }
);

export default async function middleware(request: NextRequest) {
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

  const publicPatterns = publicPages.map(
    (p) => `/${locale}${p}`
  );

  if (publicPatterns.some((p) => request.nextUrl.pathname.startsWith(p))) {
    return intlMiddleware(request);
  }

  // For the root path, redirect to the default locale if not authenticated
  if (pathnameWithoutLocale === '/') {
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url));
    }
    const response = intlMiddleware(request);
    return response;
  }

  return (authMiddleware as any)(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
