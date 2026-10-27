'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useHydrated } from '@/kit/hooks/useHydrated'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'
import { useScrollProgress } from '@/kit/hooks/useScrollProgress'

export interface HorizontalGalleryProps {
  readonly children: ReactNode
  readonly gap?: number
  readonly className?: string
  readonly 'aria-label'?: string
}

/**
 * Galerie à défilement horizontal commandé par le défilement vertical : un cadre `sticky` retient l'écran,
 * le rail glisse de gauche à droite (transform). Sans JavaScript ou en mouvement réduit : rail natif
 * défilable au doigt ou au clavier (overflow-x), aucune capture du défilement.
 */
export default function HorizontalGallery({ children, gap = 24, className, 'aria-label': ariaLabel }: HorizontalGalleryProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const hydrated = useHydrated()
  const reduced = useReducedMotion()
  const live = hydrated && !reduced
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track || !live) return undefined
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    const frame = window.requestAnimationFrame(measure)
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null
    ro?.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      window.cancelAnimationFrame(frame)
      ro?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [live])

  const onProgress = useCallback(
    (progress: number) => {
      const track = trackRef.current
      if (track) track.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px, 0, 0)`
    },
    [distance],
  )
  useScrollProgress(outerRef, onProgress, { enabled: live && distance > 0, mode: 'pinned' })

  if (!live) {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className={className}
        style={{ display: 'flex', gap, overflowX: 'auto', scrollSnapType: 'x proximity', paddingBottom: 8 }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={outerRef}
      role="region"
      aria-label={ariaLabel}
      className={className}
      style={{ position: 'relative', height: distance > 0 ? `calc(100svh + ${distance}px)` : undefined }}
    >
      <div style={{ position: distance > 0 ? 'sticky' : 'relative', top: 0, height: distance > 0 ? '100svh' : undefined, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div ref={trackRef} style={{ display: 'flex', gap, paddingInline: gap, width: 'max-content', willChange: 'transform' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
