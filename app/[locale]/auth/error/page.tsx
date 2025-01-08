'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ErrorPage() {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Verification':
        return t('emailVerificationRequired');
      case 'AccessDenied':
        return t('invalidCredentials');
      default:
        return t('errors.registration');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-4 ring-1 ring-red-200">
              <AlertCircle className="h-8 w-8 text-red-600" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">{t('error')}</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {getErrorMessage(error)}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            asChild
            className="w-full max-w-xs font-medium"
            size="lg"
          >
            <Link href="/auth/signin">
              {t('signIn')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
