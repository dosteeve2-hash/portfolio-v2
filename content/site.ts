import type { Locale } from './locales'

export const PORTRAIT_SRC = '/portrait.jpg'

export const PORTRAIT_FOCUS = { position: '43% 50%', scale: 1.3 } as const

interface SiteConfig {
  readonly name: string
  readonly email: string
  readonly githubUser: string
  readonly linkedinUrl: string
  readonly cvAvailable: boolean
}

export const SITE: SiteConfig = {
  name: 'Steve Donald Compaoré',
  email: 'docompaore2@gmail.com',
  githubUser: 'dosteeve2-hash',
  linkedinUrl: '',
  cvAvailable: false,
}

export function githubUrl(): string {
  return `https://github.com/${SITE.githubUser}`
}

export function cvPdfPath(locale: Locale): string {
  return `/cv/Steve-Donald-Compaore-CV-${locale}.pdf`
}

export function cvHref(locale: Locale): string {
  return SITE.cvAvailable ? cvPdfPath(locale) : `/${locale}/cv`
}
