import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { defaultLanguage } from './config/languages'

const publicPages = [
  '/auth/signin',
  '/auth/signup',
  '/auth/verify',
  '/auth/verify-success',
]

// Create intl middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'pt'],
  defaultLocale: defaultLanguage,
})

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const pathname = request.nextUrl.pathname

  // Handle internationalization first
  const response = intlMiddleware(request)

  // If it's a public page, allow access
  if (publicPages.some(page => pathname.includes(page))) {
    if (token && pathname.includes('/auth')) {
      const url = new URL('/', request.url)
      return NextResponse.redirect(url)
    }
    return response
  }

  // Protected routes
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url)
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
