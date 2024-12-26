import { getRequestConfig } from 'next-intl/server';
import { defaultLanguage } from '@/config/languages';
import { nextIntlConfig } from '@/config/next-intl';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../../messages/${locale}.json`)).default,
  timeZone: nextIntlConfig.timeZone,
  now: new Date(),
  locale: locale ?? defaultLanguage,
  defaultTranslationValues: nextIntlConfig.defaultTranslationValues,
}));
