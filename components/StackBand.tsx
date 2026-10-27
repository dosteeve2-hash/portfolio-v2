import type { Locale } from '@/content/locales'
import { projects } from '@/content/projects'
import { waouh } from '@/content/waouh'
import Marquee from '@/kit/components/Marquee'

// Pile relevée dans les package.json des dépôts (content/projects.ts) : aucun nom ajouté à la main.
const STACK: readonly string[] = [...new Set(projects.flatMap((project) => project.stack))]

/** Bandeau défilant de la pile technique réellement utilisée ; en mouvement réduit, les étiquettes restent à plat. */
export default function StackBand({ locale }: { readonly locale: Locale }) {
  return (
    <section aria-label={waouh[locale].stackLabel} className="border-y border-line2 bg-bg3/70 py-4">
      <Marquee speed={34} gap={12}>
        {STACK.map((name) => (
          <span
            key={name}
            className="rounded-sm border border-line2 bg-bg px-3 py-1 font-mono text-[12px] text-text"
          >
            {name}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
