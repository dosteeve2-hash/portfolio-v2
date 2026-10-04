import type { Dictionary } from '@/content/types'
import Reveal from './Reveal'
import Section from './Section'

export default function About({ dict }: { readonly dict: Dictionary }) {
  return (
    <Section id="about" index={2} label={dict.nav.about} title={dict.about.title}>
      <div className="max-w-3xl space-y-5 text-lg text-text2">
        {dict.about.paragraphs.map((paragraph, index) => (
          <Reveal key={paragraph} delay={index * 0.08}>
            <p>{paragraph}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
