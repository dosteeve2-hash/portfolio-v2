'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Locale } from '@/content/locales'
import type { Dictionary } from '@/content/types'
import { useIntroPhase } from '@/lib/introStore'
import LanguageSwitcher from './LanguageSwitcher'

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

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <motion.header
      data-hero
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 border-b border-line/80 bg-bg"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          aria-label={dict.nav.home}
          className="font-display text-xl font-black italic text-gold"
        >
          SDC
        </Link>

        <nav aria-label={dict.nav.label} className="hidden items-center gap-5 xl:flex">
          {sections.map((id) => (
            <Link
              key={id}
              href={`/${locale}#${id}`}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-text2 transition-colors hover:text-gold2"
            >
              {dict.nav[id]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher current={locale} label={dict.language.label} />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line2 text-text xl:hidden"
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
          className="border-t border-line bg-bg2 px-4 py-4 sm:px-6 xl:hidden"
        >
          <ul className="flex flex-col">
            {sections.map((id) => (
              <li key={id}>
                <Link
                  href={`/${locale}#${id}`}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-mono text-xs uppercase tracking-[0.14em] text-text2 hover:text-gold2"
                >
                  {dict.nav[id]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </motion.header>
  )
}
