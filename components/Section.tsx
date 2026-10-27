import type { ReactNode } from 'react'
import Reveal from './Reveal'

export type SectionTone = 'plain' | 'soft' | 'navy'

interface SectionProps {
  readonly id: string
  readonly index: number
  readonly label: string
  readonly title: string
  readonly intro?: string
  readonly tone?: SectionTone
  readonly children: ReactNode
}

const toneClass: Readonly<Record<SectionTone, string>> = {
  plain: '',
  soft: 'bg-bg2/70',
  navy: 'theme-navy section-navy text-text',
}

export default function Section({ id, index, label, title, intro, tone = 'plain', children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`cv-auto scroll-mt-16 py-20 md:py-28 ${toneClass[tone]}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-10 max-w-2xl md:mb-14">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            <span aria-hidden="true" className="border border-accent px-1.5 py-0.5 text-[11px] tracking-[0.1em]">
              {String(index).padStart(2, '0')}
            </span>
            <span className="sr-only">{String(index).padStart(2, '0')} — </span>
            {label}
          </p>
          <h2 id={`${id}-title`} className="mt-4 pb-1 font-display text-3xl font-semibold leading-tight md:text-4xl">
            {title}
          </h2>
          <span aria-hidden="true" className="rule mt-3" />
          {intro ? <p className="mt-5 text-text2">{intro}</p> : null}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
