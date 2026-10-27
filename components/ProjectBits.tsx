import type { Locale } from '@/content/locales'
import { entry } from '@/content/entry'
import type { Project, ProjectStatus } from '@/content/projects'
import type { Dictionary } from '@/content/types'

const statusDot: Readonly<Record<ProjectStatus, string>> = {
  running: 'bg-green',
  live: 'bg-green',
  dev: 'bg-warn',
  proto: 'bg-accent',
}

export function StatusPill({ project, dict }: { readonly project: Project; readonly dict: Dictionary }) {
  return (
    <p className="inline-flex w-fit items-center gap-2 rounded-sm border border-line2 bg-bg px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text">
      <span aria-hidden="true" className={`h-2 w-2 shrink-0 ${statusDot[project.status]}`} />
      {dict.projects.statuses[project.status]}
    </p>
  )
}

export function VisitLink({
  project,
  locale,
  dict,
}: {
  readonly project: Project
  readonly locale: Locale
  readonly dict: Dictionary
}) {
  if (!project.href) {
    return <span className="font-mono text-xs uppercase tracking-[0.14em] text-text2">{dict.projects.noPublicLink}</span>
  }
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent underline decoration-accent decoration-1 underline-offset-[6px] transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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

/** Fiche technique à la manière d'un cartouche : SPEC (pile) et, quand il est vérifié, le nombre de tests. */
export function SpecBlock({ project, locale }: { readonly project: Project; readonly locale: Locale }) {
  const common = entry[locale].common
  return (
    <div className="mt-4 rounded-sm border border-line2">
      <div className="flex items-center justify-between border-b border-line2 bg-bg2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-text2">
        <span>{common.spec}</span>
        {project.tests ? (
          <span className="text-accent">
            {project.tests} {common.testsLabel}
          </span>
        ) : null}
      </div>
      <ul className="flex flex-wrap gap-1.5 p-2.5">
        {project.stack.map((tech) => (
          <li key={tech} className="rounded-sm border border-line2 bg-bg px-2 py-0.5 font-mono text-[10.5px] text-text">
            {tech}
          </li>
        ))}
      </ul>
    </div>
  )
}
