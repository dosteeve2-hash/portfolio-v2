import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(listener: () => void): () => void {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}

/** Serveur et premier rendu client : `false` (pas d'écart d'hydratation) ; puis la vraie préférence. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
