import { useEffect, type RefObject } from 'react'
import { pinnedProgress, sectionProgress } from '@/kit/lib/math'

export type ProgressMode = 'section' | 'pinned'

/**
 * Appelle `onProgress` (0..1) quand l'élément bouge à l'écran. Les écouteurs de défilement ne sont
 * posés que pendant que l'élément (ou sa zone de marge) est visible : rien ne tourne hors écran.
 * Les appels sont regroupés sur une image d'animation.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
  options: { readonly enabled?: boolean; readonly mode?: ProgressMode } = {},
): void {
  const { enabled = true, mode = 'section' } = options

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return undefined
    let raf = 0
    let attached = false

    const measure = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const viewport = window.innerHeight
      onProgress(
        mode === 'pinned'
          ? pinnedProgress(rect.top, rect.height, viewport)
          : sectionProgress(rect.top, rect.height, viewport),
      )
    }
    const schedule = () => {
      if (raf === 0) raf = window.requestAnimationFrame(measure)
    }
    const attach = () => {
      if (attached) return
      attached = true
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
    }
    const detach = () => {
      if (!attached) return
      attached = false
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          attach()
          schedule()
        } else {
          detach()
        }
      },
      { rootMargin: '25% 0px 25% 0px' },
    )
    observer.observe(el)
    schedule()

    return () => {
      observer.disconnect()
      detach()
      if (raf !== 0) window.cancelAnimationFrame(raf)
    }
  }, [ref, onProgress, enabled, mode])
}
