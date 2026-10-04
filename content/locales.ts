export const locales = ['fr', 'en', 'tr'] as const

export type Locale = (typeof locales)[number]

export type Localized = Readonly<Record<Locale, string>>

export const defaultLocale: Locale = 'en'

export const LOCALE_COOKIE = 'NEXT_LOCALE'

export function isLocale(value: string | undefined | null): value is Locale {
  return value !== undefined && value !== null && (locales as readonly string[]).includes(value)
}

export const localeMeta: Readonly<Record<Locale, { flag: string; code: string; name: string }>> = {
  fr: { flag: '🇫🇷', code: 'FR', name: 'Français' },
  en: { flag: '🇬🇧', code: 'EN', name: 'English' },
  tr: { flag: '🇹🇷', code: 'TR', name: 'Türkçe' },
}

export function same(value: string): Localized {
  return { fr: value, en: value, tr: value }
}
