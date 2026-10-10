/**
 * Symbole animé du banc d'orchestration (dessin original, voir public/logos/banc-ia/).
 * Moyeu = le manager ; quatre agents reliés. L'agent de droite s'éteint (quota), sa place reste vide,
 * les deux voisins se rééquilibrent à 120°, puis l'orbite se referme. L'état final est le logo.
 * Les animations (globals.css, « Boucles des projets ») ne touchent que transform et opacity.
 */

const centre = 32
const orbit = 22
const nodeX = centre + orbit
const spokeStart = centre + 9.4
const spokeEnd = centre + 17.4

interface Agent {
  readonly key: 'a' | 'b' | 'c' | 'd'
  readonly angle: number
  readonly rotates: boolean
}

const agents: readonly Agent[] = [
  { key: 'a', angle: -90, rotates: true },
  { key: 'b', angle: 0, rotates: false },
  { key: 'c', angle: 90, rotates: true },
  { key: 'd', angle: 180, rotates: false },
]

export default function OrchestratorMark({ className }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} focusable="false">
      <g className="orch-sym reel-anim">
        <circle
          className="orch-ring reel-anim"
          cx={centre}
          cy={centre}
          r={orbit}
          fill="none"
          stroke="#f0a832"
          strokeOpacity={0.8}
          strokeWidth={1.2}
          strokeDasharray="128.35 9.88"
          strokeDashoffset={133.29}
        />
        {agents.map((agent) => (
          <g key={agent.key} transform={`rotate(${agent.angle} ${centre} ${centre})`}>
            <g className={agent.rotates ? `orch-rot-${agent.key} reel-anim` : undefined}>
              <line
                className={`orch-spoke orch-spoke-${agent.key} reel-anim`}
                x1={spokeStart}
                y1={centre}
                x2={spokeEnd}
                y2={centre}
                stroke="#fbfaf7"
                strokeOpacity={0.6}
                strokeWidth={1.6}
                strokeLinecap="round"
              />
              <circle className={`orch-node orch-node-${agent.key} reel-anim`} cx={nodeX} cy={centre} r={3.6} fill="#fbfaf7" />
            </g>
          </g>
        ))}
        <circle
          className="orch-socket reel-anim"
          cx={nodeX}
          cy={centre}
          r={3.3}
          fill="none"
          stroke="#bac7e4"
          strokeOpacity={0.75}
          strokeWidth={1.2}
        />
        <circle className="orch-halo reel-anim" cx={centre} cy={centre} r={6} fill="none" stroke="#f7c060" strokeWidth={1.2} />
        <circle className="orch-hub reel-anim" cx={centre} cy={centre} r={6} fill="#f7c060" />
      </g>
    </svg>
  )
}
