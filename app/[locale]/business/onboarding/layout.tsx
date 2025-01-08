import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { unstable_setRequestLocale } from 'next-intl/server';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function OnboardingLayout({ children, params: { locale } }: OnboardingLayoutProps) {
  unstable_setRequestLocale(locale);
  
  const user = await getCurrentUser();
  
  if (!user) {
    redirect(`/${locale}/auth/signin?callbackUrl=/${locale}/business/onboarding`);
  }

  return children;
}
