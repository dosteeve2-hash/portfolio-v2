'use client'

import { useEffect, useRef } from 'react'

interface CountUpProps {
  readonly value: number
  readonly className?: string
}

const DURATION_MS = 1300

/**
 * Compteur animé : le rendu serveur contient déjà la valeur finale (lisible sans JavaScript) ;
 * une fois monté, le chiffre repart de zéro et monte quand il entre à l'écran.
 */
export default function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    node.textContent = '0'
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const start = performance.now()
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / DURATION_MS)
          const eased = 1 - (1 - progress) ** 3
          node.textContent = String(Math.round(value * eased))
          if (progress < 1) frame = window.requestAnimationFrame(step)
        }
        frame = window.requestAnimationFrame(step)
      },
      { threshold: 0.6 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
      node.textContent = String(value)
    }
  }, [value])

  return (
    <>
      <span ref={ref} aria-hidden="true" className={className}>
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  )
}
