'use client'

import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function VerifySuccessPage() {
  const t = useTranslations('auth')

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[400px] flex-col items-center justify-center text-center">
        <CheckCircleIcon className="h-12 w-12 text-green-500" />
        <h1 className="mt-4 text-2xl font-semibold">
          {t('emailVerified')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('emailVerifiedMessage')}
        </p>
        <Link
          href="/auth/signin"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t('signIn')}
        </Link>
      </div>
    </div>
  )
}
