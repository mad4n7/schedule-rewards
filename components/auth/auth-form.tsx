'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signInSchema, signUpSchema } from '@/lib/validations/auth.schema';
import type * as z from 'zod';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

type FormData = z.infer<typeof signInSchema> | z.infer<typeof signUpSchema>;

interface AuthFormProps {
  type: 'signin' | 'signup';
}

export function AuthForm({ type }: AuthFormProps) {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const schema = type === 'signin' ? signInSchema : signUpSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (type === 'signup') {
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

        if (!res.ok) {
          const responseData = await res.json();
          setError(responseData.error || t('registrationFailed'));
          return;
        }

        const locale = (data as z.infer<typeof signUpSchema>).locale || 'en';
        router.push(`/${locale}/auth/verify`);
      } else {
        const locale = (data as z.infer<typeof signInSchema>).locale || 'en';

        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        }).catch(error => {
          console.error('SignIn error:', error);
          return null;
        });

        if (!result || result.error) {
          setError(t('invalidCredentials'));
          return;
        }

        if (result.ok) {
          router.push(`/${locale}/dashboard`);
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError(t('invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          {type === 'signup' && (
            <div className="grid gap-2">
              <Input
                {...register('name')}
                placeholder={t('name')}
                disabled={isLoading}
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          )}
          
          <div className="grid gap-2">
            <Input
              {...register('email')}
              placeholder={t('email')}
              type="email"
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Input
              {...register('password')}
              placeholder={t('password')}
              type="password"
              disabled={isLoading}
              autoComplete={type === 'signin' ? 'current-password' : 'new-password'}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          {type === 'signup' && (
            <div className="grid gap-2">
              <Input
                {...register('confirmPassword')}
                placeholder={t('confirmPassword')}
                type="password"
                disabled={isLoading}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? t('loading') : type === 'signin' ? t('signIn') : t('register')}
          </Button>
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
              onClick={() => router.push(`/${locale}/auth/signup`)}
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
              onClick={() => router.push(`/${locale}/auth/signin`)}
            >
              {t('signIn')}
            </Button>
          </>
        )}
      </p>
    </div>
  );
}
