import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { languages } from '@/config/languages';
import { notFound } from 'next/navigation';
import { Locale } from '@/config/i18n-config';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export function generateStaticParams() {
  return Object.keys(languages).map((locale) => ({ locale }));
}

export default function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  const messages = useMessages();

  // Validate that the incoming `locale` parameter is valid
  if (!Object.keys(languages).includes(locale)) notFound();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
