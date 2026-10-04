import { notFound } from 'next/navigation'
import Cta from '@/components/Cta'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { getDictionary } from '@/content'
import { isLocale } from '@/content/locales'
import { locales } from '@/content/locales'
import { cvPdfPath, SITE } from '@/content/site'

export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <>
      <Header locale={locale} dict={dict} immediate />
      <main className="flex min-h-svh items-center px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">CV</p>
          <h1 className="mt-3 font-display text-4xl font-bold italic md:text-5xl">{dict.cvPage.title}</h1>
          <p className="mt-4 text-text2">{dict.cvPage.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Cta href={`mailto:${SITE.email}`}>{dict.cvPage.contact}</Cta>
            <Cta href={`/${locale}`} variant="ghost">
              {dict.cvPage.back}
            </Cta>
          </div>
          <div className="mt-12 rounded-2xl border border-line2 bg-bg3 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{dict.cvPage.draftTitle}</p>
            <p className="mt-2 text-sm text-text2">{dict.cvPage.draftText}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {locales.map((code) => (
                <Cta key={code} href={cvPdfPath(code)} variant="ghost">
                  PDF {code.toUpperCase()}
                </Cta>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  )
}
