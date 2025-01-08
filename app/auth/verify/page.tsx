'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailIcon } from 'lucide-react';

export default function VerifyPage() {
  const t = useTranslations('auth');

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <MailIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>{t('verifyEmailTitle')}</CardTitle>
          <CardDescription>{t('verifyEmailDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            {t('checkEmailInstructions')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
