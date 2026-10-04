import { useSyncExternalStore } from 'react'

export type IntroPhase = 'pending' | 'playing' | 'done'

let phase: IntroPhase = 'pending'
const listeners = new Set<() => void>()

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getIntroPhase(): IntroPhase {
  return phase
}

export function setIntroPhase(next: IntroPhase): void {
  if (next === phase) return
  phase = next
  listeners.forEach((listener) => listener())
}

export function useIntroPhase(): IntroPhase {
  return useSyncExternalStore(subscribe, getIntroPhase, () => 'pending')
}
