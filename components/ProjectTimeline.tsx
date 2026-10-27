import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { Locale } from '@/content/locales'
import { projectsByDate } from '@/content/projects'
import type { Dictionary } from '@/content/types'
import CountUp from './CountUp'
import Reveal from './Reveal'

export function formatSince(since: string, locale: Locale): string {
  const [year, month] = since.split('-').map(Number)
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year ?? 2026, (month ?? 1) - 1, 1)),
  )
}

/**
 * En-tête vivant de la section : compteur de réalisations et frise « du plus ancien au plus récent ».
 * Chaque pastille porte le vrai symbole du projet et renvoie à sa carte ; le trait se dessine et les
 * pastilles entrent l'une après l'autre (transform et opacity), puis tout reste immobile.
 */
export default function ProjectTimeline({ locale, dict }: { readonly locale: Locale; readonly dict: Dictionary }) {
  return (
    <Reveal className="mb-10 md:mb-12">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="font-display text-6xl font-black not-italic leading-none text-gold md:text-7xl">
          <CountUp value={projectsByDate.length} />
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-text">{dict.projects.countLabel}</p>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-text2">· {dict.projects.timelineLabel}</p>
      </div>
      <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0">
        <ol className="tl-track relative flex min-w-max items-start justify-between gap-3 lg:min-w-0">
          <li aria-hidden="true" className="tl-line pointer-events-none absolute left-5 right-5 top-[22px] h-px bg-line2" />
          {projectsByDate.map((project, index) => (
            <li key={project.id} className="tl-item relative" style={{ '--i': index } as CSSProperties}>
              <a
                href={`#project-${project.id}`}
                className="group/tl flex min-h-11 w-16 flex-col items-center gap-1.5 rounded-lg text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <span className="tl-dot flex h-11 w-11 items-center justify-center rounded-xl border border-line2 bg-bg3 shadow-soft">
                  <Image
                    src={`/logos/${project.logo}/mark.svg`}
                    width={30}
                    height={30}
                    alt=""
                    unoptimized
                    className="block h-[30px] w-[30px]"
                  />
                </span>
                <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.08em] text-text2">
                  {formatSince(project.since, locale)}
                </span>
                <span className="sr-only">{project.name[locale]}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  )
}
