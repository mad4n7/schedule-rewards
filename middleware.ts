import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { languages, defaultLanguage } from './config/languages'
import createIntlMiddleware from 'next-intl/middleware'

const publicPages = [
  '/auth/signin',
  '/auth/signup',
  '/auth/verify',
  '/auth/verify-success',
]

// Create intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: Object.keys(languages),
  defaultLocale: defaultLanguage,
  localePrefix: 'as-needed',
})

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const pathname = request.nextUrl.pathname
  const pathnameHasLocale = Object.keys(languages).some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Handle locale routing first
  const response = await intlMiddleware(request)
  
  // If it's a public page, allow access
  if (publicPages.some(page => pathname.includes(page))) {
    if (token && pathname.includes('/auth')) {
      // Ensure the redirect URL includes the locale
      const url = new URL('/', request.url)
      if (!pathnameHasLocale) {
        url.pathname = `/${defaultLanguage}${url.pathname}`
      }
      return NextResponse.redirect(url)
    }
    return response
  }

  // Protected routes
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url)
    if (!pathnameHasLocale) {
      signInUrl.pathname = `/${defaultLanguage}${signInUrl.pathname}`
    }
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
