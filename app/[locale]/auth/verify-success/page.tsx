'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function VerifySuccessPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle2Icon className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            {t('emailVerifiedSuccess')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={() => router.push(`/${locale}/auth/signin`)}
            className="mt-4"
          >
            {t('signIn')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
