/**
 * Symbole animé d'Indubot Afrika (dessin original, voir public/logos/indubot/).
 * Un engrenage prend sa place et tourne d'un cran ; un signal part de son cœur et se propage en ondes.
 * L'état final est le logo. Les animations (globals.css, « Boucles des projets ») ne touchent que transform et opacity.
 */
export default function IndubotMark({ className }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`rl-svg ${className ?? ''}`} focusable="false">
      <g className="rl-sym reel-anim">
        <path className="ind-gear reel-anim" d="M23.38 25.68L23.75 20.95L28.25 20.95L28.62 25.68A12.6 12.6 0 0 1 32.86 27.43L36.47 24.35L39.65 27.53L36.57 31.14A12.6 12.6 0 0 1 38.32 35.38L43.05 35.75L43.05 40.25L38.32 40.62A12.6 12.6 0 0 1 36.57 44.86L39.65 48.47L36.47 51.65L32.86 48.57A12.6 12.6 0 0 1 28.62 50.32L28.25 55.05L23.75 55.05L23.38 50.32A12.6 12.6 0 0 1 19.14 48.57L15.53 51.65L12.35 48.47L15.43 44.86A12.6 12.6 0 0 1 13.68 40.62L8.95 40.25L8.95 35.75L13.68 35.38A12.6 12.6 0 0 1 15.43 31.14L12.35 27.53L15.53 24.35L19.14 27.43A12.6 12.6 0 0 1 23.38 25.68ZM31.2 38.0A5.2 5.2 0 1 0 20.8 38.0A5.2 5.2 0 1 0 31.2 38.0Z" fill="#0b1530" fillRule="evenodd" />
        <circle className="ind-core reel-anim" cx={26} cy={38} r={2.9} fill="#4d7c0f" />
        <path className="ind-a1 reel-anim" d="M30.78 15.5A23 23 0 0 1 48.5 33.22" fill="none" stroke="#4d7c0f" strokeOpacity={1} strokeWidth={2} strokeLinecap="round" />
        <path className="ind-a2 reel-anim" d="M32.13 9.14A29.5 29.5 0 0 1 54.86 31.87" fill="none" stroke="#4d7c0f" strokeOpacity={0.7} strokeWidth={2} strokeLinecap="round" />
        <path className="ind-a3 reel-anim" d="M33.48 2.79A36 36 0 0 1 61.21 30.52" fill="none" stroke="#4d7c0f" strokeOpacity={0.42} strokeWidth={2} strokeLinecap="round" />
      </g>
    </svg>
  )
}
