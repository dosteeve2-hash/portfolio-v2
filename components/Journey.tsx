import type { Dictionary } from '@/content/types'
import Reveal from './Reveal'
import Section from './Section'

export default function Journey({ dict }: { readonly dict: Dictionary }) {
  return (
    <Section id="journey" index={7} tone="soft" label={dict.nav.journey} title={dict.journey.title}>
      <ol className="relative ml-2 max-w-3xl border-l border-gold/50">
        {dict.journey.items.map((item, index) => (
          <li key={item.title} className="relative pb-10 pl-8 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-gold bg-bg3 shadow-[0_0_0_4px_rgba(240,168,50,0.18)]"
            />
            <Reveal delay={index * 0.06}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{item.period}</p>
              <h3 className="mt-1 font-display text-xl font-bold italic">{item.title}</h3>
              <p className="mt-1 text-text2">{item.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
