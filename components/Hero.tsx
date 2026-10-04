'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'
import dynamic from 'next/dynamic'
import type { Locale } from '@/content/locales'
import { cvHref, SITE } from '@/content/site'
import type { Dictionary } from '@/content/types'
import { useIntroPhase } from '@/lib/introStore'
import Cta from './Cta'
import Portrait from './Portrait'

const Embers = dynamic(() => import('./Embers'), { ssr: false })

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

export default function Hero({ locale, dict }: HeroProps) {
  const phase = useIntroPhase()
  const reduce = useReducedMotion()
  const state = phase === 'done' ? 'show' : 'hide'
  const variants = itemVariants(reduce ? 0 : 20)

  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-svh items-center overflow-hidden pb-16 pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_40%,rgba(240,168,50,0.10),transparent_70%),radial-gradient(50%_40%_at_10%_100%,rgba(45,212,255,0.06),transparent_70%)]"
      />
      <Embers />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1.25fr_0.75fr]">
        <div>
          <motion.div
            data-hero
            custom={0}
            variants={variants}
            initial="hide"
            animate={state}
            className="inline-flex items-center gap-2 rounded-full border border-green/40 bg-green/10 px-4 py-1.5 font-mono text-xs text-text"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="7" fill="#22d98a" />
              <path d="M4 7.2l2 2L10 5" stroke="#070e1f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {dict.badge}
          </motion.div>

          <motion.h1
            data-hero
            id="hero-title"
            custom={1}
            variants={variants}
            initial="hide"
            animate={state}
            className="mt-6 font-display text-5xl font-black italic leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            {SITE.name}
          </motion.h1>

          <motion.p
            data-hero
            custom={2}
            variants={variants}
            initial="hide"
            animate={state}
            className="mt-3 font-display text-2xl italic text-gold2 sm:text-3xl"
          >
            {dict.brand.slogan}
          </motion.p>

          <motion.div
            data-hero
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: state === 'show' ? 1 : 0 }}
            transition={{ delay: 0.3, duration: reduce ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 h-px w-40 origin-left bg-gradient-to-r from-gold via-gold2 to-transparent shadow-[0_0_14px_1px_rgba(240,168,50,0.5)]"
          />

          <motion.p
            data-hero
            custom={4}
            variants={variants}
            initial="hide"
            animate={state}
            className="mt-6 max-w-xl text-lg text-text2"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
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
          </motion.div>
        </div>

        <motion.div
          data-hero
          custom={3}
          variants={variants}
          initial="hide"
          animate={state}
          className="relative mx-auto w-full max-w-[260px] sm:max-w-[320px]"
        >
          <Portrait alt={dict.hero.portraitAlt} sizes="(min-width: 640px) 320px, 260px" />
          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)] -rotate-90">
            <defs>
              <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2dd4ff" />
                <stop offset="100%" stopColor="#f0a832" />
              </linearGradient>
            </defs>
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="url(#hero-ring)"
              strokeWidth="0.9"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: state === 'show' ? 1 : 0 }}
              transition={{ delay: 0.4, duration: reduce ? 0.2 : 1.1, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
