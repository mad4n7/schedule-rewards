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
  localePrefix: 'always'
})

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const pathname = request.nextUrl.pathname

  // Handle locale routing first
  const response = await intlMiddleware(request)

  // Strip locale prefix for checking paths
  const pathnameWithoutLocale = pathname.replace(/^\/[^/]+/, '')
  
  // If it's a public page, allow access
  if (publicPages.some(page => pathnameWithoutLocale.startsWith(page))) {
    if (token && pathnameWithoutLocale.startsWith('/auth')) {
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
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
