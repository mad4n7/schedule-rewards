import { Inter } from 'next/font/google';
import { languages } from '@/config/languages';
import { notFound } from 'next/navigation';
import { Locale } from '@/config/i18n-config';
import { cn } from '@/lib/utils';
import { unstable_setRequestLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth/next';
import { Providers } from '@/components/providers';
import { nextIntlConfig } from '@/config/next-intl';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateStaticParams() {
  return Object.keys(languages).map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const locale = params.locale;

  // Enable static rendering
  unstable_setRequestLocale(locale);

  // Validate that the incoming `locale` parameter is valid
  if (!Object.keys(languages).includes(locale)) notFound();

  const [session, messages] = await Promise.all([
    getServerSession(),
    import(`../../messages/${locale}.json`).then(module => module.default)
  ]);

  return (
    <html lang={locale} suppressHydrationWarning className={cn(inter.variable)}>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
        <Providers
          session={session}
          locale={locale}
          messages={messages}
          timeZone={nextIntlConfig.timeZone}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
