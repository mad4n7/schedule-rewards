import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
import { SessionProvider } from '@/components/session-provider'
import { NextIntlClientProvider } from 'next-intl'
import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { defaultLanguage } from '@/config/languages'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'Schedule & Rewards',
  description: 'A modern scheduling and rewards platform',
  viewport: 'width=device-width, initial-scale=1',
}

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    return (await import(`@/messages/${defaultLanguage}.json`)).default
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const session = await getServerSession()
  const messages = await getMessages(locale || defaultLanguage)

  return (
    <html lang={locale || defaultLanguage} suppressHydrationWarning className={cn(inter.variable)}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className
        )}
      >
        <NextIntlClientProvider messages={messages} locale={locale || defaultLanguage}>
          <SessionProvider session={session}>{children}</SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
