'use client'

import { useRef, type PointerEvent, type ReactNode } from 'react'
import { useMedia, FINE_POINTER } from '@/kit/hooks/useMedia'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'
import { clamp } from '@/kit/lib/math'

export interface MagneticButtonProps {
  /** Le vrai bouton ou lien (c'est lui qui garde le focus, le rôle et le nom accessibles). */
  readonly children: ReactNode
  /** Part du déplacement du pointeur reprise par l'élément (0,3 = il suit à 30 %). */
  readonly strength?: number
  /** Marge d'attraction autour de l'élément, en px. */
  readonly radius?: number
  readonly className?: string
}

/**
 * Bouton magnétique : l'élément se laisse attirer par le pointeur quand il en approche, puis revient en ressort.
 * Uniquement avec une souris (pointeur fin), jamais en mouvement réduit ; le décalage reste borné pour ne pas gêner le clic.
 */
export default function MagneticButton({ children, strength = 0.3, radius = 28, className }: MagneticButtonProps) {
  const innerRef = useRef<HTMLSpanElement>(null)
  const fine = useMedia(FINE_POINTER)
  const reduced = useReducedMotion()
  const active = fine && !reduced

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    const inner = innerRef.current
    if (!inner) return
    const box = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (box.left + box.width / 2)
    const dy = event.clientY - (box.top + box.height / 2)
    const max = radius + 8
    inner.style.transition = 'transform 0.12s linear'
    inner.style.transform = `translate3d(${clamp(dx * strength, -max, max).toFixed(1)}px, ${clamp(dy * strength, -max, max).toFixed(1)}px, 0)`
  }
  const onLeave = () => {
    const inner = innerRef.current
    if (!inner) return
    inner.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)'
    inner.style.transform = ''
  }

  return (
    <span
      className={className}
      onPointerMove={active ? onMove : undefined}
      onPointerLeave={active ? onLeave : undefined}
      style={{ display: 'inline-block', padding: active ? radius : 0, margin: active ? -radius : 0 }}
    >
      <span ref={innerRef} style={{ display: 'inline-block', willChange: active ? 'transform' : undefined }}>
        {children}
      </span>
    </span>
  )
}
