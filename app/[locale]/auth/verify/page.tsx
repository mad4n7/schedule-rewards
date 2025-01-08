'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4 ring-1 ring-primary/20">
              <MailIcon className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">{t('verifyEmailTitle')}</CardTitle>
            <CardDescription className="text-base text-muted-foreground">{t('verifyEmailDescription')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-center text-muted-foreground leading-relaxed">
            {t('checkEmailInstructions')}
          </p>
          <div className="flex justify-center">
            <Button
              variant="link"
              onClick={() => router.push(`/${locale}/auth/signin`)}
              className="text-primary"
            >
              {t('backToSignIn')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
