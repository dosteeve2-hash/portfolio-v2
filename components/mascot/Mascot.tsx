'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { Locale } from '@/content/locales'
import { fill, mascotText } from '@/content/mascotText'
import { MASCOT_NAME } from '@/content/site'
import { getDictionary } from '@/content'
import AssistantPanel from './AssistantPanel'
import MascotFigure from './MascotFigure'
import { clamp, type Expression, type LookVector } from './pose'

const STORAGE_KEY = 'mascot-hidden'
const IDLE_MS = 30_000
const REACT_AGAIN_MS = 25_000

type SectionKey = 'top' | 'about' | 'skills' | 'projects' | 'architecture' | 'certifications' | 'journey' | 'contact'

interface Step {
  readonly expression: Expression
  readonly ms: number
}

const SECTIONS: readonly SectionKey[] = [
  'top',
  'about',
  'skills',
  'projects',
  'architecture',
  'certifications',
  'journey',
  'contact',
]

const REACTIONS: Readonly<Record<SectionKey, readonly Step[]>> = {
  top: [{ expression: 'wave', ms: 3000 }],
  about: [{ expression: 'happy', ms: 3000 }],
  skills: [
    { expression: 'thinking', ms: 1900 },
    { expression: 'proud', ms: 2400 },
  ],
  projects: [{ expression: 'curious', ms: 3200 }],
  architecture: [{ expression: 'wow', ms: 3000 }],
  certifications: [{ expression: 'proud', ms: 2600 }],
  journey: [{ expression: 'happy', ms: 2600 }],
  contact: [
    { expression: 'wave', ms: 2200 },
    { expression: 'wink', ms: 1800 },
  ],
}

function readHidden(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeHidden(value: boolean): void {
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, '1')
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // stockage indisponible : la préférence ne sera simplement pas mémorisée
  }
}

