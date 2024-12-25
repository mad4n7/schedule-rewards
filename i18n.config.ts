import { getRequestConfig } from 'next-intl/server'
import { defaultLanguage } from './config/languages'

export default getRequestConfig(async ({ locale }) => ({
  locale: locale || defaultLanguage,
  messages: (await import(`./messages/${locale || defaultLanguage}.json`)).default,
  timeZone: 'America/Los_Angeles',
  now: new Date(),
  formats: {
    dateTime: {
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      },
    },
  },
  defaultTranslationValues: {
    appName: 'Schedule & Rewards',
  },
}))
