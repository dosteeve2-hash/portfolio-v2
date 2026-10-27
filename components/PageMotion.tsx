'use client'

import LiveGrid from '@/kit/components/LiveGrid'
import SmoothScroll from '@/kit/components/SmoothScroll'

// L'intro verrouille la page (overflow: hidden sur <html>) : le défilement fluide se met en pause pendant ce temps.
const pageIsFree = () => document.documentElement.style.overflow !== 'hidden'

/** Défilement fluide et grille de calque vivante, pour toutes les pages du site. */
export default function PageMotion() {
  return (
    <>
      <SmoothScroll shouldScroll={pageIsFree} />
      <LiveGrid rgb="31, 79, 216" opacity={0.9} drift={0.12} />
    </>
  )
}
