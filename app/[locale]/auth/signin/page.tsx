'use client'

import { AuthForm } from '@/components/auth/auth-form';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SignInPage() {
  const t = useTranslations();

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={30}
            height={30}
            className="mr-2"
          />
          {t('scheduleAndRewards')}
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;{t('streamlineBusinessSchedulingAndRewardLoyalCustomers')}&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('welcomeBack')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('enterCredentialsToSignIn')}
            </p>
          </div>
          <AuthForm type="signin" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            {t('byClickingContinueYouAgreeTo')}{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t('termsOfService')}
            </Link>{' '}
            {t('and')}{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t('privacyPolicy')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
