import { useEffect, useState } from 'react'

interface IdleWindow {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

const INTERACTION_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel', 'scroll'] as const

/**
 * Vrai au premier geste du visiteur, ou au bout de `maxDelay` ms s'il ne bouge pas, puis une fois
 * le navigateur au repos : sert à différer les décors non essentiels (braises, mascotte) pour que
 * le chargement reste léger, sans les supprimer.
 */
export function useAfterInteraction(maxDelay = 8000, enabled = true): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined
    const idleWindow: IdleWindow = window
    let idleHandle = 0
    let timer = 0
    let done = false

    const release = () => {
      if (done) return
      done = true
      cleanup()
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(() => setReady(true), { timeout: 1500 })
      } else {
        timer = window.setTimeout(() => setReady(true), 300)
      }
    }
    const cleanup = () => {
      INTERACTION_EVENTS.forEach((name) => window.removeEventListener(name, release))
      window.clearTimeout(timer)
    }

    INTERACTION_EVENTS.forEach((name) => window.addEventListener(name, release, { passive: true, once: true }))
    timer = window.setTimeout(release, maxDelay)

    return () => {
      done = true
      cleanup()
      if (idleHandle !== 0) idleWindow.cancelIdleCallback?.(idleHandle)
      window.clearTimeout(timer)
    }
  }, [maxDelay, enabled])

  return ready
}
