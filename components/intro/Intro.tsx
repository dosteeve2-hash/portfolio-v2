'use client'

import { AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { introTimelines } from '@/content/intro'
import type { Locale } from '@/content/locales'
import type { Dictionary } from '@/content/types'
import { INTRO_STORAGE_KEY } from '@/lib/introKey'
import { getIntroPhase, setIntroHandoff, setIntroPhase, useIntroPhase } from '@/lib/introStore'
import { useIntroVoice } from './IntroVoice'
import Scene, { emptyFlight, type Flight, type FrameSize } from './Scene'
import { buildSchedule, VOICE_AT } from './schedule'

interface IntroProps {
  readonly locale: Locale
  readonly dict: Dictionary
}

const SKIP_KEYS = new Set(['Escape', 'ArrowDown', 'PageDown', 'End', ' '])

function rememberSeen(): void {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
  } catch {
    // stockage de session indisponible : l'intro rejouera simplement
  }
}

function frameSize(): FrameSize {
  const w = Math.round(Math.min(window.innerWidth * 0.84, 720))
  const h = Math.round(Math.min(340, Math.max(240, w * 0.48)))
  return { w, h }
}

function center(rect: DOMRect): { x: number; y: number } {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

function onScreen(rect: DOMRect): boolean {
  return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight
}

/**
 * Intro « vidéo faite avec du code » : une horloge unique (en secondes) pilote chaque
 * élément de la scène ; elle se recale sur la voix off quand celle-ci joue.
 * L'allumage (point, règle, grille) est en CSS pour être visible avant l'hydratation.
 */
export default function Intro({ locale, dict }: IntroProps) {
  const voice = useIntroVoice()
  const schedule = useMemo(() => buildSchedule(introTimelines[locale]), [locale])
  const t = useMotionValue(0)
  const phase = useIntroPhase()
  // Après l'atterrissage, la scène reste quelques instants le temps de se dissoudre dans la page.
  const [lingering, setLingering] = useState(false)
  const visible = phase !== 'done' || lingering
  const [size, setSize] = useState<FrameSize | null>(null)
  const [interactive, setInteractive] = useState(true)

  const nameRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const flight = useRef<Flight>(emptyFlight())
  const stopRef = useRef<() => void>(() => undefined)

  const backdrop = useTransform(t, (v) => {
    if (v <= schedule.flyStart) return 1
    if (v >= schedule.flyEnd) return 0
    const p = (v - schedule.flyStart) / (schedule.flyEnd - schedule.flyStart)
    return 1 - p * p * (3 - 2 * p)
  })
  const grid = useTransform(t, (v) => {
    const from = schedule.phase4 + 0.2
    const to = schedule.flyStart + 0.3
    return v <= from ? 1 : v >= to ? 0 : 1 - (v - from) / (to - from)
  })
  // La règle se replie vers son centre pendant que les coins du cadre se tracent.
  const rule = useTransform(t, (v) => {
    const p = Math.min(1, Math.max(0, (v - schedule.phase2 + 0.1) / 0.3))
    return 1 - p * p * (3 - 2 * p)
  })

  const skip = useCallback(() => stopRef.current(), [])
  // Le geste qui vient de déclencher la voix ne doit pas, par son clic, passer aussi l'intro.
  const skipFromBackdrop = useCallback(() => {
    if (!voice.justStartedByGesture()) stopRef.current()
  }, [voice])
  // Aube : une lueur chaude qui traverse la nuit pendant que la scène se dissout dans la page claire.
  const dawn = useTransform(t, (v) => {
    const rise = Math.min(1, Math.max(0, (v - (schedule.flyStart - 0.1)) / 0.35))
    const fall = Math.min(1, Math.max(0, (v - (schedule.flyStart + 0.3)) / (schedule.flyEnd - schedule.flyStart - 0.3)))
    return rise * rise * (3 - 2 * rise) * (1 - fall * fall * (3 - 2 * fall))
  })
  const skipOpacity = useTransform(dawn, (d) => 1 - Math.min(1, d * 2))

  useEffect(() => {
    if (getIntroPhase() === 'done') return undefined
    let seen = false
    try {
      seen = sessionStorage.getItem(INTRO_STORAGE_KEY) === '1'
    } catch {
      seen = false
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (seen || reduceMotion) {
      setIntroPhase('done')
      if (!seen && voice.available) voice.offer()
      rememberSeen()
      return undefined
    }

    setIntroPhase('playing')
    voice.prepare()
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    // L'horloge part du début de l'allumage CSS, sans dépasser 0,3 s de retard d'hydratation.
    let origin = performance.now()
    const ignition = dotRef.current?.getAnimations()[0]?.startTime
    if (typeof ignition === 'number') origin = Math.max(ignition, performance.now() - 300)

    let frame = 0
    let running = true
    let voiceStarted = false
    // L'horloge ne se recale sur la voix qu'une fois sa lecture confirmée (lecture automatique ou « Écouter »).
    let syncing = false
    let flying = false
    let measured = false
    let landed = false
    let unlocked = false

    const unlock = () => {
      if (unlocked) return
      unlocked = true
      root.style.overflow = previousOverflow
    }

    const measure = () => {
      measured = true
      const name = nameRef.current?.getBoundingClientRect()
      const line = lineRef.current?.getBoundingClientRect()
      const nameTarget = document.querySelector<HTMLElement>('[data-intro-target="name"]')?.getBoundingClientRect()
      const lineNode = document.querySelector<HTMLElement>('[data-intro-target="line"]')
      const lineTarget = lineNode?.getBoundingClientRect()
      if (!name || !line || !nameTarget || !lineTarget || !lineNode) return false
      // Le séparateur de l'accueil est encore replié (scaleX 0) : sa largeur vient de offsetWidth.
      if (!onScreen(nameTarget) || lineNode.offsetWidth === 0 || lineTarget.top < 0 || lineTarget.top > window.innerHeight) return false
      // Les calques de la scène ont un léger zoom de caméra (figé pendant le vol) : on le compense.
      const layerScale = name.width / Math.max(1, nameRef.current?.offsetWidth ?? name.width)
      const from = center(name)
      const to = center(nameTarget)
      const lineWidth = lineNode.offsetWidth
      const lineFrom = center(line)
      const lineTo = { x: lineTarget.left + lineWidth / 2, y: lineTarget.top + lineTarget.height / 2 }
      flight.current = {
        nameX: (to.x - from.x) / layerScale,
        nameY: (to.y - from.y) / layerScale,
        nameScale: nameTarget.height / name.height,
        lineX: (lineTo.x - lineFrom.x) / layerScale,
        lineY: (lineTo.y - lineFrom.y) / layerScale,
        lineScaleX: lineWidth / Math.max(1, line.width),
        lineScaleY: Math.max(1, lineNode.offsetHeight) / Math.max(1, line.height),
      }
      return true
    }

    let flightReady = false
    let sized = false

    const tick = (now: number) => {
      frame = 0
      if (!running) return
      if (!sized) {
        sized = true
        setSize(frameSize())
      }
      let time = (now - origin) / 1000
      const audioTime = voice.currentTime()
      if (audioTime !== null && syncing) {
        const drift = VOICE_AT + audioTime - time
        if (Math.abs(drift) > 0.25) {
          // Gros écart (voix partie en retard, mise en mémoire tampon) : la voix rejoint l'image,
          // pour ne jamais faire reculer la scène.
          voice.seek(time - VOICE_AT)
        } else if (Math.abs(drift) > 0.03) {
          origin -= drift * 1000 * 0.3
          time = (now - origin) / 1000
        }
      }
      if (!voiceStarted && time >= VOICE_AT) {
        voiceStarted = true
        void voice.start().then((ok) => {
          if (ok && running) syncing = true
        })
      }
      if (!flying && time >= schedule.prepare) {
        flying = true
        setIntroHandoff('flying')
      }
      if (!measured && time >= schedule.flyStart - 0.05) flightReady = measure()
      if (!landed && time >= schedule.flyEnd) {
        landed = true
        setLingering(true)
        setIntroHandoff(flightReady ? 'landed' : 'none')
        setIntroPhase('done')
        setInteractive(false)
        rememberSeen()
        unlock()
      }
      t.set(time)
      if (time >= schedule.end) {
        running = false
        setLingering(false)
        return
      }
      frame = window.requestAnimationFrame(tick)
    }

    const stop = () => {
      if (!running) return
      running = false
      window.cancelAnimationFrame(frame)
      if (!landed) {
        setIntroHandoff('none')
        setIntroPhase('done')
        rememberSeen()
      }
      unlock()
      setLingering(false)
    }
    stopRef.current = stop

    const offListen = voice.onListen(() => {
      if (!running) return
      const time = (performance.now() - origin) / 1000
      if (time < schedule.prepare) {
        origin = performance.now() - VOICE_AT * 1000
        voiceStarted = true
        syncing = true
      }
    })

    const onKey = (event: KeyboardEvent) => {
      if (SKIP_KEYS.has(event.key)) stop()
    }
    const onScrollIntent = () => stop()
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onScrollIntent, { passive: true })
    window.addEventListener('touchmove', onScrollIntent, { passive: true })
    frame = window.requestAnimationFrame(tick)

    return () => {
      running = false
      window.cancelAnimationFrame(frame)
      offListen()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onScrollIntent)
      window.removeEventListener('touchmove', onScrollIntent)
      unlock()
    }
  }, [schedule, t, voice])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="intro"
          className="intro-root theme-night fixed inset-0 z-50 overflow-hidden"
          style={{ pointerEvents: interactive ? 'auto' : 'none', cursor: interactive ? 'pointer' : 'default' }}
          onClick={skipFromBackdrop}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div aria-hidden="true" className="absolute inset-0 bg-bg" style={{ opacity: backdrop }} />

          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              opacity: dawn,
              background:
                'radial-gradient(ellipse 90% 80% at 50% 46%, #fffaf0 0%, #fbfaf7 55%, #f1f4fa 100%)',
            }}
          />

          <motion.div aria-hidden="true" className="absolute inset-0" style={{ opacity: grid }}>
            <div className="intro-grid absolute inset-0" />
          </motion.div>

          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <motion.div className="relative flex items-center justify-center" style={{ opacity: rule, scaleX: rule }}>
              <span className="intro-rule block" />
              <span className="intro-ticks absolute left-0 top-[3px]" />
              <span ref={dotRef} className="intro-dot absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px]" />
            </motion.div>
          </div>

          {size ? (
            <div aria-hidden="true" className="absolute inset-0">
              <Scene
                t={t}
                s={schedule}
                size={size}
                labels={{ frameName: dict.intro.frameName, roles: dict.intro.roles }}
                nameRef={nameRef}
                lineRef={lineRef}
                flight={flight}
              />
            </div>
          ) : null}

          <motion.button
            type="button"
            style={{ opacity: skipOpacity }}
            onClick={(event) => {
              event.stopPropagation()
              skip()
            }}
            className="absolute bottom-5 right-4 z-10 rounded-lg border border-line2 bg-bg/60 px-3 py-1.5 font-mono text-[11px] text-text2 transition-colors hover:border-gold hover:text-gold2 sm:right-6"
          >
            {dict.intro.skip} · Esc
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
