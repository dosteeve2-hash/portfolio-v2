'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localeMeta, locales, type Locale } from '@/content/locales'
import { rememberLocale } from '@/lib/rememberLocale'

interface LanguageSwitcherProps {
  readonly current: Locale
  readonly label: string
}

function pathFor(pathname: string, target: Locale): string {
  const segments = pathname.split('/')
  segments[1] = target
  return segments.join('/') || `/${target}`
}

export default function LanguageSwitcher({ current, label }: LanguageSwitcherProps) {
  const pathname = usePathname()

  return (
    <div role="group" aria-label={label} className="flex items-center gap-1">
      {locales.map((locale) => {
        const meta = localeMeta[locale]
        const active = locale === current
        return (
          <Link
            key={locale}
            href={pathFor(pathname, locale)}
            hrefLang={locale}
            lang={locale}
            aria-label={meta.name}
            aria-current={active ? 'true' : undefined}
            onClick={() => rememberLocale(locale)}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 font-mono text-[11px] transition-colors ${
              active
                ? 'border-gold bg-gold/10 text-gold2'
                : 'border-transparent text-text2 hover:border-line2 hover:text-text'
            }`}
          >
            <span aria-hidden="true">{meta.flag}</span>
            <span>{meta.code}</span>
          </Link>
        )
      })}
    </div>
  )
}
