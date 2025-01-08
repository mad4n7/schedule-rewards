'use client'

import { useTranslations } from 'next-intl'
import { signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function SignOutPage() {
  const t = useTranslations('auth')
  const { locale } = useParams()

  useEffect(() => {
    // Automatically sign out when the page loads with locale-aware redirect
    signOut({ 
      redirect: true,
      callbackUrl: `/${locale}/auth/signin`
    })
  }, [locale])

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/logo.svg"
            alt="Schedule & Rewards"
            width={32}
            height={32}
            className="mr-2"
          />
          Schedule & Rewards
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              {t('signOutSuccessMessage')}
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <Image
                  src="/logo.svg"
                  alt="Schedule & Rewards"
                  width={48}
                  height={48}
                />
              </div>
              <h2 className="text-2xl text-center font-semibold tracking-tight">
                {t('signedOut')}
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                {t('signOutDescription')}
              </p>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button asChild>
                <Link href={`/${locale}/auth/signin`}>
                  {t('signIn')}
                </Link>
              </Button>
            </CardContent>
            <CardFooter>
              <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                  href={`/${locale}`}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {t('backToHome')}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
