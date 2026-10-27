'use client'

import { useRef, type PointerEvent, type ReactNode } from 'react'
import { useMedia, FINE_POINTER } from '@/kit/hooks/useMedia'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'
import { clamp } from '@/kit/lib/math'

export interface TiltCardProps {
  readonly children: ReactNode
  /** Inclinaison maximale en degrés. */
  readonly max?: number
  readonly perspective?: number
  /** Reflet qui suit le pointeur (couleur du reflet : `glareColor`). */
  readonly glare?: boolean
  readonly glareColor?: string
  readonly className?: string
}

/**
 * Carte inclinable en 3D : elle pivote vers le pointeur et se remet à plat en sortant.
 * Un seul transform composé, regroupé sur une image d'animation. Souris seulement ; jamais en mouvement réduit.
 */
export default function TiltCard({
  children,
  max = 7,
  perspective = 900,
  glare = true,
  glareColor = 'rgba(255,255,255,0.18)',
  className,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLSpanElement>(null)
  const raf = useRef(0)
  const fine = useMedia(FINE_POINTER)
  const reduced = useReducedMotion()
  const active = fine && !reduced

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const box = event.currentTarget.getBoundingClientRect()
    const px = clamp((event.clientX - box.left) / box.width)
    const py = clamp((event.clientY - box.top) / box.height)
    window.cancelAnimationFrame(raf.current)
    raf.current = window.requestAnimationFrame(() => {
      card.style.transition = 'transform 0.1s linear'
      card.style.transform = `perspective(${perspective}px) rotateX(${((0.5 - py) * 2 * max).toFixed(2)}deg) rotateY(${((px - 0.5) * 2 * max).toFixed(2)}deg)`
      const g = glareRef.current
      if (g) {
        g.style.opacity = '1'
        g.style.background = `radial-gradient(circle at ${(px * 100).toFixed(0)}% ${(py * 100).toFixed(0)}%, ${glareColor}, transparent 55%)`
      }
    })
  }
  const onLeave = () => {
    window.cancelAnimationFrame(raf.current)
    const card = cardRef.current
    if (card) {
      card.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
      card.style.transform = ''
    }
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onPointerMove={active ? onMove : undefined}
      onPointerLeave={active ? onLeave : undefined}
      style={{ position: 'relative', willChange: active ? 'transform' : undefined, transformStyle: 'preserve-3d' }}
    >
      {children}
      {active && glare ? (
        <span
          ref={glareRef}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s ease' }}
        />
      ) : null}
    </div>
  )
}
