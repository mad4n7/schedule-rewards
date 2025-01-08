'use client';

import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from 'sonner';
import { ThemeProviderWrapper } from '@/components/theme-provider-wrapper';

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <div suppressHydrationWarning>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
      </NextIntlClientProvider>
      <Toaster richColors closeButton position="bottom-right" />
    </div>
  );
}
