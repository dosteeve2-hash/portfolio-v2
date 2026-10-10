'use client'

import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { VOICE_STORAGE_KEY } from '@/lib/introKey'

const VOLUME = 0.85

/** Délai pendant lequel le clic qui vient de déclencher la voix ne doit pas aussi passer l'intro. */
const ARM_CLICK_GUARD_MS = 700

/**
 * idle    : rien n'a encore été tenté
 * armed   : le navigateur a refusé la lecture automatique ; la voix partira au premier geste valable, n'importe où
 * playing : la voix joue (elle continue pendant le défilement et après l'intro)
 * ended   : la voix est terminée (ou déjà jouée dans cette session)
 */
export type VoiceState = 'idle' | 'armed' | 'playing' | 'ended'

interface IntroVoiceApi {
  readonly available: boolean
  /** Précharge la piste ; à appeler dès que l'intro démarre. */
  readonly prepare: () => void
  /** Tente la lecture automatique ; en cas de refus, la voix est armée. Résout `true` si elle joue. */
  readonly start: () => Promise<boolean>
  /** Arme la voix sans tenter la lecture (intro non jouée) : elle partira au premier geste. */
  readonly offer: () => void
  /** Temps de lecture de la voix en secondes, ou null si elle ne joue pas. */
  readonly currentTime: () => number | null
  /** Recale la voix (si elle a démarré en retard, c'est elle qui rejoint l'image). */
  readonly seek: (seconds: number) => void
  /** Abonnement au démarrage de la voix par un geste (l'intro se recale alors sur la voix). */
  readonly onListen: (callback: () => void) => () => void
  /** Vrai juste après qu'un geste a déclenché la voix : le clic correspondant ne doit pas passer l'intro. */
  readonly justStartedByGesture: () => boolean
}

const noop = () => undefined

const IntroVoiceContext = createContext<IntroVoiceApi>({
  available: false,
  prepare: noop,
  start: () => Promise.resolve(false),
  offer: noop,
  currentTime: () => null,
  seek: noop,
  onListen: () => noop,
  justStartedByGesture: () => false,
})

const VoiceStateContext = createContext<VoiceState>('idle')

/** Commandes stables de la voix (n'entraînent pas de nouveau rendu quand l'état change). */
export function useIntroVoice(): IntroVoiceApi {
  return useContext(IntroVoiceContext)
}

export function useVoiceState(): VoiceState {
  return useContext(VoiceStateContext)
}

interface IntroVoiceProps {
  readonly src: string | null
  readonly labels: { readonly mute: string; readonly unmute: string }
  readonly children: ReactNode
}

