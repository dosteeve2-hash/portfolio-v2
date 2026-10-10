import type { Locale } from '@/content/locales'
import type { Project } from '@/content/projects'

interface ProjectReelProps {
  readonly project: Project
  readonly locale: Locale
  readonly index: number
  readonly large?: boolean
  /** Variante sombre (les deux projets phares) ou claire. */
  readonly dark?: boolean
}

const angles = [135, 150, 120, 165, 110, 140, 125, 155, 130] as const

const darkBackground = (angle: number): string => `linear-gradient(${angle}deg, #0b1f4d 0%, #10306f 58%, #1a4aa8 130%)`
const lightBackground = (angle: number): string => `linear-gradient(${angle}deg, #f6f8fd 0%, #e8eefb 60%, #d6e2f9 130%)`

/**
 * Emplacement du visuel animé de chaque projet. Pour l'instant : un visuel statique aux couleurs
 * de la charte (nom, slogan, pile). La boucle animée remplacera le contenu, pas l'emplacement.
 * Décoratif : le texte accessible est porté par la carte (titre masqué, résumé, état).
 */
export default function ProjectReel({ project, locale, index, large = false, dark = false }: ProjectReelProps) {
  const angle = angles[index % angles.length] ?? 135
  const gridColor = dark ? '#ffffff' : '#1d4ed8'
  return (
    <div
      aria-hidden="true"
      data-project-reel={project.id}
      className={`relative flex h-full flex-col justify-between gap-8 overflow-hidden p-6 md:p-8 ${
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
        className="pointer-events-none absolute -right-8 -top-8 h-52 w-52 rounded-full"
        style={{
          backgroundImage: dark
            ? 'radial-gradient(circle, rgba(96,150,255,0.32), transparent 68%)'
            : 'radial-gradient(circle, rgba(29,78,216,0.12), transparent 68%)',
        }}
      />

      <p className="relative font-display text-xl font-black not-italic text-gold">{String(index + 1).padStart(2, '0')}</p>

      <div className="relative">
        <p
          className={`font-display font-bold italic leading-tight ${large ? 'text-4xl md:text-5xl' : 'text-3xl'} ${
            dark ? '' : 'text-navy'
          }`}
        >
          {project.name[locale]}
        </p>
        <span className="mt-3 block h-[2px] w-14 rounded-full bg-gradient-to-r from-spark to-transparent" />
        <p className={`mt-3 max-w-md text-sm leading-relaxed md:text-base ${dark ? 'text-text2' : 'text-text2'}`}>
          {project.tagline[locale]}
        </p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
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
      </div>
    </div>
  )
}
