'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/lib/validations/auth.schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Locale } from '@/config/i18n-config';
import { useTranslations } from 'next-intl';

interface Props {
  params: { locale: Locale };
}

export default function RegisterPage({ params: { locale } }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          locale,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success(t('auth.verificationEmailSent'));
      router.push(`/${locale}/auth/verify`);
    } catch (error) {
      console.error('[REGISTER_ERROR]', error);
      toast.error(t('auth.errors.registration'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('auth.register')}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            {t('auth.name')}
          </label>
          <input
            {...register('name')}
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t('auth.email')}
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            {t('auth.password')}
          </label>
          <input
            {...register('password')}
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            {t('auth.confirmPassword')}
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? t('auth.registering') : t('auth.register')}
        </button>

        <p className="text-center text-sm">
          {t('auth.alreadyHaveAccount')}{' '}
          <a href={`/${locale}/auth/signin`} className="text-primary hover:underline">
            {t('auth.signIn')}
          </a>
        </p>
      </form>
    </div>
  );
}
