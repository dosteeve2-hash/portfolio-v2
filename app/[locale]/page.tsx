import { notFound } from 'next/navigation'
import About from '@/components/About'
import Architecture from '@/components/Architecture'
import Atmosphere from '@/components/Atmosphere'
import AssistantLauncher from '@/components/assistant/AssistantLauncher'
import Certifications from '@/components/Certifications'
import Contact from '@/components/Contact'
import FirstVersion from '@/components/FirstVersion'
import Footer from '@/components/Footer'
import Gallery from '@/components/Gallery'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Intro from '@/components/intro/Intro'
import Journey from '@/components/Journey'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import StackBand from '@/components/StackBand'
import { getDictionary } from '@/content'
import { isLocale } from '@/content/locales'
import { githubUrl, SITE, SITE_URL } from '@/content/site'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    url: `${SITE_URL}/${locale}`,
    email: SITE.email,
    jobTitle: dict.brand.name,
    affiliation: { '@type': 'CollegeOrUniversity', name: 'Tokat Gaziosmanpaşa Üniversitesi' },
    address: { '@type': 'PostalAddress', addressLocality: 'Tokat', addressCountry: 'TR' },
    knowsLanguage: ['fr', 'en', 'tr'],
    sameAs: [githubUrl(), SITE.linkedinUrl],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <Intro locale={locale} dict={dict} />
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        {dict.nav.skipToContent}
      </a>
      <Header locale={locale} dict={dict} />
      <main>
        <Hero locale={locale} dict={dict} />
        <StackBand locale={locale} />
        <About locale={locale} dict={dict} />
        <Skills locale={locale} dict={dict} />
        <Projects locale={locale} dict={dict} />
        <Architecture dict={dict} />
        <Certifications locale={locale} dict={dict} />
        <Journey dict={dict} />
        <Gallery dict={dict} />
        <FirstVersion dict={dict} />
        <Contact locale={locale} dict={dict} />
      </main>
      <Footer dict={dict} />
      <Atmosphere />
      <AssistantLauncher locale={locale} dict={dict} />
    </>
  )
}
