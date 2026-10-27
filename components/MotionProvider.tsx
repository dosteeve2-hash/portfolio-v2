'use client'

import { LazyMotion } from 'motion/react'
import type { ReactNode } from 'react'

// Les fonctions d'animation (≈ 17 Ko) sont chargées après le premier affichage, hors du chemin critique.
const loadFeatures = () => import('@/lib/motionFeatures').then((module) => module.default)

export default function MotionProvider({ children }: { readonly children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  )
}
