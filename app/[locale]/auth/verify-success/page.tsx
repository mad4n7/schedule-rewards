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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-50 p-4 ring-1 ring-green-200/50">
              <CheckCircle2Icon className="h-8 w-8 text-green-600" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">{t('emailVerified')}</CardTitle>
            <CardDescription className="text-base text-muted-foreground">{t('emailVerifiedMessage')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button
              onClick={() => router.push('/auth/signin')}
              className="w-full max-w-xs font-medium"
              size="lg"
            >
              {t('signIn')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
