import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Certifications from '@/components/Certifications'
import Contact from '@/components/Contact'
import EntryHero from '@/components/entry/EntryHero'
import ProjectRow from '@/components/entry/ProjectRow'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { JourneyList } from '@/components/Journey'
import Reveal from '@/components/Reveal'
import Section from '@/components/Section'
import Skills from '@/components/Skills'
import { getDictionary } from '@/content'
import { certificationCount, totalHours } from '@/content/certifications'
import { entry, localizedCount, stageProjectOrder } from '@/content/entry'
import { isLocale } from '@/content/locales'
import { onlineProjectCount, projectById, projects } from '@/content/projects'
import { cvHref } from '@/content/site'
import { localeAlternates } from '@/lib/seo'

interface PageProps {
  readonly params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const copy = entry[locale].stage
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: localeAlternates(locale, '/stage'),
    openGraph: { title: copy.metaTitle, description: copy.metaDescription, url: `/${locale}/stage`, type: 'website' },
  }
}

export default async function StagePage({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const copy = entry[locale].stage
  const common = entry[locale].common
  const journeyItems = [0, 1, dict.journey.items.length - 1].flatMap((index) => {
    const item = dict.journey.items[index]
    return item ? [item] : []
  })

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
          title={localizedCount(copy.title, onlineProjectCount)}
          lead={copy.lead}
          primary={{ label: copy.cv, href: cvHref(locale) }}
          secondary={{ label: copy.write, href: `/${locale}/stage#contact` }}
          figures={[
            { value: onlineProjectCount, label: copy.figures[0] },
            { value: certificationCount, label: copy.figures[1] },
            { value: totalHours, label: copy.figures[2] },
          ]}
          cartouche={copy.cartouche}
          portraitAlt={dict.hero.portraitAlt}
        />

        <Section id="formation" index={1} label={dict.nav.journey} title={copy.formationTitle} intro={copy.formationIntro}>
          <JourneyList items={journeyItems} />
        </Section>

        <Section id="projects" index={2} tone="soft" label={dict.nav.projects} title={copy.projectsTitle} intro={copy.projectsIntro}>
          <ul className="space-y-4">
            {stageProjectOrder.map((id, index) => (
              <li key={id}>
                <Reveal delay={(index % 3) * 0.05}>
                  <ProjectRow project={projectById(id)} locale={locale} dict={dict} />
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link
              href={`/${locale}#projects`}
              className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.14em] text-accent underline decoration-accent decoration-1 underline-offset-[6px]"
            >
              {localizedCount(common.seeAllProjects, projects.length)} →
            </Link>
          </p>
        </Section>

        <Skills locale={locale} dict={dict} index={3} />
        <Certifications locale={locale} dict={dict} index={4} />

        <Section id="availability" index={5} tone="soft" label={copy.kicker} title={copy.availabilityTitle} intro={copy.availabilityIntro}>
          <Reveal>
            <ul className="grid max-w-3xl gap-px border border-line2 bg-line2 sm:grid-cols-2">
              {copy.availabilityPoints.map((point) => (
                <li key={point} className="bg-bg3 p-5 text-[15px]">
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>

        <Contact locale={locale} dict={dict} index={6} />
        <p className="bg-bg px-4 py-6 text-center text-sm text-text2 sm:px-6">
          {copy.otherEntry}{' '}
          <Link href={`/${locale}/emploi`} className="inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-4">
            {dict.nav.emploi} →
          </Link>
        </p>
      </main>
      <Footer dict={dict} />
    </>
  )
}
