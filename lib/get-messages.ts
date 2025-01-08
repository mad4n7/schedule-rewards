import { Locale } from '@/config/i18n-config';

export async function getMessages(locale: Locale) {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    throw new Error(`Failed to load messages for locale: ${locale}`);
  }
}
