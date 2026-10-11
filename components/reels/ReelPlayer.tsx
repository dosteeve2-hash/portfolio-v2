'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface ReelPlayerProps {
  readonly children: ReactNode
  readonly className?: string
  readonly style?: CSSProperties
  readonly id: string
}

/**
 * Un seul coordinateur pour toutes les boucles. Chaque carte est dans l'un de trois états (`data-reel-state`) :
 * - `play` : la boucle tourne (au plus DEUX cartes, les plus proches du centre de l'écran, visibles) ;
 * - `pause` : la boucle est figée sur son image courante (défilement en cours, onglet masqué) ;
 * - `still` : image fixe composée (le logo final), sans aucune animation.
 * Pendant un défilement, les cartes `play` passent en `pause` ; l'état est recalculé 150 ms après l'arrêt.
 */
const MAX_PLAYING = 2
const RESUME_DELAY_MS = 150

const registered = new Set<Element>()
const onScreen = new Set<Element>()
const lastPlayed = new WeakMap<Element, number>()
let sharedObserver: IntersectionObserver | null = null
let scrolling = false
let resumeTimer: number | undefined

function setState(node: Element, state: 'play' | 'pause' | 'still'): void {
  if (node.getAttribute('data-reel-state') !== state) node.setAttribute('data-reel-state', state)
}

function distanceToCenter(node: Element): number {
  const rect = node.getBoundingClientRect()
  return Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2)
}

function settle(): void {
  if (document.visibilityState !== 'visible') {
    for (const node of registered) if (node.getAttribute('data-reel-state') === 'play') setState(node, 'pause')
    return
  }
  // Cartes d'une même rangée = même distance : à égalité (à 8 px près), celle qui a joué le moins récemment passe d'abord.
  const winners = new Set(
    [...onScreen]
      .map((node) => ({ node, d: Math.round(distanceToCenter(node) / 8), last: lastPlayed.get(node) ?? 0 }))
      .sort((a, b) => a.d - b.d || a.last - b.last)
      .slice(0, MAX_PLAYING)
      .map((entry) => entry.node),
  )
  const now = performance.now()
  for (const node of registered) {
    const wins = winners.has(node)
    if (wins && node.getAttribute('data-reel-state') !== 'play') lastPlayed.set(node, now)
    setState(node, wins ? 'play' : 'still')
  }
}

function onScroll(): void {
  if (!scrolling) {
    scrolling = true
    for (const node of registered) if (node.getAttribute('data-reel-state') === 'play') setState(node, 'pause')
  }
  window.clearTimeout(resumeTimer)
  resumeTimer = window.setTimeout(() => {
    scrolling = false
    settle()
  }, RESUME_DELAY_MS)
}

function reelObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target)
        else onScreen.delete(entry.target)
      }
      if (!scrolling) settle()
    },
    { threshold: 0.15 },
  )
  document.addEventListener('visibilitychange', settle)
  window.addEventListener('scroll', onScroll, { passive: true })
  return sharedObserver
}

export default function ReelPlayer({ children, className, style, id }: ReelPlayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = reelObserver()
    registered.add(node)
    observer.observe(node)
    return () => {
      observer.unobserve(node)
      registered.delete(node)
      onScreen.delete(node)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" data-project-reel={id} data-reel="" className={className} style={style}>
      {children}
    </div>
  )
}
