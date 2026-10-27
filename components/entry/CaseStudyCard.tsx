import { entry, type CaseStudy } from '@/content/entry'
import type { Locale } from '@/content/locales'
import { projectById } from '@/content/projects'
import type { Dictionary } from '@/content/types'
import { SpecBlock, StatusPill, VisitLink } from '@/components/ProjectBits'

interface CaseStudyCardProps {
  readonly study: CaseStudy
  readonly locale: Locale
  readonly dict: Dictionary
}

function Label({ children }: { readonly children: string }) {
  return <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">{children}</p>
}

/** Étude de cas : problème, choix techniques, preuves. Nom, pile, statut et lien viennent de content/projects.ts. */
export default function CaseStudyCard({ study, locale, dict }: CaseStudyCardProps) {
  const project = projectById(study.id)
  const common = entry[locale].common
  const text = study.texts[locale]
  return (
    <article className="rounded-md border border-line2 bg-bg3">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line2 bg-bg2 px-5 py-3">
        <h3 className="font-display text-xl font-semibold">{project.name[locale]}</h3>
        <StatusPill project={project} dict={dict} />
      </header>
      <div className="grid gap-6 p-5 md:grid-cols-[1fr_1.15fr_1fr] md:gap-8 md:p-6">
        <div>
          <Label>{common.problem}</Label>
          <p className="mt-2 text-[15px]">{text.problem}</p>
        </div>
        <div>
          <Label>{common.choice}</Label>
          <p className="mt-2 text-[15px] text-text2">{text.choice}</p>
          <SpecBlock project={project} locale={locale} />
        </div>
        <div>
          <Label>{common.proof}</Label>
          <ul className="mt-2 space-y-2 text-[15px]">
            {text.proofs.map((proof) => (
              <li key={proof} className="flex gap-2">
                <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-accent" />
                <span>{proof}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <VisitLink project={project} locale={locale} dict={dict} />
          </div>
        </div>
      </div>
    </article>
  )
}
