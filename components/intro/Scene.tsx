'use client'

import { cubicBezier, motion, useTransform, type MotionValue } from 'motion/react'
import { Fragment, type RefObject } from 'react'
import { INTRO_NAME, INTRO_SWATCH } from '@/content/intro'
import { EASE_IN_OUT, EASE_OUT, EASE_PUSH, EASE_SNAP, type Schedule, type TimedWord } from './schedule'

type Bezier = readonly [number, number, number, number]

const curve = (bezier: Bezier) => cubicBezier(bezier[0], bezier[1], bezier[2], bezier[3])
const easeOut = curve(EASE_OUT)
const easeInOut = curve(EASE_IN_OUT)
const easePush = curve(EASE_PUSH)
const easeSnap = curve(EASE_SNAP)
const easeFlight = curve([0.76, 0, 0.24, 1])

/** Avancement 0 → 1 de `v` entre `from` et `to`, borné, avec une courbe. */
function span(v: number, from: number, to: number, ease: (x: number) => number = easeOut): number {
  if (v <= from) return 0
  if (v >= to) return 1
  return ease((v - from) / (to - from))
}

const mix = (a: number, b: number, p: number) => a + (b - a) * p

/** Le nom passe de la crème de la nuit à l'encre du jour pendant son vol vers l'accueil clair. */
const NAME_NIGHT = [245, 240, 232] as const
const NAME_DAY = [11, 21, 48] as const
const nameColorAt = (q: number): string => {
  const channel = (i: 0 | 1 | 2) => Math.round(mix(NAME_NIGHT[i], NAME_DAY[i], q))
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`
}

export interface FrameSize {
  readonly w: number
  readonly h: number
}

export interface Flight {
  nameX: number
  nameY: number
  nameScale: number
  lineX: number
  lineY: number
  lineScaleX: number
  lineScaleY: number
}

export function emptyFlight(): Flight {
  return { nameX: 0, nameY: 0, nameScale: 1, lineX: 0, lineY: 0, lineScaleX: 1, lineScaleY: 1 }
}

interface Labels {
  readonly frameName: string
  readonly roles: readonly [string, string]
}

interface SceneProps {
  readonly t: MotionValue<number>
  readonly s: Schedule
  readonly size: FrameSize
  readonly labels: Labels
  readonly nameRef: RefObject<HTMLSpanElement | null>
  readonly lineRef: RefObject<HTMLDivElement | null>
  readonly flight: RefObject<Flight>
}

/* ---------- Typographie cinétique ---------- */

function KineticWord({ t, at, children }: { readonly t: MotionValue<number>; readonly at: number; readonly children: string }) {
  const y = useTransform(t, (v) => `${((1 - span(v, at, at + 0.55)) * 110).toFixed(2)}%`)
  const opacity = useTransform(t, (v) => span(v, at, at + 0.22, easeInOut))
  const filter = useTransform(t, (v) => {
    const p = span(v, at, at + 0.5)
    return p >= 1 ? 'none' : `blur(${((1 - p) * 5).toFixed(2)}px)`
  })
  return (
    <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
      <motion.span className="inline-block" style={{ y, opacity, filter }}>
        {children}
      </motion.span>
    </span>
  )
}

function KineticLine({ t, words }: { readonly t: MotionValue<number>; readonly words: readonly TimedWord[] }) {
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word.text}-${index}`}>
          {index > 0 ? ' ' : null}
          <KineticWord t={t} at={word.at}>
            {word.text}
          </KineticWord>
        </Fragment>
      ))}
    </>
  )
}

/* ---------- Cadre d'interface ---------- */

function Handle({ t, at, x, y }: { readonly t: MotionValue<number>; readonly at: number; readonly x: number; readonly y: number }) {
  const scale = useTransform(t, (v) => span(v, at, at + 0.32, easeSnap))
  return (
    <motion.rect
      x={x - 3.5}
      y={y - 3.5}
      width={7}
      height={7}
      rx={1.5}
      fill="#070e1f"
      stroke="#f7c060"
      strokeWidth={1.2}
      style={{ scale, opacity: scale, transformBox: 'fill-box', transformOrigin: 'center' }}
    />
  )
}

