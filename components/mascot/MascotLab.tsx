'use client'

import { useEffect, useRef, useState } from 'react'
import { mascotText } from '@/content/mascotText'
import type { Locale } from '@/content/locales'
import MascotFigure from './MascotFigure'
import { createLookTarget, EXPRESSIONS, wakeLook, type Expression, type LookTarget } from './pose'

function LabCard({
  expression,
  label,
  play,
  lookRef,
}: {
  readonly expression: Expression
  readonly label: string
  readonly play: string
  readonly lookRef?: React.RefObject<LookTarget>
}) {
  const [shown, setShown] = useState<Expression>(expression)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const trigger = () => {
    window.clearTimeout(timer.current)
    setShown('neutral')
    timer.current = window.setTimeout(() => setShown(expression), 420)
  }

  return (
    <li className="rounded-2xl border border-line2 bg-bg3 p-4">
      <div className="mx-auto w-full max-w-[240px]">
        <MascotFigure expression={shown} lookRef={lookRef} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">{label}</span>
        <button
          type="button"
          onClick={trigger}
          className="rounded-lg border border-line2 bg-bg2 px-3 py-1.5 font-mono text-[11px] text-text hover:border-gold"
        >
          {play}
        </button>
      </div>
    </li>
  )
}

export default function MascotLab({ locale }: { readonly locale: Locale }) {
  const text = mascotText[locale]
  const [follow, setFollow] = useState(false)
  const look = useRef<LookTarget>(createLookTarget())

  useEffect(() => {
    if (!follow) {
      look.current.x = 0
      look.current.y = 0
      wakeLook(look.current)
      return undefined
    }
    const onMove = (event: PointerEvent) => {
      look.current.x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth - 0.5) * 2))
      look.current.y = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight - 0.5) * 2))
      wakeLook(look.current)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [follow])

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold italic">{text.lab.title}</h1>
      <p className="mt-3 max-w-2xl text-text2">{text.lab.intro}</p>
      <label className="mt-6 inline-flex cursor-pointer items-center gap-2 font-mono text-xs text-text2">
        <input type="checkbox" checked={follow} onChange={(event) => setFollow(event.target.checked)} />
        {text.lab.follow}
      </label>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {EXPRESSIONS.map((expression) => (
          <LabCard
            key={expression}
            expression={expression}
            label={text.lab.expressions[expression]}
            play={text.lab.play}
            lookRef={follow ? look : undefined}
          />
        ))}
      </ul>
    </main>
  )
}
