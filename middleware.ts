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
  '/auth/error',
  '/sign-out'
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
      signIn: `/${defaultLanguage}/auth/signin`,
    }
  }
);

export async function middleware(request: NextRequest) {
  const publicPatterns = publicPages.map(p => `/${defaultLanguage}${p}`);
  const isPublicPage = publicPatterns.some(p => request.nextUrl.pathname.startsWith(p));

  // Handle public pages
  if (isPublicPage) {
    return intlMiddleware(request);
  }

  // Get the pathname of the request (e.g. /, /protected, /protected/123)
  const pathname = request.nextUrl.pathname;

  try {
    // Validate token exists
    const token = await getToken({ req: request });
    
    if (!token && !isPublicPage) {
      const url = new URL(`/${defaultLanguage}/auth/signin`, request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    return authMiddleware(request);
  } catch (error) {
    // If there's an error, redirect to the error page
    const url = new URL(`/${defaultLanguage}/auth/error`, request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
