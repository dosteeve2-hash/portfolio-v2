import Link from 'next/link'
import { getDictionary } from '@/content'
import { defaultLocale } from '@/content/locales'

export default function NotFound() {
  const dict = getDictionary(defaultLocale)
  return (
    <main className="flex min-h-svh items-center justify-center px-4 text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">404</p>
        <h1 className="mt-3 font-display text-4xl font-bold italic">{dict.notFound.title}</h1>
        <p className="mt-3 text-text2">{dict.notFound.text}</p>
        <Link href={`/${defaultLocale}`} className="mt-6 inline-block text-gold hover:text-gold2">
          {dict.notFound.back}
        </Link>
      </div>
    </main>
  )
}
