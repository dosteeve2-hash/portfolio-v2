import type { ReactNode } from 'react'
import Reveal from './Reveal'

interface SectionProps {
  readonly id: string
  readonly index: number
  readonly label: string
  readonly title: string
  readonly intro?: string
  readonly children: ReactNode
}

export default function Section({ id, index, label, title, intro, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
            {String(index).padStart(2, '0')} — {label}
          </p>
          <h2 id={`${id}-title`} className="mt-3 font-display text-4xl font-bold italic leading-tight md:text-5xl">
            {title}
          </h2>
          {intro ? <p className="mt-4 text-text2">{intro}</p> : null}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
