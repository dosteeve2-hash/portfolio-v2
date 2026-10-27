'use client'

import type { Locale } from '@/content/locales'
import { automatedTestCount, onlineProjectCount } from '@/content/projects'
import { fill, waouh } from '@/content/waouh'
import DrawPath from '@/kit/components/DrawPath'
import PinnedStory from '@/kit/components/PinnedStory'
import { clamp, lerp } from '@/kit/lib/math'

interface Geometry {
  readonly viewBox: string
  readonly trunk: string
  readonly centers: readonly (readonly [number, number])[]
  readonly node: readonly [number, number]
  readonly loop: string
  readonly loopLabel: readonly [number, number] | null
  /** Part de la longueur du tracé où se trouve chaque nœud (0..1). */
  readonly fractions: readonly number[]
}

const HORIZONTAL: Geometry = {
  viewBox: '0 0 880 250',
  trunk: 'M20 140 H860',
  centers: [
    [110, 140],
    [330, 140],
    [550, 140],
    [770, 140],
  ],
  node: [172, 76],
  loop: 'M330 100 C330 28 110 28 110 100',
  loopLabel: [220, 34],
  fractions: [90 / 840, 310 / 840, 530 / 840, 750 / 840],
}

const VERTICAL: Geometry = {
  viewBox: '0 0 320 330',
  trunk: 'M160 14 V316',
  centers: [
    [160, 44],
    [160, 120],
    [160, 196],
    [160, 272],
  ],
  node: [220, 56],
  loop: 'M272 120 C320 120 320 44 272 44',
  loopLabel: null,
  fractions: [30 / 302, 106 / 302, 182 / 302, 258 / 302],
}

/** Part du tracé atteinte pour une progression de scène 0..1 : le trait va d'un nœud au suivant, étape par étape. */
function trunkProgress(progress: number, fractions: readonly number[]): number {
  const steps = fractions.length
  const scaled = clamp(progress) * steps
  const index = Math.min(steps - 1, Math.floor(scaled))
  const from = fractions[index] ?? 0
  const to = index === steps - 1 ? 1 : (fractions[index + 1] ?? 1)
  return lerp(from, to, scaled - index)
}

interface SchemaProps {
  readonly geometry: Geometry
  readonly progress: number
  readonly step: number
  readonly names: readonly { readonly name: string; readonly sub: string }[]
  readonly loopText: string
  readonly title: string
  readonly className: string
}

function Schema({ geometry, progress, step, names, loopText, title, className }: SchemaProps) {
  const [nodeW, nodeH] = geometry.node
  const reached = trunkProgress(progress, geometry.fractions)
  return (
    <DrawPath
      d={geometry.trunk}
      viewBox={geometry.viewBox}
      progress={reached}
      stroke="var(--color-gold2)"
      strokeWidth={2.5}
      title={title}
      className={className}
    >
      {geometry.centers.map(([cx, cy], i) => {
        const copy = names[i]
        const active = i <= step
        const current = i === step
        return (
          <g
            key={copy?.name ?? i}
            style={{
              opacity: active ? 1 : 0.35,
              transition: 'opacity 0.4s ease',
            }}
          >
            <rect
              x={cx - nodeW / 2}
              y={cy - nodeH / 2}
              width={nodeW}
              height={nodeH}
              rx={6}
              fill={current ? 'var(--color-accent)' : 'var(--color-bg3)'}
              stroke={active ? 'var(--color-accent)' : 'var(--color-line2)'}
              strokeWidth={current ? 2 : 1.25}
              style={{ transition: 'fill 0.3s ease' }}
            />
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              fontSize={17}
              fontWeight={600}
              fill={current ? 'var(--color-on-accent)' : 'var(--color-text)'}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {copy?.name}
            </text>
            <text
              x={cx}
              y={cy + 16}
              textAnchor="middle"
              fontSize={10.5}
              fill={current ? 'var(--color-on-accent)' : 'var(--color-text2)'}
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {copy?.sub}
            </text>
          </g>
        )
      })}
      <path
        d={geometry.loop}
        stroke="var(--color-gold2)"
        strokeWidth={1.5}
        strokeDasharray="5 5"
        fill="none"
        style={{ opacity: step >= 1 ? 0.9 : 0, transition: 'opacity 0.4s ease' }}
      />
      {geometry.loopLabel ? (
        <text
          x={geometry.loopLabel[0]}
          y={geometry.loopLabel[1]}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-text2)"
          style={{ fontFamily: 'var(--font-mono)', opacity: step >= 1 ? 1 : 0, transition: 'opacity 0.4s ease' }}
        >
          {loopText}
        </text>
      ) : null}
    </DrawPath>
  )
}

/**
 * Scène épinglée de la section Projets : l'écran est retenu pendant que le schéma « spécifier, tester, construire,
 * livrer » se trace, une étape à la fois. Sans JavaScript ou en mouvement réduit : schéma complet, étapes listées à plat.
 */
export default function ProjectsScene({ locale }: { readonly locale: Locale }) {
  const t = waouh[locale].scene
  const counter = fill(t.counter, { tests: automatedTestCount, projects: onlineProjectCount })

  return (
    <PinnedStory steps={4} screensPerStep={0.7}>
      {({ progress, step, live }) => (
        <div className="theme-navy section-navy flex min-h-[100svh] flex-col justify-center py-20 text-text md:py-24">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{t.eyebrow}</p>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight md:text-4xl">{t.title}</h3>

            <div className="mt-6 md:mt-10">
              <Schema
                geometry={VERTICAL}
                progress={progress}
                step={live ? step : 99}
                names={t.steps}
                loopText={t.loop}
                title={t.svgTitle}
                className="mx-auto block h-auto max-h-[44svh] w-full max-w-[340px] md:hidden"
              />
              <Schema
                geometry={HORIZONTAL}
                progress={progress}
                step={live ? step : 99}
                names={t.steps}
                loopText={t.loop}
                title={t.svgTitle}
                className="mx-auto hidden h-auto w-full max-w-[880px] md:block"
              />
            </div>

            {live ? (
              <div className="mt-6 min-h-[5.5rem] md:mt-8">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-text2">
                  {String(step + 1).padStart(2, '0')} / 04
                </p>
                <p className="mt-2 max-w-2xl text-base text-text md:text-lg" aria-live="polite">
                  <span className="font-display font-semibold">{t.steps[step]?.name}.</span> {t.steps[step]?.line}
                </p>
              </div>
            ) : (
              <ol className="mt-8 grid gap-4 md:grid-cols-2">
                {t.steps.map((item, i) => (
                  <li key={item.name} className="border-l-2 border-accent pl-4">
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-text2">{String(i + 1).padStart(2, '0')}</p>
                    <p className="mt-1">
                      <span className="font-display font-semibold">{item.name}.</span> {item.line}
                    </p>
                  </li>
                ))}
              </ol>
            )}

            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-text2">{counter}</p>
          </div>
        </div>
      )}
    </PinnedStory>
  )
}
