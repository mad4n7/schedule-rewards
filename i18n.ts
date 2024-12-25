import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { languages } from './config/languages';
 
// Can be imported from a shared config
const locales = Object.keys(languages);
 
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
 
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
