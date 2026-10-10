import CountUp from '@/components/CountUp'
import {
  certificationGroupOrder,
  certificationsOf,
  linkedinLearningCount,
  totalHours,
  type Certification,
} from '@/content/certifications'
import type { Locale } from '@/content/locales'
import type { Dictionary } from '@/content/types'
import Reveal from './Reveal'
import Section from './Section'

type Labels = Dictionary['certifications']

function formatDate(date: string, locale: Locale): string {
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(parsed)
}

function formatDuration(minutes: number, labels: Labels): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  const parts: string[] = []
  if (hours > 0) parts.push(`${hours} ${labels.hourUnit}`)
  if (rest > 0) parts.push(`${rest} ${labels.minuteUnit}`)
  return parts.join(' ')
}

function shortId(id: string): string {
  return `${id.slice(0, 8)}…`
}

const linkClass =
  'inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.05em] transition-colors'

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 9l6-6M4 3h5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface CardProps {
  readonly item: Certification
  readonly locale: Locale
  readonly labels: Labels
}

function CertificationCard({ item, locale, labels }: CardProps) {
  return (
    <article className="cert-card flex h-full flex-col rounded-2xl border border-line bg-bg3 p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
        <span lang={item.lang} className="font-medium text-navy">{item.issuer}</span>
        {item.date ? (
          <time dateTime={item.date} className="text-right text-text2">
            {formatDate(item.date, locale)}
          </time>
        ) : null}
      </div>
      <h4 lang={item.lang} className="mt-3 font-display text-lg font-bold italic leading-snug text-text">{item.title}</h4>
      {item.subtitle ? (
        <p lang={item.lang} className="mt-1 text-sm text-text2">
          {item.subtitle}
        </p>
      ) : null}
      {item.minutes ? (
        <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-bg2 px-2.5 py-1 font-mono text-[11px] text-text">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
          {formatDuration(item.minutes, labels)}
        </p>
      ) : null}
      {item.note ? <p className="mt-3 text-sm text-text2">{item.note[locale]}</p> : null}
      {item.skills.length > 0 ? (
        <ul lang={item.lang} className="mt-3 flex flex-wrap gap-1.5">
          {item.skills.map((skill) => (
            <li key={skill} className="rounded-md border border-line px-2 py-0.5 text-xs text-text2">
              {skill}
            </li>
          ))}
        </ul>
      ) : null}
      {item.credentialId ? (
        <p className="mt-3 font-mono text-[11px] text-text2">
          {labels.idLabel} <span className="text-text">{shortId(item.credentialId)}</span>
        </p>
      ) : null}
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <a
          href={item.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkClass} border-accent bg-accent text-white hover:border-navy hover:bg-navy`}
        >
          {labels.viewPdf}
          <ArrowIcon />
        </a>
        {item.verifyUrl ? (
          <a
            href={item.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} border-line2 bg-bg3 text-accent hover:border-accent`}
          >
            {labels.verify}
            <ArrowIcon />
          </a>
        ) : null}
      </div>
    </article>
  )
}

export default function Certifications({ locale, dict }: { readonly locale: Locale; readonly dict: Dictionary }) {
  const labels = dict.certifications

  return (
    <Section id="certifications" index={6} label={dict.nav.certifications} title={labels.title} intro={labels.intro}>
      <Reveal>
        <dl className="mb-14 flex flex-wrap gap-x-12 gap-y-6">
          <div className="flex flex-col-reverse">
            <dt className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-text2">{labels.statCount}</dt>
            <dd className="font-display text-6xl font-black italic leading-none text-navy">
              <CountUp value={linkedinLearningCount} />
              <span aria-hidden="true" className="gold-rule mt-3" />
            </dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-text2">{labels.statHours}</dt>
            <dd className="font-display text-6xl font-black italic leading-none text-navy">
              <CountUp value={totalHours} />
              <span aria-hidden="true" className="gold-rule mt-3" />
            </dd>
          </div>
        </dl>
      </Reveal>

      <div className="space-y-14">
        {certificationGroupOrder.map((group) => {
          const items = certificationsOf(group)
          if (items.length === 0) return null
          return (
            <div key={group}>
              <Reveal className="mb-5">
                <h3 className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  {labels.groups[group]}
                  <span className="text-text2">{String(items.length).padStart(2, '0')}</span>
                </h3>
                <span aria-hidden="true" className="mt-2 block h-px w-full bg-gradient-to-r from-gold/60 via-line to-transparent" />
              </Reveal>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                  <li key={item.id}>
                    <Reveal variant="drop" delay={(index % 3) * 0.08} className="lift h-full">
                      <CertificationCard item={item} locale={locale} labels={labels} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
