'use client'

import { Children, useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'

export interface MarqueeProps {
  readonly children: ReactNode
  /** Vitesse en px par seconde. */
  readonly speed?: number
  readonly direction?: 'left' | 'right'
  readonly gap?: number
  readonly pauseOnHover?: boolean
  readonly className?: string
}

const FADE = 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)'

/**
 * Bandeau défilant en boucle (API Web Animations, translation seulement). La boucle se met en pause hors
 * écran, au survol et quand l'onglet est caché ; en mouvement réduit les éléments restent à plat, sur plusieurs lignes.
 * Le contenu doit être plus large que le conteneur (sinon la boucle se voit).
 */
export default function Marquee({
  children,
  speed = 40,
  direction = 'left',
  gap = 32,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const first = firstRef.current
    if (!root || !track || !first || reduced || typeof track.animate !== 'function') return undefined

    let animation: Animation | null = null
    let visible = false
    let hovered = false

    const sync = () => {
      if (!animation) return
      if (visible && !hovered) animation.play()
      else animation.pause()
    }
    const build = () => {
      const width = first.offsetWidth
      if (width <= 0) return
      const total = (width / speed) * 1000
      const progress = animation ? Number(animation.effect?.getComputedTiming().progress ?? 0) : 0
      animation?.cancel()
      const frames = direction === 'left' ? [0, -width] : [-width, 0]
      animation = track.animate(
        [{ transform: `translate3d(${frames[0]}px,0,0)` }, { transform: `translate3d(${frames[1]}px,0,0)` }],
        { duration: total, iterations: Infinity, easing: 'linear' },
      )
      animation.currentTime = progress * total
      sync()
    }

    const io = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting)
      sync()
    })
    io.observe(root)
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(build) : null
    ro?.observe(first)
    const enter = () => {
      hovered = true
      sync()
    }
    const leave = () => {
      hovered = false
      sync()
    }
    if (pauseOnHover) {
      root.addEventListener('pointerenter', enter)
      root.addEventListener('pointerleave', leave)
    }
    build()

    return () => {
      io.disconnect()
      ro?.disconnect()
      root.removeEventListener('pointerenter', enter)
      root.removeEventListener('pointerleave', leave)
      animation?.cancel()
    }
  }, [reduced, speed, direction, pauseOnHover, gap])

  const items = Children.toArray(children)
  const row = { display: 'flex', alignItems: 'center', gap, flexShrink: 0 } as const

  if (reduced) {
    return (
      <div className={className} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap }}>
        {items}
      </div>
    )
  }

  return (
    <div ref={rootRef} className={className} style={{ overflow: 'hidden', maskImage: FADE, WebkitMaskImage: FADE }}>
      <div ref={trackRef} style={{ display: 'flex', width: 'max-content', willChange: 'transform' }}>
        <div ref={firstRef} style={{ ...row, paddingRight: gap }}>
          {items}
        </div>
        <div aria-hidden="true" style={{ ...row, paddingRight: gap }}>
          {items}
        </div>
      </div>
    </div>
  )
}
