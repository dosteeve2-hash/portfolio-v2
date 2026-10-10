'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface RevealProps {
  readonly children: ReactNode
  readonly delay?: number
  readonly className?: string
  /** 'drop' : la carte se pose (légère descente avec un petit rebond). */
  readonly variant?: 'rise' | 'drop'
}

// Un seul observateur pour toute la page ; l'animation est une transition CSS
// d'opacité et de transformation, jouée par le compositeur et non image par image en JavaScript.
let sharedObserver: IntersectionObserver | null = null

function revealObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver
  sharedObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-shown', '')
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -60px 0px' },
  )
  return sharedObserver
}

export default function Reveal({ children, delay = 0, className, variant = 'rise' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = revealObserver()
    observer.observe(node)
    return () => observer.unobserve(node)
  }, [])

  const style: CSSProperties | undefined = delay > 0 ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined

  return (
    <div ref={ref} data-reveal={variant === 'drop' ? 'drop' : ''} className={className} style={style}>
      {children}
    </div>
  )
}