function Stroke({ d, progress, dim }: { readonly d: string; readonly progress: MotionValue<number>; readonly dim?: boolean }) {
  const opacity = useTransform(progress, (p) => (p > 0.002 ? (dim ? 0.6 : 1) : 0))
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="#f0a832"
      strokeWidth={dim ? 1 : 1.5}
      strokeLinecap="square"
      style={{ pathLength: progress, opacity }}
    />
  )
}

function Frame({ t, s, size }: { readonly t: MotionValue<number>; readonly s: Schedule; readonly size: FrameSize }) {
  const { w, h } = size
  const c = Math.round(Math.min(24, w * 0.08))
  const corners = useTransform(t, (v) => span(v, s.phase2 + 0.04, s.phase2 + 0.5))
  const sides = useTransform(t, (v) => span(v, s.phase2 + 0.36, s.phase2 + 0.95, easeInOut))
  const handlesAt = s.phase2 + 0.78
  const points: readonly (readonly [number, number])[] = [
    [0, 0],
    [w / 2, 0],
    [w, 0],
    [w, h / 2],
    [w, h],
    [w / 2, h],
    [0, h],
    [0, h / 2],
  ]
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden="true">
      <Stroke d={`M0 ${c} V0 H${c}`} progress={corners} />
      <Stroke d={`M${w - c} 0 H${w} V${c}`} progress={corners} />
      <Stroke d={`M${w} ${h - c} V${h} H${w - c}`} progress={corners} />
      <Stroke d={`M${c} ${h} H0 V${h - c}`} progress={corners} />
      <Stroke d={`M${c} 0 H${w / 2}`} progress={sides} dim />
      <Stroke d={`M${w - c} 0 H${w / 2}`} progress={sides} dim />
      <Stroke d={`M${w} ${c} V${h / 2}`} progress={sides} dim />
      <Stroke d={`M${w} ${h - c} V${h / 2}`} progress={sides} dim />
      <Stroke d={`M${w - c} ${h} H${w / 2}`} progress={sides} dim />
      <Stroke d={`M${c} ${h} H${w / 2}`} progress={sides} dim />
      <Stroke d={`M0 ${h - c} V${h / 2}`} progress={sides} dim />
      <Stroke d={`M0 ${c} V${h / 2}`} progress={sides} dim />
      {points.map(([x, y], index) => (
        <Handle key={`${x}-${y}`} t={t} at={handlesAt + index * 0.03} x={x} y={y} />
      ))}
    </svg>
  )
}

/* ---------- Annotations de maquette ---------- */

function Appear({
  t,
  at,
  out,
  className,
  style,
  children,
}: {
  readonly t: MotionValue<number>
  readonly at: number
  readonly out: number
  readonly className: string
  readonly style?: React.CSSProperties
  readonly children: React.ReactNode
}) {
  const opacity = useTransform(t, (v) => span(v, at, at + 0.3, easeInOut) * (1 - span(v, out, out + 0.4, easeInOut)))
  const y = useTransform(t, (v) => (1 - span(v, at, at + 0.45)) * 6)
  return (
    <motion.div className={className} style={{ ...style, opacity, y }}>
      {children}
    </motion.div>
  )
}

function Tag({ children }: { readonly children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-gold/55 bg-bg3/95 px-2 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.14em] text-gold2 shadow-[0_6px_18px_-10px_rgba(0,0,0,0.9)]">
      <span className="h-1 w-1 rounded-full bg-gold" />
      {children}
    </span>
  )
}

