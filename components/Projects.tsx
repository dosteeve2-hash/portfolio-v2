import type { CSSProperties } from 'react'
import type { Locale } from '@/content/locales'
import { projects, type Project } from '@/content/projects'
import type { Dictionary } from '@/content/types'
import TiltCard from '@/kit/components/TiltCard'
import ProjectMedia from './ProjectMedia'
import { SpecBlock, StatusPill, VisitLink } from './ProjectBits'
import ProjectReel from './ProjectReel'
import ProjectsScene from './ProjectsScene'
import ProjectTimeline, { formatSince } from './ProjectTimeline'
import Reveal from './Reveal'
import Section from './Section'

interface CardProps {
  readonly project: Project
  readonly index: number
  readonly locale: Locale
  readonly dict: Dictionary
}

/** Carte à visuel vivant : capture du vrai site, médaillon mobile, logo, texte visible. */
function CaptureCard({ project, locale, dict }: Omit<CardProps, 'index'>) {
  if (!project.capture) return null
  return (
    <article
      className="proj-card flex h-full flex-col overflow-hidden rounded-md border border-line bg-bg3 shadow-soft"
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
        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-navy md:text-[1.7rem]">
          {project.name[locale]}
        </h3>
        <p className="mt-1 text-[15px] font-normal text-text">{project.tagline[locale]}</p>
        <p className="mt-3 text-sm text-text2">{project.result[locale]}</p>
        <SpecBlock project={project} locale={locale} />
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
    <article className={`flex h-full flex-col overflow-hidden rounded-md border border-line bg-bg3 shadow-soft ${layout}`}>
      <ProjectReel project={project} locale={locale} index={index} large={wide} dark={wide} />
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="sr-only">{project.name[locale]}</h3>
        {project.featured ? (
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{dict.projects.featured}</p>
        ) : null}
        <StatusPill project={project} dict={dict} />
        <p className="mt-4 text-text2">{project.result[locale]}</p>
        <SpecBlock project={project} locale={locale} />
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
    <Section
      id="projects"
      index={4}
      label={dict.nav.projects}
      title={dict.projects.title}
      intro={dict.projects.intro}
      bleed={<ProjectsScene locale={locale} />}
    >
      <ProjectTimeline locale={locale} dict={dict} />
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
        {projects.map((project, index) => (
          <li key={project.id} id={`project-${project.id}`} className={`scroll-mt-24 ${spanClass(project, index)}`}>
            <Reveal delay={(index % 3) * 0.08} className="lift h-full">
              <TiltCard className="h-full" max={5} glareColor="rgba(31,79,216,0.07)">
                {project.capture ? (
                  <CaptureCard project={project} locale={locale} dict={dict} />
                ) : (
                  <ReelCard project={project} index={index} locale={locale} dict={dict} />
                )}
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
