import type { Locale } from '@/content/locales'
import type { Project } from '@/content/projects'
import type { Dictionary } from '@/content/types'
import { SpecBlock, StatusPill, VisitLink } from '@/components/ProjectBits'

interface ProjectRowProps {
  readonly project: Project
  readonly locale: Locale
  readonly dict: Dictionary
}

/** Ligne de projet compacte pour /stage : nom, slogan, statut réel, pile, lien vers le vrai site. */
export default function ProjectRow({ project, locale, dict }: ProjectRowProps) {
  return (
    <article className="grid gap-5 rounded-md border border-line2 bg-bg3 p-5 md:grid-cols-[1.1fr_1fr] md:gap-8 md:p-6">
      <div>
        <StatusPill project={project} dict={dict} />
        <h3 className="mt-3 font-display text-xl font-semibold">{project.name[locale]}</h3>
        <p className="mt-1 text-[15px]">{project.tagline[locale]}</p>
        <p className="mt-2 text-sm text-text2">{project.result[locale]}</p>
        <div className="mt-3">
          <VisitLink project={project} locale={locale} dict={dict} />
        </div>
      </div>
      <div className="self-start">
        <SpecBlock project={project} locale={locale} />
      </div>
    </article>
  )
}