function Cursor({ t, s, size }: { readonly t: MotionValue<number>; readonly s: Schedule; readonly size: FrameSize }) {
  const { w, h } = size
  const start = { x: w * 0.82, y: h + 150 }
  const target = { x: 14, y: h + 47 }
  const x = useTransform(t, (v) => {
    const travel = span(v, s.cursorIn, s.click - 0.04, easeOut)
    const drag = span(v, s.click, s.snapEnd, easeSnap)
    const leave = span(v, s.snapEnd + 0.08, s.snapEnd + 0.5, easeInOut)
    return mix(start.x, target.x, travel) - 16 * drag + 26 * leave
  })
  const y = useTransform(t, (v) => {
    const travel = span(v, s.cursorIn, s.click - 0.04, easeOut)
    const drag = span(v, s.click, s.snapEnd, easeSnap)
    const leave = span(v, s.snapEnd + 0.08, s.snapEnd + 0.5, easeInOut)
    return mix(start.y, target.y, travel) - 11 * drag + 30 * leave
  })
  const opacity = useTransform(t, (v) => span(v, s.cursorIn, s.cursorIn + 0.25) * (1 - span(v, s.snapEnd + 0.15, s.snapEnd + 0.45)))
  const press = useTransform(t, (v) => 1 - 0.16 * (span(v, s.click - 0.04, s.click + 0.04) - span(v, s.click + 0.1, s.click + 0.24)))
  const ripple = useTransform(t, (v) => span(v, s.click, s.click + 0.5))
  const rippleScale = useTransform(ripple, (p) => 0.2 + p * 1.8)
  const rippleOpacity = useTransform(ripple, (p) => (p <= 0 || p >= 1 ? 0 : 0.7 * (1 - p)))
  return (
    <motion.div className="pointer-events-none absolute left-0 top-0" style={{ x, y, opacity }}>
      <motion.span
        className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-gold2"
        style={{ scale: rippleScale, opacity: rippleOpacity }}
      />
      <motion.svg width="18" height="22" viewBox="0 0 18 22" style={{ scale: press, originX: 0, originY: 0 }}>
        <path
          d="M1.5 1.5v16.2l4.3-4.1 2.9 6.6 2.6-1.1-2.9-6.5h6z"
          fill="#f5f0e8"
          stroke="#070e1f"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  )
}

function Annotations({ t, s, size, labels }: Omit<SceneProps, 'nameRef' | 'lineRef' | 'flight'>) {
  const { w, h } = size
  const out = s.phase4
  const snapX = useTransform(t, (v) => 16 * (1 - span(v, s.click, s.snapEnd, easeSnap)))
  const snapY = useTransform(t, (v) => 11 * (1 - span(v, s.click, s.snapEnd, easeSnap)) + 6 * (1 - span(v, s.role2, s.role2 + 0.4)))
  const snapRotate = useTransform(t, (v) => -3 * (1 - span(v, s.click, s.snapEnd, easeSnap)))
  const tag2Opacity = useTransform(t, (v) => span(v, s.role2, s.role2 + 0.3, easeInOut) * (1 - span(v, out, out + 0.4, easeInOut)))
  const guide = useTransform(t, (v) => span(v, s.click + 0.05, s.click + 0.2) * (1 - span(v, s.snapEnd + 0.15, s.snapEnd + 0.5)))
  const dimension = useTransform(t, (v) => span(v, s.phase2 + 0.7, s.phase2 + 1.2, easeInOut))
  const dimensionOpacity = useTransform(t, (v) => span(v, s.phase2 + 0.7, s.phase2 + 0.9) * (1 - span(v, out, out + 0.4, easeInOut)))

  return (
    <div className="relative" style={{ width: w, height: h }}>
      <Appear t={t} at={s.phase2 + 0.6} out={out} className="absolute -top-6 left-0 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-text2">
        <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
          <path d="M2.5 0v9M6.5 0v9M0 2.5h9M0 6.5h9" stroke="#9ba8c4" strokeWidth="1" />
        </svg>
        {labels.frameName}
      </Appear>

      <Appear t={t} at={s.role1} out={out} className="absolute -top-8 right-0">
        <Tag>{labels.roles[0]}</Tag>
      </Appear>

      <motion.div className="absolute left-0 right-0 flex items-center" style={{ top: h + 16, opacity: dimensionOpacity }}>
        <motion.div className="relative h-px flex-1 origin-center bg-gold/50" style={{ scaleX: dimension }}>
          <span className="absolute -top-[3px] left-0 h-[7px] w-px bg-gold/80" />
          <span className="absolute -top-[3px] right-0 h-[7px] w-px bg-gold/80" />
        </motion.div>
        <span className="absolute left-1/2 -translate-x-1/2 bg-bg px-2 font-mono text-[10px] tracking-[0.1em] text-gold2">
          {Math.round(w)} × {Math.round(h)}
        </span>
      </motion.div>

      <motion.div className="absolute w-px" style={{ left: 0, top: h + 4, height: 54, opacity: guide }}>
        <span className="block h-full w-px bg-[repeating-linear-gradient(to_bottom,#2dd4ff_0_3px,transparent_3px_6px)]" />
      </motion.div>

      <motion.div
        className="absolute left-0"
        style={{ top: h + 38, x: snapX, y: snapY, rotate: snapRotate, opacity: tag2Opacity, originX: 0, originY: 0.5 }}
      >
        <Tag>{labels.roles[1]}</Tag>
      </motion.div>

      <Appear
        t={t}
        at={s.name + 0.55}
        out={out}
        className="absolute right-0 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] text-text2"
        style={{ top: h + 40 }}
      >
        <span className="h-2.5 w-2.5 rounded-[3px] border border-gold2/60" style={{ background: INTRO_SWATCH }} />
        {INTRO_SWATCH}
      </Appear>

      <Cursor t={t} s={s} size={size} />
    </div>
  )
}

