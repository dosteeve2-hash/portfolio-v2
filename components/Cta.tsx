'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import type { ReactNode } from 'react'

const MotionLink = motion.create(Link)

interface CtaProps {
  readonly href: string
  readonly variant?: 'primary' | 'ghost'
  readonly external?: boolean
  readonly children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium text-sm tracking-wide transition-colors'

const variants = {
  primary: 'btn-sheen bg-accent text-on-accent shadow-[0_8px_20px_-10px_rgba(29,78,216,0.7)] hover:bg-accent-hover',
  ghost: 'border border-line2 bg-bg3 text-text shadow-soft hover:border-accent hover:text-accent',
} as const

export default function Cta({ href, variant = 'primary', external = false, children }: CtaProps) {
  return (
    <MotionLink
      href={href}
      className={`${base} ${variants[variant]}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </MotionLink>
  )
}
