/**
 * Symbole animé de UEEMT-Tokat (dessin original, voir public/logos/ueemt/).
 * Des membres en cercle, reliés à leurs voisins ; une place reste ouverte, un nouveau membre arrive,
 * le cercle se referme et l'accueil se propage de proche en proche. L'état final est le logo.
 * Les animations (globals.css, « Boucles des projets ») ne touchent que transform et opacity.
 */
const ink = '#0b1530'
const accent = '#c2410c'
const radii = [3.8, 4.6, 3.3, 4.0, 3.5, 3.9, 3.3, 4.0] as const
const edges = [
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 0],
  [0, 1],
  [1, 2],
] as const

function pos(k: number): { readonly x: number; readonly y: number } {
  const angle = ((-90 + 45 * k) * Math.PI) / 180
  return { x: 32 + 20 * Math.cos(angle), y: 32 + 20 * Math.sin(angle) }
}

const round = (v: number): number => Math.round(v * 100) / 100

export default function UeemtMark({ className }: { readonly className?: string }) {
  const seat = pos(1)
  return (
    <svg viewBox="0 0 64 64" className={`rl-svg ${className ?? ''}`} focusable="false">
      <g className="rl-sym reel-anim">
        {edges.map(([a, b]) => {
          const p = pos(a)
          const q = pos(b)
          return (
            <line
              key={`${a}${b}`}
              className={`uem-e${a}${b} uem-fade reel-anim`}
              x1={round(p.x)}
              y1={round(p.y)}
              x2={round(q.x)}
              y2={round(q.y)}
              stroke={ink}
              strokeOpacity={0.38}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          )
        })}
        <circle
          className="uem-socket reel-anim"
          cx={round(seat.x)}
          cy={round(seat.y)}
          r={6}
          fill="none"
          stroke={ink}
          strokeOpacity={0.55}
          strokeWidth={1.1}
          strokeDasharray="2 2"
        />
        {radii.map((r, k) => {
          if (k === 1) return null
          const p = pos(k)
          return <circle key={k} className={`uem-d${k} uem-dot reel-anim`} cx={round(p.x)} cy={round(p.y)} r={r} fill={ink} />
        })}
        <circle className="uem-ripple uem-dot reel-anim" cx={round(seat.x)} cy={round(seat.y)} r={4.6} fill="none" stroke={accent} strokeWidth={1.2} />
        <circle className="uem-new uem-dot reel-anim" cx={round(seat.x)} cy={round(seat.y)} r={4.6} fill={accent} />
      </g>
    </svg>
  )
}
