'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'

export interface LiveGridProps {
  /** Pas de la grille en px (la dérive revient sur elle-même tous les `cell` px : aucune couture visible). */
  readonly cell?: number
  /** Couleur des traits (rgb sans alpha, ex. « 31, 79, 216 »). */
  readonly rgb?: string
  readonly opacity?: number
  /** Part du défilement reprise par la grille : 0,15 = elle dérive à 15 % de la vitesse de la page. */
  readonly drift?: number
  /** `fixed` : couvre l'écran derrière la page. `absolute` : remplit son parent positionné. */
  readonly position?: 'fixed' | 'absolute'
  readonly fadeBottom?: boolean
}

/**
 * Arrière-plan vivant sans canvas : une grille de traits (dégradés CSS, rasterisée une seule fois) qui
 * dérive doucement avec le défilement. Un seul élément composité, un seul écouteur de défilement regroupé sur
 * une image d'animation, rien en mouvement réduit (la grille reste fixe).
 */
export default function LiveGrid({
  cell = 64,
  rgb = '31, 79, 216',
  opacity = 1,
  drift = 0.15,
  position = 'fixed',
  fadeBottom = false,
}: LiveGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const layer = ref.current
    if (!layer || reduced) return undefined
    let raf = 0
    const paint = () => {
      raf = 0
      const y = (window.scrollY * drift) % cell
      const x = Math.sin(window.scrollY / 900) * 10
      layer.style.transform = `translate3d(${x.toFixed(1)}px, ${(-y).toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      if (raf === 0) raf = window.requestAnimationFrame(paint)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    paint()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf !== 0) window.cancelAnimationFrame(raf)
    }
  }, [reduced, drift, cell])

  const line = (a: number) => `rgba(${rgb}, ${a})`
  const mask = fadeBottom ? 'linear-gradient(to bottom, #000 55%, transparent)' : undefined
  return (
    <div
      aria-hidden="true"
      style={{
        position,
        inset: 0,
        zIndex: position === 'fixed' ? -1 : 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <div
        ref={ref}
        style={{
          position: 'absolute',
          inset: `-${cell}px`,
          willChange: reduced ? undefined : 'transform',
          backgroundImage: `linear-gradient(to right, ${line(0.06)} 1px, transparent 1px), linear-gradient(to bottom, ${line(0.06)} 1px, transparent 1px), linear-gradient(to right, ${line(0.03)} 1px, transparent 1px), linear-gradient(to bottom, ${line(0.03)} 1px, transparent 1px)`,
          backgroundSize: `${cell}px ${cell}px, ${cell}px ${cell}px, ${cell / 4}px ${cell / 4}px, ${cell / 4}px ${cell / 4}px`,
        }}
      />
    </div>
  )
}
