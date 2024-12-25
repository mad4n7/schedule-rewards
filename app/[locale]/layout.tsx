import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { languages } from '@/config/languages'

export function generateStaticParams() {
  return Object.keys(languages).map((locale) => ({ locale }))
}

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages(locale)

  if (!Object.keys(languages).includes(locale)) {
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
