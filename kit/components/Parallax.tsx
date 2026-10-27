'use client'

import { useCallback, useRef, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'
import { useScrollProgress } from '@/kit/hooks/useScrollProgress'

export interface ParallaxProps {
  readonly children: ReactNode
  /** Amplitude relative à la hauteur de l'écran : 0,2 = la couche se décale de ±10 % de l'écran. Négatif : sens inverse. */
  readonly speed?: number
  readonly axis?: 'y' | 'x'
  readonly className?: string
  readonly style?: CSSProperties
}

/**
 * Parallaxe : un décalage proportionnel à la position dans l'écran, appliqué en transform.
 * Empilez plusieurs couches de vitesses différentes (0,1 / 0,25 / 0,5) pour la profondeur.
 * Aucun écouteur n'est posé tant que la couche est hors écran.
 */
export default function Parallax({ children, speed = 0.2, axis = 'y', className, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const apply = useCallback(
    (progress: number) => {
      const el = ref.current
      if (!el) return
      const shift = (progress - 0.5) * speed * window.innerHeight
      el.style.transform = axis === 'y' ? `translate3d(0, ${shift.toFixed(1)}px, 0)` : `translate3d(${shift.toFixed(1)}px, 0, 0)`
    },
    [speed, axis],
  )
  useScrollProgress(ref, apply, { enabled: !reduced })

  return (
    <div ref={ref} className={className} style={{ willChange: reduced ? undefined : 'transform', ...style }}>
      {children}
    </div>
  )
}