/* ---------- Nom, balayage d'or et ligne ---------- */

function NameBlock({ t, s, size, nameRef, lineRef, flight }: Omit<SceneProps, 'labels'>) {
  const { w } = size
  const nameSize = Math.round(Math.min(w * 0.2, 132))
  const leadSize = Math.round(Math.max(15, nameSize * 0.17))
  const discoverSize = Math.round(Math.max(15, Math.min(22, w * 0.032)))

  const sweep = useTransform(t, (v) => span(v, s.name, s.name + 0.62, easeInOut))
  const clipPath = useTransform(sweep, (p) => `inset(-25% calc(${((1 - p) * 124).toFixed(2)}% - 12%) -25% -12%)`)
  // Bord d'attaque du balayage : une bande d'or qui suit la barre, comme du métal encore chaud.
  const bandMask = useTransform(sweep, (p) => {
    const edge = p * 124 - 12
    return `linear-gradient(90deg, transparent ${(edge - 26).toFixed(2)}%, #000 ${(edge - 2).toFixed(2)}%, #000 ${edge.toFixed(2)}%, transparent ${(edge + 0.5).toFixed(2)}%)`
  })
  const barLeft = useTransform(sweep, (p) => `${(p * 100).toFixed(2)}%`)
  const barOpacity = useTransform(t, (v) => span(v, s.name - 0.02, s.name + 0.06) * (1 - span(v, s.name + 0.5, s.name + 0.72)))
  const underline = useTransform(t, (v) => span(v, s.name + 0.5, s.name + 1.0))

  const fly = useTransform(t, (v) => span(v, s.flyStart, s.flyEnd, easeFlight))
  const landedFade = useTransform(t, (v) => 1 - span(v, s.flyEnd, s.flyEnd + 0.14, easeInOut))
  const nameX = useTransform(fly, (p) => p * flight.current.nameX)
  const nameY = useTransform(fly, (p) => p * flight.current.nameY)
  const nameScale = useTransform(fly, (p) => mix(1, flight.current.nameScale, p))
  const nameColor = useTransform(t, (v) => nameColorAt(span(v, s.flyStart - 0.02, s.flyStart + 0.3, easeInOut)))
  const lineX = useTransform(fly, (p) => p * flight.current.lineX)
  const lineY = useTransform(fly, (p) => p * flight.current.lineY)
  const lineScaleX = useTransform([fly, underline], ([p, u]) => mix(1, flight.current.lineScaleX, Number(p)) * Number(u))
  const lineScaleY = useTransform(fly, (p) => mix(1, flight.current.lineScaleY, p))

  const leadOpacity = useTransform(t, (v) => 1 - span(v, s.flyStart - 0.1, s.flyStart + 0.2, easeInOut))
  const discoverOpacity = useTransform(t, (v) => 1 - span(v, s.flyStart, s.flyStart + 0.3, easeInOut))

  return (
    <div className="flex flex-col items-center text-center">
      <motion.p className="font-sans font-light text-text2" style={{ fontSize: leadSize, opacity: leadOpacity }}>
        <KineticLine t={t} words={s.lead} />
      </motion.p>

      <motion.div className="relative mt-1" style={{ x: nameX, y: nameY, scale: nameScale, opacity: landedFade }}>
        <motion.span
          className="relative block font-display font-black italic leading-[1.05] text-text"
          style={{ fontSize: nameSize, clipPath, color: nameColor }}
        >
          <span ref={nameRef}>{INTRO_NAME}</span>
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 block font-display font-black italic leading-[1.05] text-gold2"
          style={{ fontSize: nameSize, maskImage: bandMask, WebkitMaskImage: bandMask, opacity: barOpacity }}
        >
          {INTRO_NAME}
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="absolute top-[18%] h-[68%] w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gold2/0 via-gold2 to-gold/0 shadow-[0_0_18px_3px_rgba(240,168,50,0.55)]"
          style={{ left: barLeft, opacity: barOpacity }}
        />
      </motion.div>

      <motion.div
        ref={lineRef}
        className="mt-3 h-[1.5px] origin-center bg-gradient-to-r from-gold via-gold2 to-gold shadow-[0_0_14px_1px_rgba(240,168,50,0.5)]"
        style={{ width: Math.round(nameSize * 2.1), x: lineX, y: lineY, scaleX: lineScaleX, scaleY: lineScaleY, opacity: landedFade }}
      />

      <motion.p className="mt-5 font-sans font-light text-text" style={{ fontSize: discoverSize, opacity: discoverOpacity }}>
        <KineticLine t={t} words={s.discover} />
      </motion.p>
    </div>
  )
}

