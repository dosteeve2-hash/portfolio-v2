import { spokenLanguages } from '@/content/languages'
import type { Locale } from '@/content/locales'
import type { Dictionary } from '@/content/types'
import Reveal from './Reveal'
import Section from './Section'

export default function About({ locale, dict }: { readonly locale: Locale; readonly dict: Dictionary }) {
  return (
    <Section id="about" index={2} label={dict.nav.about} title={dict.about.title}>
      <div className="max-w-3xl space-y-5 text-lg text-text2">
        {dict.about.paragraphs.map((paragraph, index) => (
          <Reveal key={paragraph} delay={index * 0.08}>
            <p>{paragraph}</p>
          </Reveal>
        ))}
        <Reveal delay={0.3}>
          <p className="pt-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">{dict.about.languagesTitle}</p>
          <ul className="mt-3 flex flex-wrap gap-2 text-base">
            {spokenLanguages.map((language) => (
              <li key={language.name.en} className="rounded-full border border-line bg-bg3 px-3 py-1 shadow-soft">
                <span className="text-text">{language.name[locale]}</span>
                <span className="text-text2"> · {language.level[locale]}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
