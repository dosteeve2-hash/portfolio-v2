'use client'

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'
import { batchLayout, EASE, inViewport, onFirstView } from '@/kit/lib/dom'

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none'

export interface RevealProps {
  readonly children: ReactNode
  readonly as?: ElementType
  readonly direction?: RevealDirection
  /** Distance de départ en px. */
  readonly distance?: number
  /** Rang dans une liste : le délai vaut `index * stagger`. */
  readonly index?: number
  readonly stagger?: number
  readonly delay?: number
  readonly duration?: number
  readonly className?: string
  readonly style?: CSSProperties
}

function offset(direction: RevealDirection, distance: number): readonly [number, number] {
  switch (direction) {
    case 'up':
      return [0, distance]
    case 'down':
      return [0, -distance]
    case 'left':
      return [distance, 0]
    case 'right':
      return [-distance, 0]
    default:
      return [0, 0]
  }
}

/**
 * Apparition au défilement. Sans JavaScript ou en mouvement réduit : contenu visible tout de suite.
 * Les styles sont posés à la main (aucun re-rendu React) ; transform et opacity seulement.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  direction = 'up',
  distance = 24,
  index = 0,
  stagger = 0.08,
  delay = 0,
  duration = 0.7,
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return undefined
    let cancelled = false
    let dispose: (() => void) | undefined
    let timer = 0
    let cleanTimer = 0
    // Déjà à l'écran au chargement : on ne le cache pas (pas de clignotement ni de LCP retardé).
    batchLayout(() => {
      if (cancelled || inViewport(el, 40)) return undefined
      return () => {
        const [x, y] = offset(direction, distance)
        el.style.transition = 'none'
        el.style.opacity = '0'
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
        el.style.willChange = 'opacity, transform'
        const total = delay + index * stagger
        dispose = onFirstView(el, () => {
          timer = window.setTimeout(() => {
            el.style.transition = `opacity ${duration}s ${EASE}, transform ${duration}s ${EASE}`
            el.style.opacity = ''
            el.style.transform = ''
            cleanTimer = window.setTimeout(() => {
              el.style.willChange = ''
              el.style.transition = ''
            }, (duration + 0.1) * 1000)
          }, total * 1000)
        })
      }
    })

    return () => {
      cancelled = true
      dispose?.()
      window.clearTimeout(timer)
      window.clearTimeout(cleanTimer)
      el.style.transition = ''
      el.style.opacity = ''
      el.style.transform = ''
      el.style.willChange = ''
    }
  }, [reduced, direction, distance, index, stagger, delay, duration])

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}
