'use client'

import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'
import { useScrollProgress } from '@/kit/hooks/useScrollProgress'
import { batchLayout, EASE, inViewport, onFirstView } from '@/kit/lib/dom'
import { clamp } from '@/kit/lib/math'

export interface DrawPathProps {
  /** Données du tracé (attribut `d`). */
  readonly d: string
  readonly viewBox: string
  readonly stroke?: string
  readonly strokeWidth?: number
  /**
   * `view` : se trace d'un coup à l'arrivée à l'écran. `scroll` : tracé proportionnel au défilement de l'élément.
   * Ignoré quand `progress` est fourni (pilotage externe, par exemple depuis PinnedStory).
   */
  readonly mode?: 'view' | 'scroll'
  readonly progress?: number
  readonly duration?: number
  readonly title?: string
  /** Éléments SVG dessinés par-dessus le tracé (nœuds, étiquettes) ; ils reçoivent le même repère `viewBox`. */
  readonly children?: ReactNode
  readonly className?: string
  readonly style?: CSSProperties
}

/**
 * Tracé SVG animé (stroke-dashoffset avec pathLength normalisé à 1, donc indépendant de la longueur réelle).
 * Sans JavaScript ou en mouvement réduit : le tracé est complet.
 */
export default function DrawPath({
  d,
  viewBox,
  stroke = 'currentColor',
  strokeWidth = 2,
  mode = 'view',
  progress,
  duration = 1.6,
  title,
  children,
  className,
  style,
}: DrawPathProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const reduced = useReducedMotion()
  const controlled = progress !== undefined

  const onScroll = useCallback((value: number) => {
    pathRef.current?.style.setProperty('stroke-dashoffset', String(1 - clamp(value * 1.6)))
  }, [])
  useScrollProgress(svgRef as RefObject<HTMLElement | null>, onScroll, {
    enabled: !reduced && !controlled && mode === 'scroll',
  })

  useEffect(() => {
    const path = pathRef.current
    if (!path || reduced || controlled || mode !== 'view' || !svgRef.current) return undefined
    const svg = svgRef.current
    let cancelled = false
    let dispose: (() => void) | undefined
    let frame = 0
    batchLayout(() => {
      if (cancelled || inViewport(svg, 40)) return undefined
      return () => {
        path.style.transition = 'none'
        path.style.strokeDashoffset = '1'
        dispose = onFirstView(svg, () => {
          frame = window.requestAnimationFrame(() => {
            path.style.transition = `stroke-dashoffset ${duration}s ${EASE}`
            path.style.strokeDashoffset = '0'
          })
        })
      }
    })
    return () => {
      cancelled = true
      dispose?.()
      window.cancelAnimationFrame(frame)
      path.style.transition = ''
      path.style.strokeDashoffset = ''
    }
  }, [reduced, controlled, mode, duration])

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
      style={style}
      fill="none"
    >
      <path
        ref={pathRef}
        d={d}
        pathLength={1}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={controlled && !reduced ? 1 - clamp(progress) : 0}
      />
      {children}
    </svg>
  )
}
