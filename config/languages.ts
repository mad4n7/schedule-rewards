export const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  pt: { name: 'Português', flag: '🇧🇷' },
} as const;

export type Language = keyof typeof languages;

export function isValidLanguage(lang: string): lang is Language {
  return Object.keys(languages).includes(lang);
}

export const defaultLanguage = process.env.DEFAULT_LANGUAGE || 'en';
