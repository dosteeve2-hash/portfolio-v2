import Image from 'next/image'
import type { Locale } from '@/content/locales'
import type { Project } from '@/content/projects'
import OrchestratorMark from './reels/OrchestratorMark'
import ReelPlayer from './reels/ReelPlayer'

interface ProjectReelProps {
  readonly project: Project
  readonly locale: Locale
  readonly index: number
  readonly large?: boolean
  /** Variante sombre (les deux cartes sans site public) ou claire. */
  readonly dark?: boolean
}

const angles = [135, 150, 120, 165, 110, 140, 125, 155, 130] as const

const darkBackground = (angle: number): string => `linear-gradient(${angle}deg, #0b1f4d 0%, #10306f 58%, #1a4aa8 130%)`
const lightBackground = (angle: number): string => `linear-gradient(${angle}deg, #f6f8fd 0%, #e8eefb 60%, #d6e2f9 130%)`

function StackChips({ stack, dark }: { readonly stack: readonly string[]; readonly dark: boolean }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-1.5">
      {stack.map((tech) => (
        <li
          key={tech}
          className={`rounded-md border px-2 py-0.5 font-mono text-[10.5px] ${
            dark ? 'border-white/20 bg-white/5 text-text' : 'border-line2 bg-white/80 text-text'
          }`}
        >
          {tech}
        </li>
      ))}
    </ul>
  )
}

/**
 * Boucle animée du banc d'orchestration IA (6 s) : le symbole se construit, le nom et le slogan
 * entrent, puis un agent s'éteint et les autres se rééquilibrent. Pause hors écran (ReelPlayer).
 */
function OrchestratorReel({ project, locale, index }: Omit<ProjectReelProps, 'large' | 'dark'>) {
  const angle = angles[index % angles.length] ?? 135
  return (
    <ReelPlayer
      id={project.id}
      className="theme-navy relative flex h-full min-h-72 flex-col justify-between gap-6 overflow-hidden bg-bg p-6 text-text md:min-h-[22rem] md:p-8"
      style={{ backgroundImage: darkBackground(angle) }}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <span
        className="pointer-events-none absolute -right-6 -top-6 h-56 w-56 rounded-full md:h-72 md:w-72"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(96,150,255,0.30), transparent 66%)' }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <p className="font-display text-xl font-semibold not-italic text-gold2">{String(index + 1).padStart(2, '0')}</p>
        <OrchestratorMark className="-mr-2 -mt-2 h-28 w-28 shrink-0 md:-mr-3 md:-mt-3 md:h-44 md:w-44" />
      </div>

      <div className="relative">
        <div className="orch-text reel-anim">
          <div className="-mb-[0.15em] overflow-hidden pb-[0.15em] pr-[0.2em]">
            <p className="orch-name reel-anim font-display text-4xl font-semibold leading-tight md:text-5xl">
              {project.name[locale]}
            </p>
          </div>
          <span className="orch-rule reel-anim mt-3 block h-[2px] w-14 rounded-full bg-gradient-to-r from-spark to-transparent" />
          <p className="orch-tagline reel-anim mt-3 max-w-md text-sm leading-relaxed text-text2 md:text-base">
            {project.tagline[locale]}
          </p>
        </div>
        <StackChips stack={project.stack} dark />
      </div>
    </ReelPlayer>
  )
}

/**
 * Carte d'un projet sans site public (COMBINE) : le symbole validé sur une scène aux couleurs du projet,
 * nom et slogan qui entrent à la même cadence que le banc. Pause hors écran (ReelPlayer).
 */
function MarkReel({ project, locale, index, large = false, dark = false }: ProjectReelProps) {
  const angle = angles[index % angles.length] ?? 135
  const gridColor = dark ? '#ffffff' : '#1d4ed8'
  return (
    <ReelPlayer
      id={project.id}
      className={`relative flex h-full flex-col justify-between gap-6 overflow-hidden p-6 md:p-8 ${
        dark ? 'theme-navy bg-bg text-text' : 'text-text'
      } ${large ? 'min-h-72 md:min-h-[22rem]' : 'min-h-56'}`}
      style={{ backgroundImage: dark ? darkBackground(angle) : lightBackground(angle) }}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <span
        className="pointer-events-none absolute -right-6 -top-6 h-56 w-56 rounded-full md:h-72 md:w-72"
        style={{
          backgroundImage: `radial-gradient(circle, ${project.accent}55, transparent 66%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <p className="font-display text-xl font-semibold not-italic text-gold2">{String(index + 1).padStart(2, '0')}</p>
        <span className="-mr-1 -mt-1 flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white p-4 shadow-lift md:h-36 md:w-36 md:p-6">
          <Image
            src={`/logos/${project.logo}/mark.svg`}
            width={96}
            height={96}
            alt=""
            unoptimized
            className="block h-full w-full"
          />
        </span>
      </div>

      <div className="relative">
        <div className="rl-text reel-anim">
          <div className="-mb-[0.15em] overflow-hidden pb-[0.15em] pr-[0.2em]">
            <p
              className={`rl-name reel-anim font-display font-semibold leading-tight ${
                large ? 'text-4xl md:text-5xl' : 'text-3xl'
              } ${dark ? '' : 'text-navy'}`}
            >
              {project.name[locale]}
            </p>
          </div>
          <span className="rl-rule reel-anim mt-3 block h-[2px] w-14 rounded-full bg-gradient-to-r from-spark to-transparent" />
          <p className="rl-tagline reel-anim mt-3 max-w-md text-sm leading-relaxed text-text2 md:text-base">
            {project.tagline[locale]}
          </p>
        </div>
        <StackChips stack={project.stack} dark={dark} />
      </div>
    </ReelPlayer>
  )
}

/**
 * Emplacement du visuel animé des projets sans site public à filmer (banc d'orchestration, COMBINE).
 * Décoratif : le texte accessible est porté par la carte (titre masqué, résumé, état).
 */
export default function ProjectReel({ project, locale, index, large = false, dark = false }: ProjectReelProps) {
  if (project.id === 'orchestrator') return <OrchestratorReel project={project} locale={locale} index={index} />
  return <MarkReel project={project} locale={locale} index={index} large={large} dark={dark} />
}
