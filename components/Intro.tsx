'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import type { Dictionary } from '@/content/types'
import { INTRO_STORAGE_KEY } from '@/lib/introKey'
import { getIntroPhase, setIntroPhase, useIntroPhase } from '@/lib/introStore'
import Portrait from './Portrait'

const EASE = [0.22, 1, 0.36, 1] as const
const DURATION_MS = 2200

interface IntroProps {
  readonly dict: Dictionary
}

function finish() {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
  } catch {
    // le stockage de session peut être indisponible : l'intro rejouera simplement
  }
  setIntroPhase('done')
}

export default function Intro({ dict }: IntroProps) {
  const phase = useIntroPhase()

  useEffect(() => {
    if (getIntroPhase() === 'done') return

    let seen = false
    try {
      seen = sessionStorage.getItem(INTRO_STORAGE_KEY) === '1'
    } catch {
      seen = false
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (seen || reduceMotion) {
      setIntroPhase('done')
      return
    }

    setIntroPhase('playing')
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const timer = window.setTimeout(finish, DURATION_MS)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = previousOverflow
    }
  }, [])

  return (
    <AnimatePresence>
      {phase !== 'done' ? (
        <motion.div
          key="intro"
          className="intro-root fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-bg px-4"
          onClick={finish}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div
            aria-hidden="true"
            className="intro-line absolute left-1/2 top-1/2 h-px w-[min(90vw,720px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_18px_2px_rgba(240,168,50,0.55)]"
          />

          <div aria-hidden="true" className="relative z-10 flex flex-col items-center">
            <motion.div
              className="relative h-44 w-44 sm:h-56 sm:w-56"
              initial={{ y: 80, clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
            >
              <Portrait alt="" sizes="224px" priority />
              <svg viewBox="0 0 100 100" className="absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)] -rotate-90">
                <defs>
                  <linearGradient id="intro-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2dd4ff" />
                    <stop offset="100%" stopColor="#f0a832" />
                  </linearGradient>
                </defs>
                <motion.circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="url(#intro-ring)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: 'easeInOut' }}
                />
              </svg>
            </motion.div>

            <motion.div
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-green/40 bg-green/10 px-4 py-1.5 font-mono text-xs text-text"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.4, type: 'spring', stiffness: 420, damping: 16 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="7" fill="#22d98a" />
                <path d="M4 7.2l2 2L10 5" stroke="#070e1f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {dict.badge}
            </motion.div>

            <div className="mt-6 overflow-hidden px-1 pb-1 text-center">
              <motion.p
                className="font-display text-3xl font-black italic leading-tight sm:text-5xl"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 1.7, duration: 0.5, ease: EASE }}
              >
                Steeve Donald Compaoré
              </motion.p>
            </div>
            <div className="overflow-hidden px-1 pb-1 text-center">
              <motion.p
                className="font-display text-lg italic text-gold2 sm:text-2xl"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 1.85, duration: 0.5, ease: EASE }}
              >
                {dict.brand.slogan}
              </motion.p>
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              finish()
            }}
            className="absolute bottom-6 right-4 z-10 rounded-lg border border-line2 px-3 py-1.5 font-mono text-[11px] text-text2 transition-colors hover:border-gold hover:text-gold2 sm:right-6"
          >
            {dict.intro.skip} · Esc
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
