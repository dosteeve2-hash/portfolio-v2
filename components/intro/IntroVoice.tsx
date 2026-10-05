'use client'

import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

const VOLUME = 0.85

/**
 * idle      : rien n'a été demandé
 * playing   : la voix joue (elle continue pendant le défilement et après l'intro)
 * blocked   : le navigateur a refusé la lecture automatique → pastille « Écouter »
 * ended     : la voix est terminée
 * dismissed : la pastille a été laissée de côté (le visiteur est descendu dans la page)
 */
export type VoiceState = 'idle' | 'playing' | 'blocked' | 'ended' | 'dismissed'

interface IntroVoiceApi {
  readonly available: boolean
  /** Précharge la piste ; à appeler dès que l'intro démarre. */
  readonly prepare: () => void
  /** Tente la lecture automatique ; en cas de refus, la pastille apparaît. Résout `true` si la voix joue. */
  readonly start: () => Promise<boolean>
  /** Propose la voix sans tenter la lecture automatique (mouvement réduit). */
  readonly offer: () => void
  /** Temps de lecture de la voix en secondes, ou null si elle ne joue pas. */
  readonly currentTime: () => number | null
  /** Recale la voix (si elle a démarré en retard, c'est elle qui rejoint l'image). */
  readonly seek: (seconds: number) => void
  /** Abonnement au clic sur « Écouter » (l'intro se recale alors sur la voix). */
  readonly onListen: (callback: () => void) => () => void
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
  readonly labels: { readonly listen: string; readonly mute: string; readonly unmute: string }
  readonly children: ReactNode
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
 */
export default function IntroVoiceProvider({ src, labels, children }: IntroVoiceProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const listeners = useRef(new Set<() => void>())
  const [state, setState] = useState<VoiceState>('idle')
  const [muted, setMuted] = useState(false)
  const available = src !== null

  const prepare = useCallback(() => {
    const audio = audioRef.current
    if (!audio || audio.preload === 'auto') return
    audio.preload = 'auto'
    audio.load()
  }, [])

  const play = useCallback(async (fromStart: boolean): Promise<boolean> => {
    const audio = audioRef.current
    if (!audio) return false
    audio.volume = VOLUME
    if (fromStart) audio.currentTime = 0
    try {
      await audio.play()
      setState('playing')
      return true
    } catch {
      return false
    }
  }, [])

  const start = useCallback(async (): Promise<boolean> => {
    const ok = await play(true)
    if (!ok) setState((current) => (current === 'idle' ? 'blocked' : current))
    return ok
  }, [play])

  const offer = useCallback(() => {
    setState((current) => (current === 'idle' ? 'blocked' : current))
  }, [])

  const listen = useCallback(() => {
    void play(true).then((ok) => {
      if (ok) listeners.current.forEach((callback) => callback())
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

  useEffect(() => {
    if (state !== 'blocked') return undefined
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) setState('dismissed')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [state])

  const api = useMemo<IntroVoiceApi>(
    () => ({ available, prepare, start, offer, currentTime, seek, onListen }),
    [available, prepare, start, offer, currentTime, seek, onListen],
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
        {state === 'blocked' ? (
          <motion.button
            key="listen"
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              listen()
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="voice-pill fixed bottom-5 left-4 z-[60] inline-flex items-center gap-2 rounded-full border border-gold/45 bg-bg2/95 py-2 pl-3 pr-4 font-mono text-[11px] uppercase tracking-[0.16em] text-gold2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)] transition-colors hover:border-gold hover:text-text sm:left-6"
          >
            <SpeakerIcon muted={false} />
            {labels.listen}
          </motion.button>
        ) : null}
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
            className="fixed bottom-5 left-4 z-[60] grid h-10 w-10 place-items-center rounded-full border border-line2 bg-bg2/95 text-gold2 transition-colors hover:border-gold sm:left-6"
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
