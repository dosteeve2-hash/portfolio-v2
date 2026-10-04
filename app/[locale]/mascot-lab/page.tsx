import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import MascotLab from '@/components/mascot/MascotLab'
import { isLocale } from '@/content/locales'

export const metadata: Metadata = {
  title: 'Mascot lab',
  robots: { index: false, follow: false },
}

export default async function MascotLabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <MascotLab locale={locale} />
}
