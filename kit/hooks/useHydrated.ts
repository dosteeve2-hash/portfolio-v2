import { useSyncExternalStore } from 'react'

const noop = () => () => undefined

/** Faux côté serveur et pendant l'hydratation, vrai juste après : permet de passer de l'état « sans JavaScript » à l'état animé. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}
