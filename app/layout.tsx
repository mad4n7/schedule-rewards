import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
import { SessionProvider } from '@/components/session-provider'
import './globals.css'
import { cn } from '@/lib/utils'

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable)}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className
        )}
      >
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
