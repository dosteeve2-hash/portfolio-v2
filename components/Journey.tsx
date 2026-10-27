import type { CSSProperties } from 'react'
import type { Dictionary } from '@/content/types'
import Reveal from './Reveal'
import Section from './Section'

interface JourneyItem {
  readonly period: string
  readonly title: string
  readonly text: string
}

/** Frise verticale : le trait se tire, puis chaque jalon entre à son tour (transform et opacity). */
export function JourneyList({ items }: { readonly items: readonly JourneyItem[] }) {
  return (
    <Reveal>
      <div className="relative ml-2 max-w-3xl">
        <span aria-hidden="true" className="journey-line pointer-events-none absolute -bottom-1 left-0 top-1 w-px bg-accent" />
        <ol>
        {items.map((item, index) => (
          <li key={item.title} className="tl-item relative pb-10 pl-8 last:pb-0" style={{ '--i': index } as CSSProperties}>
            <span
              aria-hidden="true"
              className="absolute -left-[6px] top-2 h-3 w-3 border-2 border-accent bg-bg"
            />
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{item.period}</p>
            <h3 className="mt-1 font-display text-xl font-semibold">{item.title}</h3>
            <p className="mt-1 text-text2">{item.text}</p>
          </li>
        ))}
        </ol>
      </div>
    </Reveal>
  )
}

export default function Journey({ dict }: { readonly dict: Dictionary }) {
  return (
    <Section id="journey" index={7} tone="soft" label={dict.nav.journey} title={dict.journey.title}>
      <JourneyList items={dict.journey.items} />
    </Section>
  )
}
