import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, isLocale, LOCALE_COOKIE, locales, type Locale } from '@/content/locales'

function fromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.trim().split(';')
      const q = params.find((p) => p.trim().startsWith('q='))
      const weight = q ? Number.parseFloat(q.trim().slice(2)) : 1
      return { primary: tag.trim().toLowerCase().split('-')[0] ?? '', weight: Number.isNaN(weight) ? 0 : weight }
    })
    .sort((a, b) => b.weight - a.weight)
  for (const { primary } of ranked) {
    if (isLocale(primary)) return primary
  }
  return null
}

function pickLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(cookie)) return cookie
  return fromAcceptLanguage(request.headers.get('accept-language')) ?? defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/${pickLocale(request)}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
