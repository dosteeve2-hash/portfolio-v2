import type { MetadataRoute } from 'next'
import { locales } from '@/content/locales'
import { SITE_URL } from '@/content/site'

const pages = ['', '/stage', '/emploi'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((suffix) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${suffix}`,
      changeFrequency: 'monthly' as const,
      priority: suffix === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${suffix}`])),
      },
    })),
  )
}
