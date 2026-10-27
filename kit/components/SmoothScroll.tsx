'use client'

import { useEffect, type ReactNode } from 'react'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'

export interface SmoothScrollProps {
  readonly children?: ReactNode
  /** Douceur : plus petit = plus de traînée (0,1 par défaut). */
  readonly lerp?: number
  /** Désactivé sur écran tactile : le défilement natif y est déjà fluide et Lenis n'y apporte rien. */
  readonly skipOnTouch?: boolean
  /** Renvoie faux pour suspendre le défilement fluide (ex. pendant une intro qui verrouille la page). */
  readonly shouldScroll?: () => boolean
}

const LENIS_CSS = `html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}.lenis.lenis-stopped{overflow:clip}`

interface IdleWindow {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

/**
 * Défilement fluide (Lenis). Le module n'est chargé qu'au repos du navigateur, hors du chemin critique ;
 * rien n'est créé en mouvement réduit ni sur écran tactile.
 */
export default function SmoothScroll({ children, lerp = 0.1, skipOnTouch = true, shouldScroll }: SmoothScrollProps) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined
    if (skipOnTouch && window.matchMedia('(hover: none), (pointer: coarse)').matches) return undefined
    let cancelled = false
    let destroy: (() => void) | undefined
    const idle: IdleWindow = window
    let handle = 0
    let timer = 0

    const start = () => {
      void import('lenis').then(({ default: Lenis }) => {
        if (cancelled) return
        const lenis = new Lenis({
          lerp,
          anchors: true,
          autoRaf: true,
          virtualScroll: shouldScroll ? () => shouldScroll() : undefined,
        })
        destroy = () => lenis.destroy()
      })
    }

    // Chargé au premier geste du visiteur (molette, clavier, pointeur), ou au repos après 5 s : jamais pendant le chargement.
    const events = ['wheel', 'keydown', 'pointermove'] as const
    const release = () => {
      events.forEach((name) => window.removeEventListener(name, release))
      window.clearTimeout(timer)
      if (idle.requestIdleCallback) handle = idle.requestIdleCallback(start, { timeout: 1500 })
      else timer = window.setTimeout(start, 200)
    }
    events.forEach((name) => window.addEventListener(name, release, { passive: true, once: true }))
    timer = window.setTimeout(release, 5000)

    return () => {
      cancelled = true
      if (handle !== 0) idle.cancelIdleCallback?.(handle)
      window.clearTimeout(timer)
      events.forEach((name) => window.removeEventListener(name, release))
      destroy?.()
    }
  }, [reduced, lerp, skipOnTouch, shouldScroll])

  return (
    <>
      <style href="mk-lenis" precedence="default">
        {LENIS_CSS}
      </style>
      {children}
    </>
  )
}
