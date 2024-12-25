'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function VerifySuccessPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2Icon className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>{t('emailVerified')}</CardTitle>
          <CardDescription>{t('emailVerifiedMessage')}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={() => router.push('/auth/signin')}
            className="mt-4"
          >
            {t('signIn')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
