import { LOCALE_COOKIE, type Locale } from '@/content/locales'

export function rememberLocale(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
}
