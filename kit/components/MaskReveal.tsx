'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'
import { batchLayout, EASE, inViewport, onFirstView } from '@/kit/lib/dom'

export interface MaskRevealProps {
  readonly children: ReactNode
  /** `slide` : le contenu monte de derrière le masque (transform). `wipe` : un rideau le découvre de gauche à droite (clip-path). */
  readonly mode?: 'slide' | 'wipe'
  readonly delay?: number
  readonly duration?: number
  readonly className?: string
}

/**
 * Révélation par masque, pensée pour les titres : une ligne ou un bloc sort de derrière un bord invisible.
 * Sans JavaScript, en mouvement réduit ou déjà à l'écran au chargement : le contenu est en place, sans animation.
 */
export default function MaskReveal({ children, mode = 'slide', delay = 0, duration = 0.9, className }: MaskRevealProps) {
  const outerRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner || reduced) return undefined
    let cancelled = false
    let dispose: (() => void) | undefined
    let timer = 0
    batchLayout(() => {
      if (cancelled || inViewport(outer, 40)) return undefined
      return () => {
        const hidden = mode === 'slide' ? { transform: 'translate3d(0, 108%, 0)' } : { clipPath: 'inset(0 100% 0 0)' }
        inner.style.transition = 'none'
        Object.assign(inner.style, hidden)
        dispose = onFirstView(outer, () => {
          const prop = mode === 'slide' ? 'transform' : 'clip-path'
          inner.style.transition = `${prop} ${duration}s ${EASE} ${delay}s`
          inner.style.transform = ''
          inner.style.clipPath = ''
          timer = window.setTimeout(() => {
            inner.style.transition = ''
          }, (duration + delay + 0.1) * 1000)
        })
      }
    })
    return () => {
      cancelled = true
      dispose?.()
      window.clearTimeout(timer)
      inner.style.transition = ''
      inner.style.transform = ''
      inner.style.clipPath = ''
    }
  }, [reduced, mode, delay, duration])

  return (
    <span
      ref={outerRef}
      className={className}
      style={{ display: 'block', overflow: mode === 'slide' ? 'hidden' : undefined, paddingBottom: '0.14em', marginBottom: '-0.14em' }}
    >
      <span ref={innerRef} style={{ display: 'block' }}>
        {children}
      </span>
    </span>
  )
}
