import Link from 'next/link'
import type { ReactNode } from 'react'

interface CtaProps {
  readonly href: string
  readonly variant?: 'primary' | 'ghost'
  readonly external?: boolean
  readonly children: ReactNode
}

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-6 py-3 font-mono text-[13px] font-medium uppercase tracking-[0.08em] transition-[background-color,border-color,color,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]'

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  ghost: 'border border-line2 bg-bg3 text-text hover:border-accent hover:text-accent',
} as const

export default function Cta({ href, variant = 'primary', external = false, children }: CtaProps) {
  if (href.endsWith('.pdf')) {
    return (
      <a href={href} download className={`${base} ${variants[variant]}`}>
        {children}
      </a>
    )
  }
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </Link>
  )
}
