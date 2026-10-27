import type { CSSProperties } from 'react'
import type { Locale } from '@/content/locales'
import { projects, type Project, type ProjectStatus } from '@/content/projects'
import type { Dictionary } from '@/content/types'
import ProjectMedia from './ProjectMedia'
import ProjectReel from './ProjectReel'
import ProjectTimeline, { formatSince } from './ProjectTimeline'
import Reveal from './Reveal'
import Section from './Section'

const statusDot: Readonly<Record<ProjectStatus, string>> = {
  running: 'bg-green',
  live: 'bg-green',
  dev: 'bg-spark',
  proto: 'bg-accent',
}

interface CardProps {
  readonly project: Project
  readonly index: number
  readonly locale: Locale
  readonly dict: Dictionary
}

function StatusPill({ project, dict }: { readonly project: Project; readonly dict: Dictionary }) {
  return (
    <p className="inline-flex w-fit items-center gap-2 rounded-full bg-bg2 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text">
      <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${statusDot[project.status]}`} />
      {dict.projects.statuses[project.status]}
    </p>
  )
}

function VisitLink({ project, locale, dict }: Omit<CardProps, 'index'>) {
  if (!project.href) {
    return <span className="font-mono text-xs uppercase tracking-[0.14em] text-text2">{dict.projects.noPublicLink}</span>
  }
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent underline decoration-gold decoration-2 underline-offset-[6px] transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {dict.projects.visit}
      <span aria-hidden="true" className="transition-transform group-hover/link:translate-x-1">
        →
      </span>
      <span className="sr-only">
        {project.name[locale]} ({project.href})
      </span>
    </a>
  )
}

/** Carte à visuel vivant : capture du vrai site, médaillon mobile, logo, texte visible. */
function CaptureCard({ project, locale, dict }: Omit<CardProps, 'index'>) {
  if (!project.capture) return null
  return (
    <article
      className="proj-card flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg3 shadow-soft"
      style={{ '--pc': project.accent } as CSSProperties}
    >
      <ProjectMedia
        capture={project.capture}
        logo={project.logo}
        alt={dict.projects.previewAlt.replace('{name}', project.name[locale])}
        since={formatSince(project.since, locale)}
      />
      <div className="flex flex-1 flex-col p-6 pt-5 md:p-7 md:pt-5">
        <StatusPill project={project} dict={dict} />
        <h3 className="mt-3 font-display text-2xl font-bold italic leading-tight text-navy md:text-[1.7rem]">
          {project.name[locale]}
        </h3>
        <p className="mt-1 text-[15px] font-normal text-text">{project.tagline[locale]}</p>
        <p className="mt-3 text-sm text-text2">{project.result[locale]}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-md border border-line2 bg-bg px-2 py-0.5 font-mono text-[10.5px] text-text">
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <VisitLink project={project} locale={locale} dict={dict} />
        </div>
      </div>
    </article>
  )
}

/** Carte sans site public à filmer : boucle animée aux couleurs du projet (banc d'orchestration, COMBINE). */
function ReelCard({ project, index, locale, dict }: CardProps) {
  const wide = Boolean(project.featured) || project.id === 'combine'
  const layout = project.featured ? 'md:grid md:grid-cols-[1.15fr_1fr]' : wide ? 'lg:grid lg:grid-cols-[1.15fr_1fr]' : ''
  return (
    <article className={`flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg3 shadow-soft ${layout}`}>
      <ProjectReel project={project} locale={locale} index={index} large={wide} dark={wide} />
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="sr-only">{project.name[locale]}</h3>
        {project.featured ? (
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{dict.projects.featured}</p>
        ) : null}
        <StatusPill project={project} dict={dict} />
        <p className="mt-4 text-text2">{project.result[locale]}</p>
        <p className="sr-only">{project.stack.join(', ')}</p>
        <div className="mt-auto pt-6">
          <VisitLink project={project} locale={locale} dict={dict} />
        </div>
      </div>
    </article>
  )
}

function spanClass(project: Project, index: number): string {
  if (project.featured) return 'md:col-span-2 lg:col-span-6'
  if (project.id === 'combine') return 'md:col-span-2 lg:col-span-4'
  // Les quatre dernières cartes forment deux rangées de deux ; la toute dernière occupe la rangée entière en deux colonnes.
  if (index === projects.length - 1) return 'md:col-span-2 lg:col-span-3'
  if (index >= projects.length - 4) return 'lg:col-span-3'
  return 'lg:col-span-2'
}

export default function Projects({ locale, dict }: { readonly locale: Locale; readonly dict: Dictionary }) {
  return (
    <Section id="projects" index={4} label={dict.nav.projects} title={dict.projects.title} intro={dict.projects.intro}>
      <ProjectTimeline locale={locale} dict={dict} />
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
        {projects.map((project, index) => (
          <li key={project.id} id={`project-${project.id}`} className={`scroll-mt-24 ${spanClass(project, index)}`}>
            <Reveal delay={(index % 3) * 0.08} className="lift h-full">
              {project.capture ? (
                <CaptureCard project={project} locale={locale} dict={dict} />
              ) : (
                <ReelCard project={project} index={index} locale={locale} dict={dict} />
              )}
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
