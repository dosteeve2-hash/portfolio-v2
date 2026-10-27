interface AssistantMarkProps {
  readonly size?: number
  readonly className?: string
}

/**
 * Symbole de l'assistant, sans visage : un réticule de calque (anneau gradué, quatre repères de visée) autour du
 * monogramme « SDC », avec une étincelle à quatre branches. Tracé fin, cobalt du plan d'ingénieur, créé pour ce site.
 */
export default function AssistantMark({ size = 28, className }: AssistantMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="15" stroke="currentColor" strokeWidth="0.75" strokeDasharray="1.2 3.1" opacity="0.7" />
      <path
        d="M24 1.5v6M24 40.5v6M1.5 24h6M40.5 24h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text
        x="24"
        y="27.6"
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="600"
        letterSpacing="0.6"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        SDC
      </text>
      <path d="M38.5 7.5c.45 2.7 1.3 3.55 4 4-2.7.45-3.55 1.3-4 4-.45-2.7-1.3-3.55-4-4 2.7-.45 3.55-1.3 4-4Z" fill="currentColor" />
    </svg>
  )
}
