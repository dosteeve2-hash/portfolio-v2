import type { Locale } from '@/content/locales'
import { projects } from '@/content/projects'
import type { Dictionary } from '@/content/types'
import Reveal from './Reveal'
import Section from './Section'

export default function Projects({ locale, dict }: { readonly locale: Locale; readonly dict: Dictionary }) {
  return (
    <Section id="projects" index={4} label={dict.nav.projects} title={dict.projects.title} intro={dict.projects.intro}>
      <ul className="grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.id} className={project.featured ? 'md:col-span-2' : undefined}>
            <Reveal delay={index * 0.08} className="h-full">
              <article
                className={`group flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 md:p-8 ${
                  project.featured
                    ? 'border-gold/50 bg-gradient-to-br from-bg3 to-bg2 shadow-[0_0_40px_-12px_rgba(240,168,50,0.35)]'
                    : 'border-line2 bg-bg3 hover:border-gold/40'
                }`}
              >
                {project.featured ? (
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                    {dict.projects.featured}
                  </p>
                ) : null}
                <h3 className="font-display text-2xl font-bold italic md:text-3xl">{project.name[locale]}</h3>
                <p className="mt-3 max-w-3xl text-text2">{project.result[locale]}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-lg border border-line2 bg-bg px-2.5 py-1 font-mono text-[11px] text-text2"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-1">
                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-gold transition-colors hover:text-gold2"
                    >
                      {dict.projects.visit}
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                      <span className="sr-only">({project.href})</span>
                    </a>
                  ) : (
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-text2">
                      {dict.projects.noPublicLink}
                    </span>
                  )}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
