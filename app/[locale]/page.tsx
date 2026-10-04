import { notFound } from 'next/navigation'
import About from '@/components/About'
import Architecture from '@/components/Architecture'
import Certifications from '@/components/Certifications'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Intro from '@/components/Intro'
import Journey from '@/components/Journey'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import { getDictionary } from '@/content'
import { isLocale } from '@/content/locales'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <>
      <Intro dict={dict} />
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-bg"
      >
        {dict.nav.skipToContent}
      </a>
      <Header locale={locale} dict={dict} />
      <main>
        <Hero locale={locale} dict={dict} />
        <About locale={locale} dict={dict} />
        <Skills locale={locale} dict={dict} />
        <Projects locale={locale} dict={dict} />
        <Architecture dict={dict} />
        <Certifications locale={locale} dict={dict} />
        <Journey dict={dict} />
        <Contact locale={locale} dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  )
}
