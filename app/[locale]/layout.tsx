import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { notFound } from 'next/navigation'
import IntroVoiceProvider from '@/components/intro/IntroVoice'
import MotionProvider from '@/components/MotionProvider'
import RevealController from '@/components/RevealController'
import { getDictionary } from '@/content'
import { introTimelines } from '@/content/intro'
import { isLocale, locales } from '@/content/locales'
import { SITE_URL } from '@/content/site'
import { INTRO_STORAGE_KEY } from '@/lib/introKey'
import { localeAlternates } from '@/lib/seo'
import '../globals.css'

// Deux familles préchargées (titres, texte) ; la police des étiquettes se charge à la demande.
const grotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['600'],
  variable: '--font-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
})

interface LocaleParams {
  params: Promise<{ locale: string }>
}

export const dynamicParams = false

const ogLocale = { fr: 'fr_FR', en: 'en_US', tr: 'tr_TR' } as const

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: '#f4f2ec',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { meta } = getDictionary(locale)
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    alternates: localeAlternates(locale, ''),
    openGraph: {
      type: 'website',
      siteName: 'Steeve Donald Compaoré',
      title: meta.title,
      description: meta.description,
      url: `/${locale}`,
      locale: ogLocale[locale],
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
  }
}

const introSeenScript = `try{if(sessionStorage.getItem('${INTRO_STORAGE_KEY}')==='1')document.documentElement.dataset.intro='seen'}catch(e){}`

const forceVisibleStyles = `[data-reveal],[data-hero]{opacity:1!important;transform:none!important}.intro-root{display:none!important}.arch-edge{stroke-dashoffset:0!important}.arch-edge-dashed,.arch-node{opacity:1!important}.rule{transform:none!important}`

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: React.ReactNode }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const { intro } = getDictionary(locale)
  const voiceLabels = { mute: intro.mute, unmute: intro.unmute }

  return (
    <html
      lang={locale}
      className={`${grotesk.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introSeenScript }} />
        <noscript>
          <style>{forceVisibleStyles}</style>
        </noscript>
      </head>
      <body>
        <MotionProvider>
          <IntroVoiceProvider src={introTimelines[locale].audio} labels={voiceLabels}>
            {children}
            <RevealController />
          </IntroVoiceProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
