'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface ReelPlayerProps {
  readonly children: ReactNode
  readonly className?: string
  readonly style?: CSSProperties
  readonly id: string
}

// Un seul observateur pour toutes les boucles : la boucle (animations CSS) ne tourne que si la carte
// est à l'écran ET l'onglet visible. Hors de ces cas, `data-playing` est retiré et l'animation est en pause.
const onScreen = new Set<Element>()
let sharedObserver: IntersectionObserver | null = null

function sync(node: Element): void {
  if (onScreen.has(node) && document.visibilityState === 'visible') node.setAttribute('data-playing', '')
  else node.removeAttribute('data-playing')
}

function reelObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target)
        else onScreen.delete(entry.target)
        sync(entry.target)
      }
    },
    { threshold: 0.15 },
  )
  document.addEventListener('visibilitychange', () => {
    for (const node of onScreen) sync(node)
  })
  return sharedObserver
}

export default function ReelPlayer({ children, className, style, id }: ReelPlayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = reelObserver()
    observer.observe(node)
    return () => {
      observer.unobserve(node)
      onScreen.delete(node)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" data-project-reel={id} data-reel="" className={className} style={style}>
      {children}
    </div>
  )
}
