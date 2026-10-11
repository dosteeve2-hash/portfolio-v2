/**
 * Symbole animé de SUGU (dessin original, voir public/logos/sugu/).
 * Un cahier de comptes à spirale se remplit de lignes ; une pièce y tombe et une nouvelle ligne s'écrit.
 * L'état final est le logo. Les animations (globals.css, « Boucles des projets ») ne touchent que transform et opacity.
 */
export default function SuguMark({ className }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`rl-svg ${className ?? ''}`} focusable="false">
      <g className="rl-sym reel-anim">
        <g className="sgu-book reel-anim">
          <rect x={8} y={7} width={34} height={46} rx={4} fill="#ffffff" fillOpacity={0.7} stroke="#0b1530" strokeWidth={1.8} />
          <line className="sgu-l0 reel-anim" x1={17} y1={19} x2={35} y2={19} stroke="#0b1530" strokeOpacity={0.35} strokeWidth={1.6} strokeLinecap="round" />
          <line className="sgu-l1 reel-anim" x1={17} y1={27} x2={35} y2={27} stroke="#0b1530" strokeOpacity={0.35} strokeWidth={1.6} strokeLinecap="round" />
          <line className="sgu-l2 reel-anim" x1={17} y1={35} x2={30} y2={35} stroke="#0b1530" strokeOpacity={0.35} strokeWidth={1.6} strokeLinecap="round" />
        </g>
        <circle className="sgu-s0 reel-anim" cx={8} cy={15} r={2} fill="#0b1530" />
        <circle className="sgu-s1 reel-anim" cx={8} cy={25} r={2} fill="#0b1530" />
        <circle className="sgu-s2 reel-anim" cx={8} cy={35} r={2} fill="#0b1530" />
        <circle className="sgu-s3 reel-anim" cx={8} cy={45} r={2} fill="#0b1530" />
        <line className="sgu-new reel-anim" x1={17} y1={43} x2={30} y2={43} stroke="#a15c0b" strokeWidth={2.6} strokeLinecap="round" />
        <g className="sgu-coin reel-anim">
          <circle cx={46} cy={46} r={11} fill="#a15c0b" />
          <circle cx={46} cy={46} r={7} fill="none" stroke="#fbfaf7" strokeOpacity={0.85} strokeWidth={1.3} />
        </g>
      </g>
    </svg>
  )
}
