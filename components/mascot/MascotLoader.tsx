'use client'

import dynamic from 'next/dynamic'
import type { Locale } from '@/content/locales'
import { useIntroPhase } from '@/lib/introStore'
import { useAfterInteraction } from '@/lib/useAfterInteraction'

const Mascot = dynamic(() => import('./Mascot'), { ssr: false })

export default function MascotLoader({ locale }: { readonly locale: Locale }) {
  const phase = useIntroPhase()
  const ready = useAfterInteraction(8000, phase === 'done')

  return ready ? <Mascot locale={locale} /> : null
}
