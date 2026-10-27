'use client'

import { type Variants } from 'motion/react'
import * as m from 'motion/react-m'
import type { Locale } from '@/content/locales'
import { cvHref, SITE } from '@/content/site'
import type { Dictionary } from '@/content/types'
import { INTRO_NAME } from '@/content/intro'
import { useIntroHandoff, useIntroPhase } from '@/lib/introStore'
import { useReducedMotionSafe } from '@/lib/useReducedMotionSafe'
import { mascotText } from '@/content/mascotText'
import { certificationCount } from '@/content/certifications'
import { automatedTestCount, onlineProjectCount } from '@/content/projects'
import Cta from './Cta'
import Portrait from './Portrait'
import ProofStrip from './ProofStrip'
import TypedLine from './TypedLine'

interface HeroProps {
  readonly locale: Locale
  readonly dict: Dictionary
}

function itemVariants(distance: number): Variants {
  return {
    hide: { opacity: 0, y: distance },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.09, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    }),
  }
}

function splitName(full: string, part: string): readonly [string, string, string] {
  const index = full.indexOf(part)
  if (index < 0) return [full, '', '']
  return [full.slice(0, index), part, full.slice(index + part.length)]
}

const NAME_PARTS = splitName(SITE.name, INTRO_NAME)

export default function Hero({ locale, dict }: HeroProps) {
  const phase = useIntroPhase()
  const handoff = useIntroHandoff()
  const reduce = useReducedMotionSafe()
  const state = phase === 'done' ? 'show' : 'hide'
  const variants = itemVariants(reduce ? 0 : 20)
  const [nameBefore, nameMiddle, nameAfter] = NAME_PARTS
  // Pendant le vol de l'intro, le titre se met en place (invisible, sans décalage) pour être mesuré ;
  // à l'atterrissage il apparaît d'un coup sous le nom de l'intro, et le reste du nom se fond autour.
  const titleTarget =
    handoff === 'none' ? state : { opacity: handoff === 'landed' ? 1 : 0, y: 0, transition: { duration: 0 } }
  const sideTransition = handoff === 'landed' ? { duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const } : { duration: 0 }

  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-svh items-center overflow-hidden pb-16 pt-28">
      <div
        aria-hidden="true"
        className="calque pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1.25fr_0.75fr]">
        <div>
          <m.div
            data-hero
            custom={0}
            variants={variants}
            initial="hide"
            animate={state}
            className="inline-flex items-center gap-2 rounded-sm border border-line2 bg-bg3 px-3 py-1.5 font-mono text-xs text-text"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="7" fill="#0f8a5f" />
              <path d="M4 7.2l2 2L10 5" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {dict.badge}
          </m.div>

          <m.h1
            data-hero
            id="hero-title"
            custom={1}
            variants={variants}
            initial="hide"
            animate={titleTarget}
            className="mt-6 font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            <m.span initial={false} animate={{ opacity: handoff === 'flying' ? 0 : 1 }} transition={sideTransition}>
              {nameBefore}
            </m.span>
            <span data-intro-target="name">{nameMiddle}</span>
            <m.span initial={false} animate={{ opacity: handoff === 'flying' ? 0 : 1 }} transition={sideTransition}>
              {nameAfter}
            </m.span>
          </m.h1>

          <m.div data-hero custom={2} variants={variants} initial="hide" animate={state} className="mt-3">
            <TypedLine
              lead={dict.brand.slogan}
              labels={mascotText[locale].heroLabels}
              start={phase === 'done'}
              reduceMotion={reduce}
            />
          </m.div>

          <m.div
            data-hero
            data-intro-target="line"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: state === 'show' || handoff === 'landed' ? 1 : 0 }}
            transition={
              handoff === 'landed'
                ? { duration: 0 }
                : { delay: 0.3, duration: reduce ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }
            }
            className="mt-5 h-[2px] w-40 origin-left bg-accent"
          />

          <m.p
            data-hero
            custom={4}
            variants={variants}
            initial="hide"
            animate={state}
            className="mt-6 max-w-xl text-lg text-text2"
          >
            {dict.hero.subtitle}
          </m.p>

          <m.div
            data-hero
            custom={5}
            variants={variants}
            initial="hide"
            animate={state}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Cta href={cvHref(locale)}>{dict.hero.cv}</Cta>
            <Cta href={`/${locale}#contact`} variant="ghost">
              {dict.hero.contact}
            </Cta>
          </m.div>

          <m.div data-hero custom={6} variants={variants} initial="hide" animate={state} className="mt-10">
            <ProofStrip
              figures={[
                { value: onlineProjectCount, label: dict.proof.projects },
                { value: certificationCount, label: dict.proof.certifications },
                { value: automatedTestCount, label: dict.proof.tests },
              ]}
            />
          </m.div>
        </div>

        <m.div
          data-hero
          custom={3}
          variants={variants}
          initial="hide"
          animate={state}
          className="relative mx-auto w-full max-w-[260px] sm:max-w-[320px]"
        >
          <Portrait alt={dict.hero.portraitAlt} sizes="(min-width: 640px) 320px, 260px" priority />
          <span aria-hidden="true" className="absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2 border-accent" />
          <span aria-hidden="true" className="absolute -bottom-2 -right-2 h-5 w-5 border-b-2 border-r-2 border-accent" />
        </m.div>
      </div>
    </section>
  )
}
