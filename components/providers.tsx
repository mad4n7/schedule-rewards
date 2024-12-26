'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
  timeZone: string;
  session: any;
}

export function Providers({
  children,
  locale,
  messages,
  timeZone,
  session
}: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </SessionProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
