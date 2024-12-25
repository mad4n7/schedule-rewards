'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signInSchema, signUpSchema } from '@/lib/validations/auth.schema'
import type * as z from 'zod'
import { useTranslations } from 'next-intl'

type FormData = z.infer<typeof signInSchema> | z.infer<typeof signUpSchema>

interface AuthFormProps {
  type: 'signin' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const t = useTranslations('auth')
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const schema = type === 'signin' ? signInSchema : signUpSchema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('Submitting form:', { ...data, password: '[REDACTED]' });
      
      if (type === 'signup') {
        console.log('Sending request to:', '/api/auth/register');
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            confirmPassword: (data as z.infer<typeof signUpSchema>).confirmPassword,
            locale: (data as z.infer<typeof signUpSchema>).locale || 'en',
          }),
        });

        const responseData = await res.json().catch(() => null);
        console.log('Response status:', res.status);
        console.log('Response data:', responseData);

        if (!res.ok) {
          const errorMessage = responseData?.error || t('registrationFailed');
          setError(errorMessage);
          return;
        }

        // Show success message and redirect to verification page
        const locale = (data as z.infer<typeof signUpSchema>).locale || 'en';
        router.push(`/${locale}/auth/verify`);
        return;
      } else {
        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        })

        if (result?.error) {
          throw new Error(t('invalidCredentials'))
        }

        const locale = (data as z.infer<typeof signInSchema>).locale || 'en';
        router.push(`/${locale}/dashboard`)
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(t('invalidCredentials'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {type === 'signup' && (
            <div className="grid gap-2">
              <Input
                {...register('name')}
                placeholder={t('name')}
                type="text"
                autoCapitalize="none"
                autoComplete="name"
                autoCorrect="off"
                disabled={isLoading}
              />
              {errors?.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          )}
          <div className="grid gap-2">
            <Input
              {...register('email')}
              placeholder={t('email')}
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
            {errors?.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Input
              {...register('password')}
              placeholder={t('password')}
              type="password"
              autoComplete={type === 'signup' ? 'new-password' : 'current-password'}
              disabled={isLoading}
            />
            {errors?.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          {type === 'signup' && (
            <div className="grid gap-2">
              <Input
                {...register('confirmPassword')}
                placeholder={t('confirmPassword')}
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
              />
              {errors?.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}
          <Button disabled={isLoading}>
            {isLoading ? t('loading') : type === 'signin' ? t('signIn') : t('signUp')}
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('or')}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={() => signIn('google')}
      >
        {t('continue', { provider: 'Google' })}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {type === 'signin' ? (
          <>
            {t('dontHaveAccount')}{' '}
            <Button
              variant="link"
              className="p-0 text-primary"
              onClick={() => router.push('/auth/signup')}
            >
              {t('signUp')}
            </Button>
          </>
        ) : (
          <>
            {t('alreadyHaveAccount')}{' '}
            <Button
              variant="link"
              className="p-0 text-primary"
              onClick={() => router.push('/auth/signin')}
            >
              {t('signIn')}
            </Button>
          </>
        )}
      </p>
    </div>
  )
}
