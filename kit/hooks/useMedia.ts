import { useCallback, useSyncExternalStore } from 'react'

/** Abonnement à une media query ; `serverValue` sert au rendu serveur. */
export function useMedia(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (listener: () => void) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}

export const FINE_POINTER = '(hover: hover) and (pointer: fine)'
