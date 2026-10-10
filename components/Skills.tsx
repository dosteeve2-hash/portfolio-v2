import type { Locale } from '@/content/locales'
import { skillGroups, type SkillLevel } from '@/content/skills'
import type { Dictionary } from '@/content/types'
import Reveal from './Reveal'
import Section from './Section'

const pips: Readonly<Record<SkillLevel, number>> = { veryGood: 3, good: 2, average: 1 }

function Pips({ level }: { readonly level: SkillLevel }) {
  return (
    <span aria-hidden="true" className="flex gap-0.5">
      {[1, 2, 3].map((n) => (
        <span key={n} className={`h-1.5 w-3 rounded-full ${n <= pips[level] ? 'bg-gold' : 'bg-line2'}`} />
      ))}
    </span>
  )
}

export default function Skills({ locale, dict }: { readonly locale: Locale; readonly dict: Dictionary }) {
  return (
    <Section id="skills" index={3} tone="soft" label={dict.nav.skills} title={dict.skills.title} intro={dict.skills.intro}>
      <div className="grid gap-5 md:grid-cols-3">
        {skillGroups.map((group, index) => (
          <Reveal key={group.id} delay={index * 0.08}>
            <div data-spotlight className="h-full rounded-2xl border border-line bg-bg3 p-6 shadow-soft">
              <h3 className="font-display text-xl font-bold italic text-navy">{group.title[locale]}</h3>
              <ul className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item.name.en}
                    className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="text-text">{item.name[locale]}</span>
                    {item.level ? (
                      <span className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-text2">
                        <Pips level={item.level} />
                        {dict.skills.levels[item.level]}
                        {item.note ? <span className="text-text2">· {item.note[locale]}</span> : null}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
