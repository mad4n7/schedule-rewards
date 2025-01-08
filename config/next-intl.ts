export const defaultTimeZone = 'America/Los_Angeles';

export const nextIntlConfig = {
  defaultLocale: 'en',
  locales: ['en', 'es'],
  timeZone: defaultTimeZone,
  defaultTranslationValues: {
    strong: (chunks: string) => `<strong>${chunks}</strong>`,
  },
};
