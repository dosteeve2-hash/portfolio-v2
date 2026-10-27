interface CheckCardProps {
  readonly title: string
  readonly spec: string
  readonly points: readonly string[]
}

export default function CheckCard({ title, spec, points }: CheckCardProps) {
  return (
    <section className="flex h-full flex-col rounded-md border border-line2 bg-bg3">
      <header className="flex items-center justify-between border-b border-line2 bg-bg2 px-4 py-2.5">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text2">{spec}</span>
      </header>
      <ul className="space-y-3 p-4 text-[15px]">
        {points.map((point) => (
          <li key={point} className="flex gap-2.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="mt-[0.4em] shrink-0 text-accent"
            >
              <path d="M2 7.5l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
