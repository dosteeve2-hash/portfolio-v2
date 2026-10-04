'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { Locale } from '@/content/locales'
import { useIntroPhase } from '@/lib/introStore'

interface IdleWindow {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

const Mascot = dynamic(() => import('./Mascot'), { ssr: false })

export default function MascotLoader({ locale }: { readonly locale: Locale }) {
  const phase = useIntroPhase()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (phase !== 'done') return undefined
    const idleWindow: IdleWindow = window
    if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
      const id = idleWindow.requestIdleCallback(() => setReady(true), { timeout: 2500 })
      return () => idleWindow.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(() => setReady(true), 700)
    return () => window.clearTimeout(id)
  }, [phase])

  return ready ? <Mascot locale={locale} /> : null
}
