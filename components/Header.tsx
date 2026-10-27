'use client'

import * as m from 'motion/react-m'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/content/locales'
import type { Dictionary } from '@/content/types'
import { useIntroPhase } from '@/lib/introStore'
import LanguageSwitcher from './LanguageSwitcher'

const entryPages = ['stage', 'emploi'] as const

interface HeaderProps {
  readonly locale: Locale
  readonly dict: Dictionary
  readonly immediate?: boolean
}

const sections = ['about', 'skills', 'projects', 'architecture', 'certifications', 'journey', 'contact'] as const

export default function Header({ locale, dict, immediate = false }: HeaderProps) {
  const phase = useIntroPhase()
  const visible = immediate || phase === 'done'
  const [open, setOpen] = useState(false)
  const bar = useRef<HTMLSpanElement>(null)

  // Barre de lecture de 1 px : un seul écouteur passif, une écriture de transform par image.
  useEffect(() => {
    const node = bar.current
    if (!node) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      node.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0})`
    }
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <m.header
      data-hero
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          prefetch={false}
          aria-label={dict.nav.home}
          className="group relative inline-flex min-h-11 min-w-11 items-center font-display text-xl font-semibold tracking-tight text-navy"
        >
          SDC
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-0 h-[2px] w-full origin-left scale-x-50 bg-accent transition-transform duration-300 group-hover:scale-x-100"
          />
        </Link>

        <nav aria-label={dict.nav.label} className="hidden items-center gap-5 xl:flex">
          {sections.map((id) => (
            <Link
              key={id}
              href={`/${locale}#${id}`}
              prefetch={false}
              className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.14em] text-text2 transition-colors hover:text-accent"
            >
              {dict.nav[id]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <nav aria-label={`${dict.nav.stage} / ${dict.nav.emploi}`} className="mr-1 hidden items-center gap-1 border-l border-line2 pl-3 md:flex">
            {entryPages.map((page) => (
              <Link
                key={page}
                href={`/${locale}/${page}`}
                prefetch={false}
                className="inline-flex min-h-11 items-center px-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text2 transition-colors hover:text-accent"
              >
                {dict.nav[page]}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher current={locale} label={dict.language.label} />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-line2 bg-bg3 text-text xl:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              {open ? (
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-menu"
          aria-label={dict.nav.label}
          className="border-t border-line bg-bg px-4 py-4 shadow-soft sm:px-6 xl:hidden"
        >
          <ul className="flex flex-col">
            {entryPages.map((page) => (
              <li key={page}>
                <Link
                  href={`/${locale}/${page}`}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="block min-h-11 py-3 font-mono text-xs uppercase tracking-[0.14em] text-accent"
                >
                  {dict.nav[page]} →
                </Link>
              </li>
            ))}
            {sections.map((id) => (
              <li key={id}>
                <Link
                  href={`/${locale}#${id}`}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="block min-h-11 py-3 font-mono text-xs uppercase tracking-[0.14em] text-text2 hover:text-accent"
                >
                  {dict.nav[id]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    <span
        ref={bar}
        aria-hidden="true"
        className="read-progress pointer-events-none absolute bottom-[-1px] left-0 block h-px w-full bg-accent"
      />
    </m.header>
  )
}
