import type { Locale } from './locales'

export const PORTRAIT_SRC = '/portrait.jpg'

export const MASCOT_NAME = 'Steeve'

export const PORTRAIT_FOCUS = { position: '43% 50%', scale: 1.3 } as const

interface SiteConfig {
  readonly name: string
  readonly email: string
  readonly githubUser: string
  readonly linkedinUrl: string
  readonly cvAvailable: boolean
}

export const SITE: SiteConfig = {
  name: 'Steeve Donald Compaoré',
  email: 'dosteeve2@gmail.com',
  githubUser: 'dosteeve2-hash',
  linkedinUrl: 'https://www.linkedin.com/in/steeve-donald-compaor%C3%A9-65ba13296/',
  cvAvailable: false,
}

export function githubUrl(): string {
  return `https://github.com/${SITE.githubUser}`
}

export function cvPdfPath(locale: Locale): string {
  return `/cv/Steeve-Donald-Compaore-CV-${locale}.pdf`
}

export function cvHref(locale: Locale): string {
  return SITE.cvAvailable ? cvPdfPath(locale) : `/${locale}/cv`
}
