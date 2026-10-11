/**
 * Symbole animé de MIFA Life Shop (dessin original, voir public/logos/mifa/).
 * Un panier d'osier ; des produits tombent dedans, le panier amortit chaque arrivée puis se soulève, prêt à partir.
 * L'état final est le logo. Les animations (globals.css, « Boucles des projets ») ne touchent que transform et opacity.
 */
export default function MifaMark({ className }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`rl-svg ${className ?? ''}`} focusable="false">
      <g className="rl-sym reel-anim">
        <path className="mif-handle reel-anim" d="M15 30C15 -3 49 -3 49 30" fill="none" stroke="#0b1530" strokeWidth={1.8} strokeLinecap="round" />
        <circle className="mif-f1 reel-anim" cx={23} cy={26.5} r={5.2} fill="#c8901f" />
        <circle className="mif-f2 reel-anim" cx={32} cy={22.5} r={5.8} fill="#0b1530" fillOpacity={0.88} />
        <circle className="mif-f3 reel-anim" cx={41} cy={26.5} r={5.2} fill="#c8901f" />
        <g className="mif-body reel-anim">
          <path d="M11 30H53L47 54Q46.6 56 44.6 56H19.4Q17.4 56 17 54Z" fill="#b0215a" stroke="#b0215a" strokeWidth={1.2} strokeLinejoin="round" />
          <rect x={9} y={28.2} width={46} height={4.6} rx={2.3} fill="#b0215a" />
          <line x1={14.6} y1={38} x2={49.4} y2={38} stroke="#fbfaf7" strokeOpacity={0.7} strokeWidth={1.3} strokeLinecap="round" />
          <line x1={16.6} y1={46} x2={47.4} y2={46} stroke="#fbfaf7" strokeOpacity={0.7} strokeWidth={1.3} strokeLinecap="round" />
        </g>
        <circle className="mif-ring reel-anim" cx={32} cy={30.5} r={6} fill="none" stroke="#b0215a" strokeWidth={1.2} />
      </g>
    </svg>
  )
}
