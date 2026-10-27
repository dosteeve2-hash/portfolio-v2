'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Locale } from '@/content/locales'
import { mascotText } from '@/content/mascotText'
import type { Dictionary } from '@/content/types'
import { useIntroPhase } from '@/lib/introStore'
import { useAfterInteraction } from '@/lib/useAfterInteraction'
import { useReducedMotionSafe } from '@/lib/useReducedMotionSafe'
import AssistantMark from './AssistantMark'

const AssistantPanel = dynamic(() => import('./AssistantPanel'), { ssr: false })

const HINT_KEY = 'assistant-hint-seen'
const HINT_DELAY_MS = 5000
const HINT_VISIBLE_MS = 6500
const CLOSE_MS = 180

function Assistant({ locale, dict }: { readonly locale: Locale; readonly dict: Dictionary }) {
  const text = mascotText[locale]
  const reduced = useReducedMotionSafe()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [hint, setHint] = useState(false)

  // Une infobulle « Une question ? » apparaît quelques secondes, une seule fois par session, puis disparaît.
  useEffect(() => {
    let seen = false
    try {
      seen = window.sessionStorage.getItem(HINT_KEY) === '1'
    } catch {
      seen = false
    }
    if (seen) return undefined
    let hide = 0
    const show = window.setTimeout(() => {
      setHint(true)
      hide = window.setTimeout(() => {
        setHint(false)
        try {
          window.sessionStorage.setItem(HINT_KEY, '1')
        } catch {
          // stockage indisponible : l'infobulle pourra revenir, sans conséquence
        }
      }, HINT_VISIBLE_MS)
    }, HINT_DELAY_MS)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [])

  const close = useCallback(() => {
    setClosing(true)
    window.setTimeout(
      () => {
        setOpen(false)
        setClosing(false)
        buttonRef.current?.focus()
      },
      reduced ? 0 : CLOSE_MS,
    )
  }, [reduced])

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-40 flex flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      {open ? <AssistantPanel locale={locale} dict={dict} reduceMotion={reduced} closing={closing} onClose={close} /> : null}

      <div className="pointer-events-auto relative flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`pointer-events-none rounded-sm border border-line2 bg-navy px-3 py-1.5 font-mono text-xs text-bg shadow-soft transition-[opacity,transform] duration-500 ${
            hint && !open ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
          }`}
        >
          {text.hint}
        </span>
        <button
          ref={buttonRef}
          type="button"
          aria-label={text.open}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => (open ? close() : setOpen(true))}
          className="assistant-btn group relative grid h-14 w-14 place-items-center rounded-full border border-line2 bg-bg3 text-accent shadow-[0_10px_24px_-12px_rgba(31,79,216,0.55)] transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span
            aria-hidden="true"
            data-paused={open ? '' : undefined}
            className="assistant-ring pointer-events-none absolute inset-0 rounded-full border border-accent"
          />
          <AssistantMark size={40} />
        </button>
      </div>
    </div>
  )
}

/** Le bouton n'est monté qu'après le premier geste du visiteur (ou 8 s), une fois l'intro terminée : aucun coût au chargement. */
export default function AssistantLauncher({ locale, dict }: { readonly locale: Locale; readonly dict: Dictionary }) {
  const phase = useIntroPhase()
  const ready = useAfterInteraction(8000, phase === 'done')
  return ready ? <Assistant locale={locale} dict={dict} /> : null
}