export default function Mascot({ locale }: { readonly locale: Locale }) {
  const text = mascotText[locale]
  const dict = getDictionary(locale)
  const reduced = useReducedMotion() ?? false
  const panelId = useId()

  const [hidden, setHidden] = useState<boolean>(readHidden)
  const [open, setOpen] = useState(false)
  const [expression, setExpression] = useState<Expression>('neutral')
  const [hintVisible, setHintVisible] = useState(false)

  const lookRef = useRef<LookVector>({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const timers = useRef<number[]>([])
  const openRef = useRef(false)
  const hoverRef = useRef(false)
  const sleepingRef = useRef(false)
  const lastActivity = useRef(0)
  const lastReaction = useRef<Partial<Record<SectionKey, number>>>({})

  const baseExpression = useCallback((): Expression => {
    if (sleepingRef.current) return 'sleepy'
    return openRef.current ? 'happy' : 'neutral'
  }, [])

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])

  const setMood = useCallback(
    (next: Expression, holdMs?: number) => {
      clearTimers()
      setExpression(next)
      if (holdMs !== undefined) {
        timers.current.push(
          window.setTimeout(() => {
            setExpression(hoverRef.current && !openRef.current ? 'wink' : baseExpression())
          }, holdMs),
        )
      }
    },
    [baseExpression, clearTimers],
  )

  const playSteps = useCallback(
    (steps: readonly Step[]) => {
      clearTimers()
      let elapsed = 0
      steps.forEach((step) => {
        timers.current.push(
          window.setTimeout(() => {
            if (!hoverRef.current && !openRef.current) setExpression(step.expression)
          }, elapsed),
        )
        elapsed += step.ms
      })
      timers.current.push(
        window.setTimeout(() => {
          setExpression(hoverRef.current && !openRef.current ? 'wink' : baseExpression())
        }, elapsed),
      )
    },
    [baseExpression, clearTimers],
  )

  useEffect(() => {
    if (hidden) return undefined
    lastActivity.current = Date.now()
    const show = window.setTimeout(() => setHintVisible(true), 1600)
    const hide = window.setTimeout(() => setHintVisible(false), 8000)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [hidden])

  useEffect(() => {
    if (hidden) return undefined

    const wake = () => {
      lastActivity.current = Date.now()
      if (sleepingRef.current) {
        sleepingRef.current = false
        setMood('happy', 1500)
      }
    }
    const events: readonly (keyof WindowEventMap)[] = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart']
    events.forEach((name) => window.addEventListener(name, wake, { passive: true }))
    const idle = window.setInterval(() => {
      if (!sleepingRef.current && !openRef.current && Date.now() - lastActivity.current > IDLE_MS) {
        sleepingRef.current = true
        setMood('sleepy')
      }
    }, 3000)
    return () => {
      events.forEach((name) => window.removeEventListener(name, wake))
      window.clearInterval(idle)
    }
  }, [hidden, setMood])

  useEffect(() => {
    if (hidden) return undefined

    const sectionNodes = SECTIONS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null,
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const key = entry.target.id as SectionKey
          const now = Date.now()
          const last = lastReaction.current[key]
          if (key === 'top' && last !== undefined) continue
          if (last !== undefined && now - last < REACT_AGAIN_MS) continue
          lastReaction.current[key] = now
          if (sleepingRef.current || openRef.current) continue
          playSteps(REACTIONS[key])
        }
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
    )
    sectionNodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [hidden, playSteps])

  useEffect(() => {
    if (hidden || reduced) return undefined

    const coarse = window.matchMedia('(pointer: coarse)').matches
    let resetTimer = 0
    let lastY = window.scrollY

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const node = buttonRef.current
      if (!node) return
      const box = node.getBoundingClientRect()
      const cx = box.left + box.width / 2
      const cy = box.top + box.height / 2
      lookRef.current.x = clamp((event.clientX - cx) / (window.innerWidth * 0.4), -1, 1)
      lookRef.current.y = clamp((event.clientY - cy) / (window.innerHeight * 0.4), -1, 1)
    }
    const onScroll = () => {
      const delta = window.scrollY - lastY
      lastY = window.scrollY
      if (Math.abs(delta) < 2) return
      lookRef.current.y = clamp(delta / 40, -1, 1)
      lookRef.current.x = coarse ? Math.sin(window.scrollY / 180) * 0.35 : lookRef.current.x
      window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(() => {
        if (coarse) {
          lookRef.current.x = 0
          lookRef.current.y = 0
        } else {
          lookRef.current.y = 0
        }
      }, 650)
    }
    const onLeave = () => {
      lookRef.current.x = 0
      lookRef.current.y = 0
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerleave', onLeave)
      window.clearTimeout(resetTimer)
    }
  }, [hidden, reduced])

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), [])

  const closePanel = useCallback(() => {
    openRef.current = false
    setOpen(false)
    setMood(baseExpression())
    buttonRef.current?.focus()
  }, [baseExpression, setMood])

  const toggle = () => {
    if (open) {
      closePanel()
      return
    }
    openRef.current = true
    sleepingRef.current = false
    setHintVisible(false)
    setOpen(true)
    setMood('laugh', 1100)
  }

  const hide = () => {
    openRef.current = false
    setOpen(false)
    clearTimers()
    writeHidden(true)
    setHidden(true)
  }

  const reveal = () => {
    writeHidden(false)
    lastActivity.current = Date.now()
    setHidden(false)
    setExpression('wave')
    timers.current.push(window.setTimeout(() => setExpression('neutral'), 2200))
  }

  if (hidden) {
    return (
      <div className="pointer-events-none fixed bottom-3 right-3 z-40 sm:bottom-5 sm:right-5">
        <button
          type="button"
          onClick={reveal}
          aria-label={text.show}
          title={text.show}
          className="pointer-events-auto block h-11 w-11 overflow-hidden rounded-full border border-gold/50 bg-bg3 shadow-lg transition-transform hover:scale-105"
        >
          <span className="block w-[150%] -translate-x-[17%] translate-y-[4%]">
            <MascotFigure expression="neutral" animated={false} />
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-40 flex flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            id={panelId}
            initial={{ opacity: 0, y: reduced ? 0 : 14, scale: reduced ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : 10 }}
            transition={{ duration: reduced ? 0.12 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="origin-bottom-right"
          >
            <AssistantPanel locale={locale} dict={dict} reduceMotion={reduced} onMood={setMood} onClose={closePanel} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="group relative">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-1/2 right-full mr-1 hidden w-max max-w-[11rem] rounded-xl rounded-br-sm border border-line2 bg-bg3 px-3 py-2 text-xs text-text shadow-lg transition-opacity duration-300 sm:block ${
            hintVisible && !open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {text.hint}
        </div>
        <button
          ref={buttonRef}
          type="button"
          onClick={toggle}
          onPointerEnter={(event) => {
            if (event.pointerType !== 'mouse') return
            hoverRef.current = true
            if (sleepingRef.current) {
              sleepingRef.current = false
            }
            if (!openRef.current) {
              clearTimers()
              setExpression('wink')
            }
          }}
          onPointerLeave={() => {
            hoverRef.current = false
            if (!openRef.current) setExpression(baseExpression())
          }}
          aria-label={fill(text.open, { name: MASCOT_NAME })}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-haspopup="dialog"
          className="pointer-events-auto block w-24 cursor-pointer rounded-full transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] md:w-32 xl:w-40 2xl:w-[180px]"
        >
          <MascotFigure expression={expression} lookRef={reduced ? undefined : lookRef} animated={!reduced} />
        </button>
        <button
          type="button"
          onClick={hide}
          aria-label={text.hide}
          title={text.hide}
          className="pointer-events-auto absolute -left-1 top-0 grid h-7 w-7 place-items-center rounded-full border border-line2 bg-bg2/90 text-text2 opacity-70 transition-opacity hover:border-gold hover:text-text focus-visible:opacity-100 group-hover:opacity-100"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
