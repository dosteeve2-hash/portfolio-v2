import type { Metadata, Viewport } from 'next'
import { Outfit, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import { notFound } from 'next/navigation'
import IntroVoiceProvider from '@/components/intro/IntroVoice'
import { getDictionary } from '@/content'
import { introTimelines } from '@/content/intro'
import { isLocale, locales } from '@/content/locales'
import { INTRO_STORAGE_KEY } from '@/lib/introKey'
import '../globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

interface LocaleParams {
  params: Promise<{ locale: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: '#070e1f',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { meta } = getDictionary(locale)
  return { title: meta.title, description: meta.description }
}

const introSeenScript = `try{if(sessionStorage.getItem('${INTRO_STORAGE_KEY}')==='1')document.documentElement.dataset.intro='seen'}catch(e){}`

const forceVisibleStyles = `[data-reveal],[data-hero]{opacity:1!important;transform:none!important}.intro-root{display:none!important}`

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: React.ReactNode }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const { intro } = getDictionary(locale)
  const voiceLabels = { listen: intro.listen, mute: intro.mute, unmute: intro.unmute }

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${outfit.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introSeenScript }} />
        <noscript>
          <style>{forceVisibleStyles}</style>
        </noscript>
      </head>
      <body>
        <IntroVoiceProvider src={introTimelines[locale].audio} labels={voiceLabels}>
          {children}
        </IntroVoiceProvider>
      </body>
    </html>
  )
}
