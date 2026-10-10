import type { Locale } from '@/content/locales'
import { projects, type Project, type ProjectStatus } from '@/content/projects'
import type { Dictionary } from '@/content/types'
import ProjectReel from './ProjectReel'
import Reveal from './Reveal'
import Section from './Section'

const statusDot: Readonly<Record<ProjectStatus, string>> = {
  running: 'bg-green',
  live: 'bg-green',
  dev: 'bg-spark',
  proto: 'bg-accent',
  hub: 'bg-gold',
}

interface CardProps {
  readonly project: Project
  readonly index: number
  readonly locale: Locale
  readonly dict: Dictionary
}

function ProjectBody({ project, locale, dict }: Omit<CardProps, 'index'>) {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-7">
      <h3 className="sr-only">{project.name[locale]}</h3>
      {project.featured ? (
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{dict.projects.featured}</p>
      ) : null}
      <p className="inline-flex w-fit items-center gap-2 rounded-full bg-bg2 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text">
        <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${statusDot[project.status]}`} />
        {dict.projects.statuses[project.status]}
      </p>
      <p className="mt-4 text-text2">{project.result[locale]}</p>
      <p className="sr-only">{project.stack.join(', ')}</p>
      <div className="mt-auto pt-6">
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex min-h-10 items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent underline decoration-gold decoration-2 underline-offset-[6px] transition-colors hover:text-navy"
          >
            {dict.projects.visit}
            <span aria-hidden="true" className="transition-transform group-hover/link:translate-x-1">
              →
            </span>
            <span className="sr-only">
              {project.name[locale]} ({project.href})
            </span>
          </a>
        ) : (
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-text2">{dict.projects.noPublicLink}</span>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project, index, locale, dict }: CardProps) {
  const featured = Boolean(project.featured)
  const wide = featured || project.id === 'combine'
  const layout = featured ? 'md:grid md:grid-cols-[1.15fr_1fr]' : wide ? 'lg:grid lg:grid-cols-[1.15fr_1fr]' : ''
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg3 shadow-soft ${layout}`}
    >
      <ProjectReel project={project} locale={locale} index={index} large={wide} dark={wide} />
      <ProjectBody project={project} locale={locale} dict={dict} />
    </article>
  )
}

export default function Projects({ locale, dict }: { readonly locale: Locale; readonly dict: Dictionary }) {
  return (
    <Section id="projects" index={4} label={dict.nav.projects} title={dict.projects.title} intro={dict.projects.intro}>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const span = project.featured ? 'md:col-span-2 lg:col-span-3' : project.id === 'combine' ? 'lg:col-span-2' : ''
          return (
            <li key={project.id} className={span}>
              <Reveal delay={(index % 3) * 0.08} className="lift h-full">
                <ProjectCard project={project} index={index} locale={locale} dict={dict} />
              </Reveal>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
