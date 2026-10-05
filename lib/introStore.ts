import { useSyncExternalStore } from 'react'

export type IntroPhase = 'pending' | 'playing' | 'done'

/**
 * Passage de relais entre l'intro et l'accueil :
 * - 'none'    : l'accueil fait sa propre entrée ;
 * - 'flying'  : le nom et la ligne d'or de l'intro volent vers leur place dans l'accueil,
 *               qui se met en position finale, encore invisible ;
 * - 'landed'  : ils sont posés, l'accueil prend le relais sans coupure.
 */
export type IntroHandoff = 'none' | 'flying' | 'landed'

interface IntroState {
  readonly phase: IntroPhase
  readonly handoff: IntroHandoff
}

const initial: IntroState = { phase: 'pending', handoff: 'none' }
let state: IntroState = initial
const listeners = new Set<() => void>()

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function update(next: Partial<IntroState>): void {
  const merged: IntroState = { ...state, ...next }
  if (merged.phase === state.phase && merged.handoff === state.handoff) return
  state = merged
  listeners.forEach((listener) => listener())
}

export function getIntroPhase(): IntroPhase {
  return state.phase
}

export function setIntroPhase(next: IntroPhase): void {
  update({ phase: next })
}

export function setIntroHandoff(next: IntroHandoff): void {
  update({ handoff: next })
}

export function useIntroPhase(): IntroPhase {
  return useSyncExternalStore(subscribe, () => state.phase, () => initial.phase)
}

export function useIntroHandoff(): IntroHandoff {
  return useSyncExternalStore(subscribe, () => state.handoff, () => initial.handoff)
}
