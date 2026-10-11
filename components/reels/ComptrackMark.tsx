/**
 * Symbole animé de CompTrack (dessin original, voir public/logos/comptrack/).
 * Deux colonnes de blocs, débit et crédit : la colonne de droite manque d'un bloc, il tombe,
 * les deux colonnes s'égalent et la ligne de total se double. L'état final est le logo.
 * Les animations (globals.css, « Boucles des projets ») ne touchent que transform et opacity.
 */
const ink = '#0b1530'
const green = '#0f7a55'
const rule = '#c8901f'

const left = [
  { key: 'l1', y: 36.4 },
  { key: 'l2', y: 24.8 },
  { key: 'l3', y: 13.2 },
] as const

export default function ComptrackMark({ className }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`rl-svg ${className ?? ''}`} focusable="false">
      <g className="rl-sym reel-anim">
        <line
          className="cpt-guide reel-anim"
          x1={6}
          y1={10}
          x2={58}
          y2={10}
          stroke={ink}
          strokeOpacity={0.55}
          strokeWidth={1.2}
          strokeDasharray="2 3"
          strokeLinecap="round"
        />
        {left.map((b) => (
          <rect key={b.key} className={`cpt-${b.key} cpt-blk reel-anim`} x={10} y={b.y} width={20} height={9.6} rx={2} fill={ink} />
        ))}
        <rect className="cpt-r1 cpt-blk reel-anim" x={34} y={25.2} width={20} height={20.8} rx={2} fill={green} />
        <rect className="cpt-r2 cpt-blk reel-anim" x={34} y={13.2} width={20} height={10} rx={2} fill={green} />
        <line className="cpt-rule1 cpt-rule reel-anim" x1={6} y1={50.5} x2={58} y2={50.5} stroke={rule} strokeWidth={1.7} strokeLinecap="round" />
        <line className="cpt-rule2 cpt-rule reel-anim" x1={6} y1={55} x2={58} y2={55} stroke={rule} strokeWidth={1.7} strokeLinecap="round" />
      </g>
    </svg>
  )
}
