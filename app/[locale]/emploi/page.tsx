import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Architecture from '@/components/Architecture'
import Contact from '@/components/Contact'
import CaseStudyCard from '@/components/entry/CaseStudyCard'
import CheckCard from '@/components/entry/CheckCard'
import EntryHero from '@/components/entry/EntryHero'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Reveal from '@/components/Reveal'
import Section from '@/components/Section'
import Skills from '@/components/Skills'
import { getDictionary } from '@/content'
import { caseStudies, entry, localizedCount } from '@/content/entry'
import { isLocale } from '@/content/locales'
import { automatedTestCount, onlineProjectCount } from '@/content/projects'
import { cvHref, SITE } from '@/content/site'
import { localeAlternates } from '@/lib/seo'

interface PageProps {
  readonly params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const copy = entry[locale].emploi
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: localeAlternates(locale, '/emploi'),
    openGraph: { title: copy.metaTitle, description: copy.metaDescription, url: `/${locale}/emploi`, type: 'website' },
  }
}

export default async function EmploiPage({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const copy = entry[locale].emploi
  const common = entry[locale].common

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        {dict.nav.skipToContent}
      </a>
      <Header locale={locale} dict={dict} immediate />
      <main id="main">
        <EntryHero
          kicker={copy.kicker}
          title={copy.title}
          lead={copy.lead}
          primary={{ label: copy.contact, href: `mailto:${SITE.email}` }}
          secondary={{ label: copy.cv, href: cvHref(locale) }}
          figures={[
            { value: onlineProjectCount, label: copy.figures[0] },
            { value: automatedTestCount, label: copy.figures[1] },
            { value: 100, suffix: '/100', label: copy.figures[2] },
          ]}
          figureNote={copy.figureNote}
          cartouche={copy.cartouche}
          portraitAlt={dict.hero.portraitAlt}
        />

        <Section id="cases" index={1} label={dict.nav.projects} title={copy.casesTitle} intro={copy.casesIntro}>
          <ul className="space-y-5">
            {caseStudies.map((study) => (
              <li key={study.id} id={`case-${study.id}`} className="scroll-mt-24">
                <Reveal>
                  <CaseStudyCard study={study} locale={locale} dict={dict} />
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>

        <Architecture dict={dict} index={2} />

        <Section id="proof" index={3} label={common.proof} title={copy.proofTitle} intro={copy.proofIntro}>
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal>
              <CheckCard title={copy.qualityTitle} spec={common.spec} points={copy.qualityPoints} />
            </Reveal>
            <Reveal delay={0.06}>
              <CheckCard title={copy.securityTitle} spec={common.spec} points={copy.securityPoints} />
            </Reveal>
            <Reveal delay={0.12}>
              <CheckCard
                title={copy.deployTitle}
                spec={common.spec}
                points={copy.deployPoints.map((point) => localizedCount(point, onlineProjectCount))}
              />
            </Reveal>
          </div>
        </Section>

        <Skills locale={locale} dict={dict} index={4} />
        <Contact locale={locale} dict={dict} index={5} action="mail" />
        <p className="bg-bg px-4 py-6 text-center text-sm text-text2 sm:px-6">
          {copy.otherEntry}{' '}
          <Link href={`/${locale}/stage`} className="inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-4">
            {dict.nav.stage} →
          </Link>
        </p>
      </main>
      <Footer dict={dict} />
    </>
  )
}