function alreadyPlayed(): boolean {
  try {
    return sessionStorage.getItem(VOICE_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function rememberPlayed(): void {
  try {
    sessionStorage.setItem(VOICE_STORAGE_KEY, '1')
  } catch {
    // stockage de session indisponible : la garde en mémoire suffit pour cette page
  }
}

function SpeakerIcon({ muted }: { readonly muted: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 6h2.2L8 3.2v9.6L4.7 10H2.5z" fill="currentColor" />
      {muted ? (
        <path d="M10.5 6l3.5 4M14 6l-3.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      ) : (
        <path
          d="M10.4 5.6a3.4 3.4 0 010 4.8M12.3 3.8a6 6 0 010 8.4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

/**
 * Fournisseur de la voix off, monté au niveau du layout : l'élément audio survit à la fin
 * de l'intro, au défilement et au bouton « Passer ». Il ne coupe jamais une voix en cours.
 * La voix est active par défaut : les navigateurs interdisent le son sans geste, donc si la
 * lecture est refusée elle est armée sur le premier geste valable (aucune pastille).
 */
export default function IntroVoiceProvider({ src, labels, children }: IntroVoiceProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const listeners = useRef(new Set<() => void>())
  const playedRef = useRef(false)
  const startingRef = useRef(false)
  const gestureAtRef = useRef(0)
  const [state, setState] = useState<VoiceState>('idle')
  const [muted, setMuted] = useState(false)
  const available = src !== null

  const prepare = useCallback(() => {
    const audio = audioRef.current
    if (!audio || audio.preload === 'auto') return
    audio.preload = 'auto'
    audio.load()
  }, [])

  const play = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current
    if (!audio || startingRef.current) return false
    if (playedRef.current || alreadyPlayed()) {
      playedRef.current = true
      setState('ended')
      return false
    }
    startingRef.current = true
    audio.volume = VOLUME
    audio.currentTime = 0
    try {
      await audio.play()
      playedRef.current = true
      rememberPlayed()
      setState('playing')
      return true
    } catch {
      return false
    } finally {
      startingRef.current = false
    }
  }, [])

  const start = useCallback(async (): Promise<boolean> => {
    const ok = await play()
    if (!ok) setState((current) => (current === 'idle' ? 'armed' : current))
    return ok
  }, [play])

  const offer = useCallback(() => {
    if (playedRef.current || alreadyPlayed()) return
    setState((current) => (current === 'idle' ? 'armed' : current))
  }, [])

  const onGesture = useCallback(() => {
    void play().then((ok) => {
      if (!ok) return
      gestureAtRef.current = performance.now()
      listeners.current.forEach((callback) => callback())
    })
  }, [play])

  const currentTime = useCallback((): number | null => {
    const audio = audioRef.current
    if (!audio || audio.paused || audio.ended) return null
    return audio.currentTime
  }, [])

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (audio && Number.isFinite(seconds) && seconds >= 0 && seconds < (audio.duration || Infinity)) audio.currentTime = seconds
  }, [])

  const onListen = useCallback((callback: () => void) => {
    listeners.current.add(callback)
    return () => {
      listeners.current.delete(callback)
    }
  }, [])

  const justStartedByGesture = useCallback(() => performance.now() - gestureAtRef.current < ARM_CLICK_GUARD_MS, [])

  // Voix armée : le premier geste valable, n'importe où sur la page, la déclenche. Un geste qui ne donne pas
  // d'activation au navigateur (molette, touche Échap) échoue sans effet et la voix reste armée.
  useEffect(() => {
    if (state !== 'armed') return undefined
    const events = ['pointerdown', 'pointerup', 'keydown', 'touchend', 'click'] as const
    events.forEach((name) => window.addEventListener(name, onGesture, { capture: true, passive: true }))
    return () => events.forEach((name) => window.removeEventListener(name, onGesture, { capture: true }))
  }, [state, onGesture])

  const api = useMemo<IntroVoiceApi>(
    () => ({ available, prepare, start, offer, currentTime, seek, onListen, justStartedByGesture }),
    [available, prepare, start, offer, currentTime, seek, onListen, justStartedByGesture],
  )

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  return (
    <IntroVoiceContext.Provider value={api}>
      <VoiceStateContext.Provider value={state}>{children}</VoiceStateContext.Provider>
      {src ? (
        <audio
          ref={audioRef}
          src={src}
          preload="none"
          onEnded={() => setState('ended')}
          onError={() => setState((current) => (current === 'playing' ? 'ended' : current))}
          className="hidden"
        />
      ) : null}
      <AnimatePresence>
        {state === 'playing' ? (
          <motion.button
            key="mute"
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              toggleMute()
            }}
            aria-label={muted ? labels.unmute : labels.mute}
            aria-pressed={muted}
            title={muted ? labels.unmute : labels.mute}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 left-4 z-[60] grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-navy/90 text-gold2 shadow-lift transition-colors hover:border-spark sm:left-6"
          >
            <SpeakerIcon muted={muted} />
            {muted ? null : (
              <span aria-hidden="true" className="voice-bars absolute -right-1 -top-1 flex h-3 items-end gap-[2px]">
                <span />
                <span />
                <span />
              </span>
            )}
          </motion.button>
        ) : null}
      </AnimatePresence>
    </IntroVoiceContext.Provider>
  )
}
