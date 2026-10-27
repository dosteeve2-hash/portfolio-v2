import Link from 'next/link'
import Cta from '@/components/Cta'
import Portrait from '@/components/Portrait'
import ProofStrip, { type ProofFigure } from '@/components/ProofStrip'
import type { Cartouche } from '@/content/entry'

interface EntryHeroProps {
  readonly kicker: string
  readonly title: string
  readonly lead: string
  readonly primary: { readonly label: string; readonly href: string }
  readonly secondary: { readonly label: string; readonly href: string }
  readonly figures: readonly ProofFigure[]
  readonly figureNote?: string
  readonly cartouche: Cartouche
  readonly portraitAlt: string
}

/** Accueil d'une page d'entrée : phrase-résultat, une action dominante, trois chiffres, cartouche d'identité. */
export default function EntryHero({
  kicker,
  title,
  lead,
  primary,
  secondary,
  figures,
  figureNote,
  cartouche,
  portraitAlt,
}: EntryHeroProps) {
  const rows: readonly (readonly [string, string])[] = [
    [cartouche.labels.formation, cartouche.formation],
    [cartouche.labels.place, cartouche.place],
    [cartouche.labels.languages, cartouche.languages],
    [cartouche.labels.availability, cartouche.availability],
  ]
  const secondaryClass =
    'inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.14em] text-text underline decoration-accent decoration-1 underline-offset-[6px] transition-colors hover:text-accent'

  return (
    <section aria-labelledby="entry-title" className="relative overflow-hidden pb-16 pt-28 md:pb-20 md:pt-36">
      <div
        aria-hidden="true"
        className="calque pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.45fr_0.8fr] lg:items-start">
        <div>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            {kicker}
          </p>
          <h1
            id="entry-title"
            className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-[3.4rem]"
          >
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text2">{lead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Cta href={primary.href}>{primary.label}</Cta>
            {secondary.href.endsWith('.pdf') ? (
              <a href={secondary.href} download className={secondaryClass}>
                {secondary.label}
              </a>
            ) : (
              <Link href={secondary.href} className={secondaryClass}>
                {secondary.label}
              </Link>
            )}
          </div>
          <div className="mt-10">
            <ProofStrip figures={figures} />
            {figureNote ? (
              <p className="mt-3 max-w-xl font-mono text-[11px] leading-relaxed text-text2">{figureNote}</p>
            ) : null}
          </div>
        </div>

        <aside className="rounded-md border border-line2 bg-bg3">
          <div className="flex items-center gap-4 border-b border-line2 p-4">
            <Portrait alt={portraitAlt} sizes="88px" className="!w-[88px] shrink-0" />
            <p className="font-display text-xl font-semibold leading-tight">{cartouche.name}</p>
          </div>
          <dl>
            {rows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[7.5rem_1fr] border-b border-line last:border-b-0">
                <dt className="bg-bg2 px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-text2">
                  {label}
                </dt>
                <dd className="px-3 py-2.5 text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}
