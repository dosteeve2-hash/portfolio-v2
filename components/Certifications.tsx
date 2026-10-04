import { certifications } from '@/content/certifications'
import type { Locale } from '@/content/locales'
import type { Dictionary } from '@/content/types'
import Reveal from './Reveal'
import Section from './Section'

function formatDate(date: string, locale: Locale): string {
  const parsed = new Date(`${date}-01T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(parsed)
}

export default function Certifications({ locale, dict }: { readonly locale: Locale; readonly dict: Dictionary }) {
  return (
    <Section
      id="certifications"
      index={6}
      label={dict.nav.certifications}
      title={dict.certifications.title}
      intro={dict.certifications.intro}
    >
      {certifications.length === 0 ? (
        <Reveal>
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-line2 bg-bg2/60 px-6 py-14 text-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="text-gold">
              <path
                d="M20 4l13 5v9c0 8.5-5.4 15.2-13 18-7.6-2.8-13-9.5-13-18V9l13-5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M14 20l4.5 4.5L27 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="mt-5 font-display text-2xl font-bold italic">{dict.certifications.emptyTitle}</h3>
            <p className="mt-2 max-w-md text-text2">{dict.certifications.emptyText}</p>
          </div>
        </Reveal>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <li key={cert.id}>
              <Reveal delay={index * 0.06} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-line2 bg-bg3 p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-text2">
                    {formatDate(cert.date, locale)}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold italic">{cert.title}</h3>
                  <p className="mt-1 text-text2">{cert.issuer}</p>
                  <div className="mt-auto flex flex-wrap gap-4 pt-5 font-mono text-xs uppercase tracking-[0.12em]">
                    {cert.verifyUrl ? (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold2"
                      >
                        {dict.certifications.verify}
                      </a>
                    ) : null}
                    {cert.pdfUrl ? (
                      <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold2">
                        {dict.certifications.viewPdf}
                      </a>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
