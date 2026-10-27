import type { CSSProperties, ReactNode } from 'react'

interface RevealProps {
  readonly children: ReactNode
  readonly delay?: number
  readonly className?: string
  /** 'drop' : la carte se pose (légère descente avec un petit rebond). */
  readonly variant?: 'rise' | 'drop'
}

/**
 * Composant serveur : il ne pose que les attributs ; un seul RevealController (client) observe tous les
 * éléments `[data-reveal]` de la page et leur ajoute `data-shown`. Aucune hydratation par élément.
 */
export default function Reveal({ children, delay = 0, className, variant = 'rise' }: RevealProps) {
  const style: CSSProperties | undefined = delay > 0 ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined

  return (
    <div data-reveal={variant === 'drop' ? 'drop' : ''} className={className} style={style}>
      {children}
    </div>
  )
}
