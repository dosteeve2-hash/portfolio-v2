import CountUp from './CountUp'

export interface ProofFigure {
  readonly value: number
  readonly suffix?: string
  readonly label: string
}

/** Trois chiffres vérifiables, en cotes de plan : valeur en grand, légende en étiquette mono. */
export default function ProofStrip({ figures }: { readonly figures: readonly ProofFigure[] }) {
  return (
    <dl className="grid max-w-xl grid-cols-3 gap-x-4 border-t border-line2 pt-4">
      {figures.map((figure) => (
        <div key={figure.label} className="flex flex-col-reverse justify-end">
          <dt className="mt-2 font-mono text-[10.5px] uppercase leading-snug tracking-[0.1em] text-text2">{figure.label}</dt>
          <dd className="font-display text-3xl font-semibold leading-none text-navy sm:text-4xl">
            <CountUp value={figure.value} />
            {figure.suffix ? <span className="ml-0.5 text-lg text-text2">{figure.suffix}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  )
}
