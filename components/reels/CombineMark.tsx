/**
 * Symbole animé de COMBINE (dessin original, voir public/logos/combine/).
 * Deux courbes (le porteur de projet, l'incubateur ou le financeur) se rejoignent en un point doré,
 * puis une seule ligne part vers le financement. Les animations (globals.css, « Boucles des projets »)
 * ne touchent que transform et opacity ; l'état final est le logo.
 */
const gold = '#f7c060'
const teal = '#5eead4'

export default function CombineMark({ className }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`rl-svg ${className ?? ''}`} focusable="false">
      <g className="rl-sym reel-anim">
        <path className="cmb-curve-a reel-anim" d="M6 48C22 48 28 32 42 32" fill="none" stroke={teal} strokeWidth={1.7} strokeLinecap="round" />
        <path
          className="cmb-curve-b reel-anim"
          d="M6 16C22 16 28 32 42 32"
          fill="none"
          stroke="#fbfaf7"
          strokeOpacity={0.8}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
        <line className="cmb-trunk reel-anim" x1={42} y1={32} x2={54.6} y2={32} stroke={gold} strokeWidth={1.7} strokeLinecap="round" />
        <circle className="cmb-dot-a reel-anim" cx={6} cy={48} r={3.2} fill={teal} />
        <circle className="cmb-dot-b reel-anim" cx={6} cy={16} r={3.2} fill="#fbfaf7" fillOpacity={0.8} />
        <circle className="cmb-end-ring reel-anim" cx={58} cy={32} r={3.4} fill="none" stroke={gold} strokeWidth={1.4} />
        <circle className="cmb-fill reel-anim" cx={58} cy={32} r={1.8} fill={gold} />
        <circle className="cmb-pulse reel-anim" cx={42} cy={32} r={5.4} fill="none" stroke={gold} strokeWidth={1.2} />
        <circle className="cmb-meet reel-anim" cx={42} cy={32} r={5.4} fill={gold} />
        <circle className="cmb-bead-a reel-anim" cx={6} cy={48} r={2.4} fill="#c9fff4" />
        <circle className="cmb-bead-b reel-anim" cx={6} cy={16} r={2.4} fill="#ffffff" />
        <circle className="cmb-gold reel-anim" cx={42} cy={32} r={2.6} fill="#fff1c9" />
      </g>
    </svg>
  )
}
