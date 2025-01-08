'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{t('error.title')}</h1>
      <p className="text-lg text-gray-600 mb-8">{t('error.description')}</p>
      <button
        onClick={reset}
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
      >
        {t('error.tryAgain')}
      </button>
    </div>
  );
}
