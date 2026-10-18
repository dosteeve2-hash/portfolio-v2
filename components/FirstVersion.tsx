import Image from 'next/image'
import { FIRST_VERSION_URL } from '@/content/site'
import type { Dictionary } from '@/content/types'
import Cta from './Cta'
import Reveal from './Reveal'
import Section from './Section'

export default function FirstVersion({ dict }: { readonly dict: Dictionary }) {
  const copy = dict.firstVersion
  return (
    <Section id="first-version" index={9} tone="soft" label={copy.tagline} title={copy.title}>
      <Reveal>
        <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-xl">
            <p className="text-lg text-text2">{copy.text}</p>
            <div className="mt-7">
              <Cta href={FIRST_VERSION_URL} external>
                <span aria-hidden="true">{copy.cta} ↗</span>
                <span className="sr-only">{copy.ctaLabel}</span>
              </Cta>
            </div>
          </div>

          <div
            role="img"
            aria-label={copy.previewAlt}
            className="relative isolate overflow-hidden rounded-2xl border border-[#1f3054] bg-[#070e1f] shadow-lift"
          >
            <div aria-hidden="true" className="flex items-stretch">
              <div className="flex flex-1 flex-col justify-center px-5 py-7 sm:px-7">
                <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#f0a832]">
                  <span className="h-px w-5 bg-[#f0a832]" />
                  {copy.tagline}
                </span>
                <span className="mt-3 font-display text-4xl font-black italic leading-[0.95] text-[#f5f0e8] sm:text-5xl">
                  STEEVE
                </span>
                <span className="font-display text-4xl font-black leading-[0.95] text-[#f0a832] sm:text-5xl">DO</span>
              </div>
              <div className="relative w-[38%] shrink-0">
                <Image
                  src="/photos/main.webp"
                  alt=""
                  width={600}
                  height={800}
                  loading="lazy"
                  sizes="160px"
                  className="h-full w-full object-cover object-top"
                />
                <span className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#070e1f] to-transparent" />
              </div>
            </div>
            <div aria-hidden="true" className="h-1 bg-gradient-to-r from-[#f0a832] via-[#f7c060] to-transparent" />
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
