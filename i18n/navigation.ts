import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { languages, defaultLanguage } from '@/config/languages'

export const locales = Object.keys(languages)
export const defaultLocale = defaultLanguage

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, defaultLocale })
