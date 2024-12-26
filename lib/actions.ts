'use server';

import { cookies } from 'next/headers';
import { defaultLanguage } from '@/config/languages';

export async function getLocaleFromParams(params: { locale: string }) {
  const cookieStore = cookies();
  const locale = params.locale || defaultLanguage;
  cookieStore.set('locale', locale);
  return locale;
}