/* ---------- Scène complète ---------- */

export default function Scene({ t, s, size, labels, nameRef, lineRef, flight }: SceneProps) {
  const { w, h } = size
  const camera = useTransform(t, (v) => span(v, 0, s.flyStart, easePush))
  const textScale = useTransform(camera, (c) => 1 + 0.035 * c)
  const textY = useTransform(camera, (c) => -6 * c)
  const annotationScale = useTransform(camera, (c) => 1 + 0.065 * c)
  const frameScale = useTransform(t, (v) => (1 + 0.05 * span(v, 0, s.flyStart, easePush)) * (1 + 0.1 * span(v, s.phase4, s.flyStart + 0.4)))
  const frameOpacity = useTransform(t, (v) => 1 - span(v, s.flyStart - 0.15, s.flyStart + 0.35, easeInOut))

  const welcomeOut = useTransform(t, (v) => span(v, s.phase3, s.phase3 + 0.42, easeInOut))
  const welcomeY = useTransform(welcomeOut, (p) => `${(-p * 0.5).toFixed(3)}em`)
  const welcomeOpacity = useTransform(welcomeOut, (p) => 1 - p)
  const welcomeFilter = useTransform(welcomeOut, (p) => (p <= 0 ? 'none' : `blur(${(p * 4).toFixed(2)}px)`))
  const welcomeSize = Math.round(Math.min(w * 0.062, 46))

  return (
    <>
      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ scale: frameScale, opacity: frameOpacity }}>
        <Frame t={t} s={s} size={size} />
      </motion.div>

      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ scale: annotationScale }}>
        <Annotations t={t} s={s} size={size} labels={labels} />
      </motion.div>

      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ scale: textScale, y: textY }}>
        <div className="relative flex items-center justify-center" style={{ width: w, height: h }}>
          <motion.p
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 text-center font-sans font-light leading-tight text-text"
            style={{ fontSize: welcomeSize, y: welcomeY, opacity: welcomeOpacity, filter: welcomeFilter }}
          >
            <KineticLine t={t} words={s.welcome} />
          </motion.p>
          <NameBlock t={t} s={s} size={size} nameRef={nameRef} lineRef={lineRef} flight={flight} />
        </div>
      </motion.div>
    </>
  )
}
