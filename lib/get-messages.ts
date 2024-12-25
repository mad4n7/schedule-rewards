import { Locale } from '@/config/i18n-config';
import { notFound } from 'next/navigation';

export async function getMessages(locale: Locale) {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}
