import { locales, type Locale } from '@/content/locales'

/** Adresses canoniques et alternatives de langue (hreflang) d'une page, `suffix` valant '' (accueil), '/stage' ou '/emploi'. */
export function localeAlternates(locale: Locale, suffix: string) {
  return {
    canonical: `/${locale}${suffix}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${suffix}`])),
      'x-default': `/en${suffix}`,
    },
  }
}
