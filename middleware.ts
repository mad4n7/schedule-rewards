import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { languages, defaultLanguage } from './config/languages'
import createMiddleware from 'next-intl/middleware';
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

const intlMiddleware = createMiddleware({
  locales: Object.keys(languages),
  defaultLocale: defaultLanguage,
  localePrefix: 'always',
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
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = pathname.split('/')[1];
  const response = NextResponse.next();

  // Set locale in cookie
  if (Object.keys(languages).includes(pathnameLocale)) {
    response.cookies.set('locale', pathnameLocale);
  }

  // Handle public pages
  const publicPatterns = publicPages.map(p => `/${defaultLanguage}${p}`);
  const isPublicPage = publicPatterns.some(p => pathname.startsWith(p));

  if (isPublicPage) {
    return intlMiddleware(request);
  }

  try {
    // Validate token exists
    const token = await getToken({ req: request });
    
    if (!token) {
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
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
