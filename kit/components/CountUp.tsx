'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'
import { onFirstView, srOnlyStyle } from '@/kit/lib/dom'
import { easeOutCubic, formatCount } from '@/kit/lib/math'

export interface CountUpProps {
  /** Chiffre VRAI uniquement : ne jamais animer un nombre qu'on ne peut pas prouver. */
  readonly value: number
  readonly from?: number
  readonly duration?: number
  readonly decimals?: number
  readonly locale?: string
  readonly prefix?: string
  readonly suffix?: string
  /** Faux : le compteur reste à `from` (utile tant qu'une intro cache la page). */
  readonly start?: boolean
  readonly className?: string
}

/**
 * Le rendu serveur contient déjà la valeur finale (lisible sans JavaScript, lue telle quelle par les lecteurs d'écran) ;
 * une fois monté, le chiffre repart de `from` et monte quand il entre à l'écran.
 */
export default function CountUp({
  value,
  from = 0,
  duration = 1400,
  decimals = 0,
  locale,
  prefix = '',
  suffix = '',
  start = true,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const text = `${prefix}${formatCount(value, locale, decimals)}${suffix}`

  useEffect(() => {
    const node = ref.current
    if (!node || reduced) return undefined
    const render = (n: number) => {
      node.textContent = `${prefix}${formatCount(n, locale, decimals)}${suffix}`
    }
    let frame = 0
    render(from)
    if (!start) {
      return () => render(value)
    }
    const dispose = onFirstView(
      node,
      () => {
        const t0 = performance.now()
        const step = (now: number) => {
          const progress = Math.min(1, (now - t0) / duration)
          render(from + (value - from) * easeOutCubic(progress))
          if (progress < 1) frame = window.requestAnimationFrame(step)
        }
        frame = window.requestAnimationFrame(step)
      },
      '0px 0px -10% 0px',
      0.4,
    )
    return () => {
      dispose()
      window.cancelAnimationFrame(frame)
      render(value)
    }
  }, [reduced, start, value, from, duration, decimals, locale, prefix, suffix])

  return (
    <>
      <span ref={ref} aria-hidden="true" className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {text}
      </span>
      <span style={srOnlyStyle}>{text}</span>
    </>
  )
}
