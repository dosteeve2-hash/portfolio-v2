'use client'

import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useHydrated } from '@/kit/hooks/useHydrated'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'
import { useScrollProgress } from '@/kit/hooks/useScrollProgress'
import { clamp } from '@/kit/lib/math'

export interface StoryState {
  /** 0 à l'accroche, 1 au décrochage. */
  readonly progress: number
  /** Index de l'étape active (0 à steps - 1). */
  readonly step: number
  /** Vrai quand la scène est réellement épinglée ; faux sans JavaScript ou en mouvement réduit (tout est alors affiché à plat, état final). */
  readonly live: boolean
}

export interface PinnedStoryProps {
  /** Nombre d'étapes ; la scène dure `steps * screensPerStep` écrans. */
  readonly steps: number
  readonly screensPerStep?: number
  readonly children: (state: StoryState) => ReactNode
  readonly className?: string
  readonly style?: CSSProperties
}

/**
 * Scène épinglée qui se déroule au défilement (scrollytelling) : un cadre `sticky` de la hauteur de l'écran
 * reste en place pendant que la progression de 0 à 1 pilote le contenu. Le contenu est fourni par une fonction
 * qui reçoit `{ progress, step, live }`. Sans JavaScript ou en mouvement réduit : pas d'épinglage, état final à plat.
 */
export default function PinnedStory({ steps, screensPerStep = 0.8, children, className, style }: PinnedStoryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hydrated = useHydrated()
  const reduced = useReducedMotion()
  const live = hydrated && !reduced
  const [progress, setProgress] = useState(0)

  const onProgress = useCallback((value: number) => {
    setProgress((previous) => (Math.abs(previous - value) < 0.002 ? previous : value))
  }, [])
  useScrollProgress(ref, onProgress, { enabled: live, mode: 'pinned' })

  const shown = live ? progress : 1
  const step = clamp(Math.floor(shown * steps), 0, steps - 1)
  const height = live ? `${Math.max(1, steps * screensPerStep + 1) * 100}svh` : undefined

  return (
    <div ref={ref} className={className} style={{ position: 'relative', height, ...style }}>
      <div
        style={{
          position: live ? 'sticky' : 'relative',
          top: 0,
          height: live ? '100svh' : undefined,
          overflow: live ? 'hidden' : undefined,
        }}
      >
        {children({ progress: shown, step, live })}
      </div>
    </div>
  )
}
