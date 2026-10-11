/**
 * Symbole animé de ValueChain Connect (dessin original, voir public/logos/valuechain/).
 * Deux maillons, celui du producteur et celui du transformateur, glissent l'un vers l'autre et s'emboîtent ;
 * un lot passe alors de l'un à l'autre à travers le point de rencontre.
 * L'état final est le logo. Les animations (globals.css, « Boucles des projets ») ne touchent que transform et opacity.
 */
export default function ValuechainMark({ className }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`rl-svg ${className ?? ''}`} focusable="false">
      <g className="rl-sym reel-anim">
        <g transform="rotate(-24 32 32)">
          <g className="vcc-l reel-anim">
            <rect x={6} y={22} width={32} height={20} rx={10} fill="none" stroke="#0b1530" strokeWidth={2.5} />
          </g>
          <g className="vcc-r reel-anim">
            <rect x={26} y={22} width={32} height={20} rx={10} fill="none" stroke="#6d3fc0" strokeWidth={2.5} />
          </g>
          <path className="vcc-l reel-anim" d="M29.74 22.15A10 10 0 0 1 34.02 24.01" fill="none" stroke="#0b1530" strokeWidth={2.5} strokeLinecap="round" />
          <path className="vcc-r reel-anim" d="M34.26 41.85A10 10 0 0 1 29.98 39.99" fill="none" stroke="#6d3fc0" strokeWidth={2.5} strokeLinecap="round" />
          <circle className="vcc-ring reel-anim" cx={32} cy={32} r={3.4} fill="none" stroke="#c8901f" strokeWidth={1.2} />
          <circle className="vcc-hub reel-anim" cx={32} cy={32} r={3.2} fill="#c8901f" />
          <circle className="vcc-bead reel-anim" cx={12} cy={32} r={2.6} fill="#e0a93a" />
        </g>
      </g>
    </svg>
  )
}
