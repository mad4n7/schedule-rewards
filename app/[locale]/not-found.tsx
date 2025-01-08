import { getTranslations } from 'next-intl/server';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Locale } from '@/config/i18n-config';

type Props = {
  params: { locale: Locale };
};

export default async function NotFoundPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{t('notFound.title')}</h1>
      <p className="text-lg text-gray-600 mb-8">{t('notFound.description')}</p>
      <a
        href={`/${locale}`}
        className="text-primary hover:underline"
      >
        {t('notFound.backHome')}
      </a>
    </div>
  );
}
