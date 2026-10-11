/**
 * Symbole animé de FORGE Afrika (dessin original, voir public/logos/forge/).
 * Une enclume, un coup d'étincelle, puis un faisceau qui part vers huit points : les couleurs des autres projets ;
 * l'onde de la frappe les parcourt du centre vers les bords.
 * L'état final est le logo. Les animations (globals.css, « Boucles des projets ») ne touchent que transform et opacity.
 */
export default function ForgeMark({ className }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`rl-svg ${className ?? ''}`} focusable="false">
      <g className="rl-sym reel-anim">
        <g transform="rotate(-160 32 43.6)">
          <line className="frg-b0 reel-anim" x1={37.2} y1={43.6} x2={56.4} y2={43.6} stroke="#c8901f" strokeOpacity={0.85} strokeWidth={1.3} strokeLinecap="round" />
          <circle className="frg-d0 reel-anim" cx={61} cy={43.6} r={3.2} fill="#1d4ed8" />
        </g>
        <g transform="rotate(-140 32 43.6)">
          <line className="frg-b1 reel-anim" x1={37.2} y1={43.6} x2={56.4} y2={43.6} stroke="#c8901f" strokeOpacity={0.85} strokeWidth={1.3} strokeLinecap="round" />
          <circle className="frg-d1 reel-anim" cx={61} cy={43.6} r={3.2} fill="#0f766e" />
        </g>
        <g transform="rotate(-120 32 43.6)">
          <line className="frg-b2 reel-anim" x1={37.2} y1={43.6} x2={56.4} y2={43.6} stroke="#c8901f" strokeOpacity={0.85} strokeWidth={1.3} strokeLinecap="round" />
          <circle className="frg-d2 reel-anim" cx={61} cy={43.6} r={3.2} fill="#0f7a55" />
        </g>
        <g transform="rotate(-100 32 43.6)">
          <line className="frg-b3 reel-anim" x1={37.2} y1={43.6} x2={56.4} y2={43.6} stroke="#c8901f" strokeOpacity={0.85} strokeWidth={1.3} strokeLinecap="round" />
          <circle className="frg-d3 reel-anim" cx={61} cy={43.6} r={3.2} fill="#c2410c" />
        </g>
        <g transform="rotate(-80 32 43.6)">
          <line className="frg-b4 reel-anim" x1={37.2} y1={43.6} x2={56.4} y2={43.6} stroke="#c8901f" strokeOpacity={0.85} strokeWidth={1.3} strokeLinecap="round" />
          <circle className="frg-d4 reel-anim" cx={61} cy={43.6} r={3.2} fill="#b0215a" />
        </g>
        <g transform="rotate(-60 32 43.6)">
          <line className="frg-b5 reel-anim" x1={37.2} y1={43.6} x2={56.4} y2={43.6} stroke="#c8901f" strokeOpacity={0.85} strokeWidth={1.3} strokeLinecap="round" />
          <circle className="frg-d5 reel-anim" cx={61} cy={43.6} r={3.2} fill="#6d3fc0" />
        </g>
        <g transform="rotate(-40 32 43.6)">
          <line className="frg-b6 reel-anim" x1={37.2} y1={43.6} x2={56.4} y2={43.6} stroke="#c8901f" strokeOpacity={0.85} strokeWidth={1.3} strokeLinecap="round" />
          <circle className="frg-d6 reel-anim" cx={61} cy={43.6} r={3.2} fill="#4d7c0f" />
        </g>
        <g transform="rotate(-20 32 43.6)">
          <line className="frg-b7 reel-anim" x1={37.2} y1={43.6} x2={56.4} y2={43.6} stroke="#c8901f" strokeOpacity={0.85} strokeWidth={1.3} strokeLinecap="round" />
          <circle className="frg-d7 reel-anim" cx={61} cy={43.6} r={3.2} fill="#a15c0b" />
        </g>
        <path className="frg-anvil reel-anim" d="M6 46H47V50H41Q40.5 52.8 36.5 53.2V57H42V60.5H22V57H27.5V53.2Q23.5 52.8 22.8 50H19Q12 49.6 6 46Z" fill="#0b1530" stroke="#0b1530" strokeWidth={1} strokeLinejoin="round" />
        <circle className="frg-ring reel-anim" cx={32} cy={43.6} r={5.4} fill="none" stroke="#c8901f" strokeWidth={1.2} />
        <circle className="frg-spark reel-anim" cx={32} cy={43.6} r={3.2} fill="#c8901f" />
      </g>
    </svg>
  )
}
