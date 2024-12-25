export const languages = {
  en: process.env.NEXT_PUBLIC_LANG_EN || 'English',
  pt: process.env.NEXT_PUBLIC_LANG_PT || 'Português',
} as const;

export type Language = keyof typeof languages;

export function isValidLanguage(lang: string): lang is Language {
  return Object.keys(languages).includes(lang);
}

export const defaultLanguage = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en';
