import { ImageResponse } from 'next/og'
import { getDictionary } from '@/content'
import { defaultLocale, isLocale } from '@/content/locales'
import { SITE } from '@/content/site'

export const alt = 'Steeve Donald Compaoré'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = getDictionary(isLocale(locale) ? locale : defaultLocale)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f4f2ec',
          color: '#14213d',
          padding: 72,
          border: '14px solid #14213d',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4, color: '#1f4fd8' }}>{dict.brand.name.toUpperCase()}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>{SITE.name}</div>
          <div style={{ display: 'flex', width: 120, height: 6, background: '#1f4fd8', marginTop: 28 }} />
          <div style={{ display: 'flex', fontSize: 38, marginTop: 28, color: '#46536f' }}>{dict.brand.slogan}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#46536f' }}>{dict.badge}</div>
      </div>
    ),
    size,
  )
}
