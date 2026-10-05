'use client'

import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import {
  browPath,
  clamp,
  CX,
  EXPRESSION_DEFS,
  EYE_DX,
  EYE_Y,
  eyeGeo,
  mouthGeo,
  POSE_KEYS,
  type Expression,
  type LookTarget,
  type LookVector,
  type Pose,
} from './pose'

const SKIN = '#8a5a3c'
const SKIN_D = '#6b4430'
const SKIN_L = '#a87450'
const HAIR_C = '#1a1411'
const HAIR_L = '#33271f'
const SW = '#2f5f9a'
const SW_D = '#234a79'
const SW_L = '#3d72b3'
const LASH = '#150e0b'

const FACE = 'M120 40C158 40 176 68 175.5 104C175.2 128 171 148 162 160C154 169 138 172 120 172C102 172 86 169 78 160C69 148 64.8 128 64.5 104C64 68 82 40 120 40Z'

function seeded(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const num = (n: number): string => (Math.round(n * 100) / 100).toString()

function buildHair(): { fill: string; outer: string } {
  const cx = 120
  const cy = 86
  const rx = 62.5
  const ry = 60
  const segments = 18
  const start = (188 * Math.PI) / 180
  const end = (352 * Math.PI) / 180
  const points: Array<[number, number]> = []
  for (let i = 0; i <= segments; i += 1) {
    const a = start + ((end - start) * i) / segments
    points.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)])
  }
  const first = points[0] ?? [0, 0]
  let outer = `M${num(first[0])} ${num(first[1])}`
  for (let i = 1; i < points.length; i += 1) {
    const p = points[i] ?? first
    const q = points[i - 1] ?? first
    const dist = Math.hypot(p[0] - q[0], p[1] - q[1])
    outer += `A${num(dist * 0.78)} ${num(dist * 0.78)} 0 0 1 ${num(p[0])} ${num(p[1])}`
  }
  const last = points[points.length - 1] ?? first
  const fill =
    `M66 106L${num(first[0])} ${num(first[1])}` +
    outer.slice(outer.indexOf('A')) +
    `L${num(last[0] - 1)} ${num(last[1] + 6)}L174 106` +
    'C175 90 173 73 162 65C148 59.5 92 59.5 78 65C67 73 65 90 66 106Z'
  return { fill, outer }
}

const HAIR = buildHair()
const HAIR_PATH = HAIR.fill

function buildCurls(): string {
  const rand = seeded(7)
  let d = ''
  for (let i = 0; i < 34; i += 1) {
    const x = 70 + rand() * 100
    const y = 30 + rand() * 33
    const dx = (x - 120) / 62.5
    const dy = (y - 86) / 60
    if (dx * dx + dy * dy > 0.82 || y > 56) continue
    const dir = rand() > 0.5 ? 1 : -1
    d += `M${num(x)} ${num(y)}q${num(dir * 2.4)} -3.2 ${num(dir * 5.2)} -0.4`
  }
  return d
}

const CURLS = buildCurls()

function buildStubble(): Array<{ x: number; y: number; r: number }> {
  const rand = seeded(23)
  const dots: Array<{ x: number; y: number; r: number }> = []
  let guard = 0
  while (dots.length < 120 && guard < 6000) {
    guard += 1
    const x = 68 + rand() * 104
    const y = 132 + rand() * 40
    const ex = (x - 120) / 55
    const ey = (y - 106) / 64
    const edge = ex * ex + ey * ey
    if (edge > 0.96) continue
    const mouthBox = Math.abs(x - 120) < 25 && y > 136 && y < 162
    if (mouthBox) continue
    const onChin = Math.abs(x - 120) < 36 && y > 160
    const onJaw = edge > 0.7 && y > 134
    if (!onChin && !onJaw) continue
    dots.push({ x, y, r: 0.45 + rand() * 0.4 })
  }
  return dots
}

const STUBBLE = buildStubble()

function buildRibs(): string {
  let d = ''
  for (let deg = 12; deg <= 168; deg += 7.5) {
    const a = (deg * Math.PI) / 180
    d += `M${num(120 + 24 * Math.cos(a))} ${num(187 + 9 * Math.sin(a))}L${num(120 + 50 * Math.cos(a))} ${num(189 + 19 * Math.sin(a))}`
  }
  return d
}

const RIBS = buildRibs()

type ElKey =
  | 'head'
  | 'browL'
  | 'browR'
  | 'clipL'
  | 'clipR'
  | 'lashL'
  | 'lashR'
  | 'lowL'
  | 'lowR'
  | 'creaseL'
  | 'creaseR'
  | 'arcL'
  | 'arcR'
  | 'ballL'
  | 'ballR'
  | 'irisL'
  | 'irisR'
  | 'mouthClip'
  | 'mouthIn'
  | 'teeth'
  | 'tongue'
  | 'upperLip'
  | 'lowerLip'
  | 'mouthLine'
  | 'dimpleL'
  | 'dimpleR'
  | 'lipHl'
  | 'chinCrease'
  | 'cheekL'
  | 'cheekR'
  | 'zzz'

const EL_KEYS: readonly ElKey[] = [
  'head',
  'browL',
  'browR',
  'clipL',
  'clipR',
  'lashL',
  'lashR',
  'lowL',
  'lowR',
  'creaseL',
  'creaseR',
  'arcL',
  'arcR',
  'ballL',
  'ballR',
  'irisL',
  'irisR',
  'mouthClip',
  'mouthIn',
  'teeth',
  'tongue',
  'upperLip',
  'lowerLip',
  'mouthLine',
  'dimpleL',
  'dimpleR',
  'lipHl',
  'chinCrease',
  'cheekL',
  'cheekR',
  'zzz',
]

interface Settable {
  setAttribute(name: string, value: string): void
}

type Els = Partial<Record<ElKey, Settable | null>>

function set(els: Els, key: ElKey, attr: string, value: string | number): void {
  els[key]?.setAttribute(attr, typeof value === 'number' ? num(value) : value)
}

function applyPose(els: Els, pose: Pose, look: LookVector, blink: number): void {
  const lookX = clamp(pose.lookX + look.x, -1, 1)
  const lookY = clamp(pose.lookY + look.y, -1, 1)
  const tilt = pose.tilt + look.x * 3.2
  const hx = pose.headX + look.x * 2.4
  const hy = pose.headY + look.y * 1.8
  set(els, 'head', 'transform', `translate(${num(120 + hx)} ${num(176 + hy)}) rotate(${num(tilt)}) scale(1.07) translate(-120 -176)`)

  set(els, 'browL', 'd', browPath('L', pose.browLy, pose.browLt))
  set(els, 'browR', 'd', browPath('R', pose.browRy, pose.browRt))

  const sides = [
    { s: 'L' as const, cx: CX - EYE_DX, open: pose.openL * blink, smile: pose.smileL },
    { s: 'R' as const, cx: CX + EYE_DX, open: pose.openR * blink, smile: pose.smileR },
  ]
  for (const side of sides) {
    const geo = eyeGeo(side.cx, side.open, pose.squint)
    const open = 1 - side.smile
    set(els, `clip${side.s}`, 'd', geo.fill)
    set(els, `lash${side.s}`, 'd', geo.upper)
    set(els, `lash${side.s}`, 'opacity', open)
    set(els, `low${side.s}`, 'd', geo.lower)
    set(els, `low${side.s}`, 'opacity', open * clamp(side.open * 2, 0, 1))
    set(els, `crease${side.s}`, 'd', geo.crease)
    set(els, `crease${side.s}`, 'opacity', open * clamp(side.open * 1.2, 0, 0.85))
    set(els, `arc${side.s}`, 'd', geo.arc)
    set(els, `arc${side.s}`, 'opacity', side.smile)
    set(els, `ball${side.s}`, 'opacity', open)
    set(els, `iris${side.s}`, 'transform', `translate(${num(lookX * 4.4)} ${num(lookY * 3.2)})`)
  }

  const m = mouthGeo(pose)
  set(els, 'mouthClip', 'd', m.interior)
  set(els, 'mouthIn', 'd', m.interior)
  set(els, 'mouthIn', 'opacity', clamp(pose.mouthO * 12, 0, 1))
  set(els, 'upperLip', 'd', m.upperLip)
  set(els, 'lowerLip', 'd', m.lowerLip)
  set(els, 'mouthLine', 'd', m.line)
  set(els, 'dimpleL', 'd', m.dimpleL)
  set(els, 'dimpleR', 'd', m.dimpleR)
  const dimpleOpacity = clamp(pose.mouthS - 0.3, 0, 1) * 0.5
  set(els, 'dimpleL', 'opacity', dimpleOpacity)
  set(els, 'dimpleR', 'opacity', dimpleOpacity)
  set(els, 'teeth', 'y', m.teethY)
  set(els, 'teeth', 'height', m.teethH)
  set(els, 'tongue', 'cy', m.tongueCy)
  set(els, 'tongue', 'rx', m.tongueRx)
  set(els, 'tongue', 'ry', m.tongueRy)
  set(els, 'lipHl', 'cx', CX + pose.mouthX)
  set(els, 'lipHl', 'cy', m.highlightY)
  set(els, 'chinCrease', 'd', `M${num(CX + pose.mouthX - 9)} ${num(m.chinY)}Q${num(CX + pose.mouthX)} ${num(m.chinY + 2.4)} ${num(CX + pose.mouthX + 9)} ${num(m.chinY)}`)
  set(els, 'cheekL', 'opacity', pose.cheeks)
  set(els, 'cheekR', 'opacity', pose.cheeks)
  set(els, 'zzz', 'opacity', pose.zzz)
}

function initialAttributes(pose: Pose): Record<ElKey, Record<string, string>> {
  const store = {} as Record<ElKey, Record<string, string>>
  const fakes: Els = {}
  for (const key of EL_KEYS) {
    const bucket: Record<string, string> = {}
    store[key] = bucket
    fakes[key] = {
      setAttribute(name, value) {
        bucket[name] = value
      },
    }
  }
  applyPose(fakes, pose, { x: 0, y: 0 }, 1)
  return store
}

function blinkFactor(elapsed: number): number {
  if (elapsed < 0) return 1
  if (elapsed < 70) return 1 - elapsed / 70
  if (elapsed < 190) return (elapsed - 70) / 120
  return 1
}

interface MascotFigureProps {
  readonly expression: Expression
  readonly lookRef?: RefObject<LookTarget>
  readonly animated?: boolean
  readonly className?: string
}

const TAU_MS = 75

export default function MascotFigure({ expression, lookRef, animated = true, className }: MascotFigureProps) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const els = useRef<Els>({})
  const svgRef = useRef<SVGSVGElement>(null)
  const current = useRef<Pose>({ ...EXPRESSION_DEFS[expression].pose })
  const target = useRef<Pose>({ ...EXPRESSION_DEFS[expression].pose })
  const lookSmooth = useRef<LookVector>({ x: 0, y: 0 })
  const blinkStart = useRef(-1)
  const raf = useRef(0)
  const last = useRef(0)
  const runFrame = useRef<(time: number) => void>(() => undefined)
  const kick = useRef<() => void>(() => undefined)

  const [init] = useState(() => initialAttributes(EXPRESSION_DEFS[expression].pose))

  useEffect(() => {
    const root = svgRef.current
    if (!root) return
    const map: Els = {}
    root.querySelectorAll<SVGElement>('[data-k]').forEach((node) => {
      const key = node.dataset.k as ElKey | undefined
      if (key) map[key] = node
    })
    els.current = map
  }, [])

  useEffect(() => {
    target.current = { ...EXPRESSION_DEFS[expression].pose }
    if (!animated) {
      current.current = { ...target.current }
      lookSmooth.current = { x: 0, y: 0 }
      applyPose(els.current, current.current, lookSmooth.current, 1)
      return
    }
    kick.current()
  }, [expression, animated])

  useEffect(() => {
    if (!animated) return undefined
    let alive = true
    runFrame.current = (time: number) => {
      raf.current = 0
      if (!alive) return
      if (lookRef?.current?.frozen) {
        last.current = 0
        return
      }
      const dt = last.current === 0 ? 16 : Math.min(64, time - last.current)
      last.current = time
      const a = 1 - Math.exp(-dt / TAU_MS)
      let moving = false
      const cur = current.current
      const tgt = target.current
      for (const key of POSE_KEYS) {
        const diff = tgt[key] - cur[key]
        if (Math.abs(diff) > 0.002) {
          cur[key] += diff * a
          moving = true
        } else {
          cur[key] = tgt[key]
        }
      }
      const want = lookRef?.current ?? { x: 0, y: 0 }
      const la = 1 - Math.exp(-dt / 110)
      const ls = lookSmooth.current
      const dx = want.x - ls.x
      const dy = want.y - ls.y
      if (Math.abs(dx) > 0.002 || Math.abs(dy) > 0.002) {
        ls.x += dx * la
        ls.y += dy * la
        moving = true
      }
      let blink = 1
      if (blinkStart.current >= 0) {
        const elapsed = time - blinkStart.current
        blink = blinkFactor(elapsed)
        if (elapsed >= 190) blinkStart.current = -1
        else moving = true
      }
      applyPose(els.current, cur, ls, blink)
      if (moving) {
        raf.current = window.requestAnimationFrame(runFrame.current)
      } else {
        last.current = 0
      }
    }
    kick.current = () => {
      if (raf.current === 0 && alive) raf.current = window.requestAnimationFrame(runFrame.current)
    }
    applyPose(els.current, current.current, lookSmooth.current, 1)
    kick.current()
    const wake = () => kick.current()
    const look = lookRef?.current
    look?.wakers.add(wake)

    let blinkTimer = 0
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(
        () => {
          if (!look?.frozen) {
            blinkStart.current = performance.now()
            kick.current()
          }
          scheduleBlink()
        },
        3000 + Math.random() * 3000,
      )
    }
    scheduleBlink()

    return () => {
      alive = false
      look?.wakers.delete(wake)
      window.clearTimeout(blinkTimer)
      if (raf.current !== 0) window.cancelAnimationFrame(raf.current)
      raf.current = 0
      last.current = 0
    }
  }, [animated, lookRef])

  const hand = EXPRESSION_DEFS[expression].hand
  const cL = CX - EYE_DX
  const cR = CX + EYE_DX
  const id = (name: string): string => `${name}-${uid}`

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 240 270"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={`mascot-svg ${className ?? ''}`}
      data-hand={hand}
      data-expr={expression}
    >
      <defs>
        <radialGradient id={id('bg')} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#1b2d4d" />
          <stop offset="100%" stopColor="#0c1528" />
        </radialGradient>
        <radialGradient id={id('cheek')} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#b97c52" stopOpacity="1" />
          <stop offset="1" stopColor="#b97c52" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id('face')}>
          <path d={FACE} />
        </clipPath>
        <clipPath id={id('hair')}>
          <path d={HAIR_PATH} />
        </clipPath>
        <clipPath id={id('eyeL')}>
          <path data-k="clipL" d="" {...init.clipL} />
        </clipPath>
        <clipPath id={id('eyeR')}>
          <path data-k="clipR" d="" {...init.clipR} />
        </clipPath>
        <clipPath id={id('mouth')}>
          <path data-k="mouthClip" d="" {...init.mouthClip} />
        </clipPath>
      </defs>

      <circle cx="120" cy="116" r="108" fill={`url(#${id('bg')})`} stroke="#1f3054" strokeWidth="1.5" />
      <circle cx="120" cy="116" r="108" fill="none" stroke="#f0a832" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="2 7" />

      <g className="mascot-breathe">
        <g>
          <path
            d="M6 270V242C6 215 34 203 78 195C96 192 108 191 120 191C132 191 144 192 162 195C206 203 234 215 234 242V270Z"
            fill={SW}
          />
          <path
            d="M150 193C204 201 234 215 234 242V270H166C176 240 170 214 150 193Z"
            fill={SW_D}
            opacity="0.6"
          />
          <path d="M40 226C56 215 72 208 90 203" stroke={SW_L} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M22 252C30 238 44 230 58 227" stroke={SW_D} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M214 252C208 240 198 232 186 228" stroke={SW_D} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />

          <path
            d="M70 189C70 173 92 166 120 166C148 166 170 173 170 189C170 201 148 208 120 208C92 208 70 201 70 189Z"
            fill={SW}
          />
          <path d="M120 166C92 166 70 173 70 189C70 192 72 194 75 196C86 176 102 170 120 170Z" fill={SW_D} opacity="0.5" />
          <path
            d="M97 150V186C97 191 107 195 120 195C133 195 143 191 143 186V150Z"
            fill="#74492f"
          />
          <ellipse cx="120" cy="176" rx="26" ry="9" fill="#3d2518" opacity="0.55" />
          <path
            d="M70 189C70 201 92 208 120 208C148 208 170 201 170 189L143 187C143 192 133 196 120 196C107 196 97 192 97 187Z"
            fill={SW}
          />
          <path d={RIBS} stroke={SW_D} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.85" />
          <path
            d="M70 189C70 201 92 208 120 208C148 208 170 201 170 189"
            stroke={SW_D}
            strokeWidth="1.4"
            fill="none"
          />
          <path d="M97 187C97 192 107 196 120 196C133 196 143 192 143 187" stroke={SW_D} strokeWidth="1.4" fill="none" />
        </g>

        <g className="mascot-bob">
          <g data-k="head" {...init.head}>
            <ellipse cx="64.5" cy="111" rx="7.5" ry="13" fill={SKIN} stroke={SKIN_D} strokeWidth="1.2" />
            <ellipse cx="66" cy="111.5" rx="3.6" ry="8" fill={SKIN_D} opacity="0.6" />
            <ellipse cx="175.5" cy="111" rx="7.5" ry="13" fill={SKIN} stroke={SKIN_D} strokeWidth="1.2" />
            <ellipse cx="174" cy="111.5" rx="3.6" ry="8" fill={SKIN_D} opacity="0.7" />

            <path d={FACE} fill={SKIN} />
            <g clipPath={`url(#${id('face')})`}>
              <path d="M148 40C170 60 180 92 174 124C168 152 146 168 118 172L210 200L210 20Z" fill={SKIN_D} opacity="0.5" />
              <path d="M64 120C70 152 92 170 120 172C98 160 84 146 78 126Z" fill={SKIN_D} opacity="0.35" />
              <ellipse cx="90" cy="128" rx="17" ry="11" fill={SKIN_L} opacity="0.22" />
              <ellipse cx="104" cy="74" rx="26" ry="10" fill={SKIN_L} opacity="0.3" transform="rotate(-10 104 74)" />
              <ellipse cx={cL} cy={EYE_Y + 1} rx="21" ry="13" fill={SKIN_D} opacity="0.32" />
              <ellipse cx={cR} cy={EYE_Y + 1} rx="21" ry="13" fill={SKIN_D} opacity="0.4" />
              <ellipse cx="120" cy="162" rx="30" ry="11" fill="#2a1a12" opacity="0.2" />
              <ellipse cx="120" cy="141" rx="19" ry="4.2" fill="#2a1a12" opacity="0.18" />
              <ellipse cx="120" cy="164" rx="19" ry="7" fill="#21130d" opacity="0.2" />
              <path d="M70 128C74 148 88 160 104 164" stroke="#2a1a12" strokeOpacity="0.14" strokeWidth="9" fill="none" strokeLinecap="round" />
              <path d="M170 128C166 148 152 160 136 164" stroke="#2a1a12" strokeOpacity="0.16" strokeWidth="9" fill="none" strokeLinecap="round" />
              {STUBBLE.map((dot, index) => (
                <circle key={index} cx={num(dot.x)} cy={num(dot.y)} r={num(dot.r)} fill="#21130d" opacity="0.36" />
              ))}
              <ellipse data-k="cheekL" cx="87" cy="127" rx="14" ry="9" fill={`url(#${id('cheek')})`} opacity="0.1" {...init.cheekL} />
              <ellipse data-k="cheekR" cx="153" cy="127" rx="14" ry="9" fill={`url(#${id('cheek')})`} opacity="0.1" {...init.cheekR} />
            </g>
            <path d={FACE} fill="none" stroke={SKIN_D} strokeWidth="1.4" />

            <path d="M128 92C131 104 132 114 135.5 124" stroke={SKIN_D} strokeWidth="3.4" strokeOpacity="0.32" strokeLinecap="round" fill="none" />
            <ellipse cx="120" cy="127" rx="10.5" ry="7" fill={SKIN_L} opacity="0.4" />
            <path d="M101.5 127C95.5 135 100.5 143 110.5 141.5" stroke={SKIN_D} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M138.5 127C144.5 135 139.5 143 129.5 141.5" stroke={SKIN_D} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <ellipse cx="102.5" cy="133" rx="5.5" ry="7.5" fill="#2a1a12" opacity="0.2" />
            <ellipse cx="137.5" cy="133" rx="5.5" ry="7.5" fill="#2a1a12" opacity="0.26" />
            <ellipse cx="110.8" cy="138.5" rx="5.2" ry="2.9" transform="rotate(-16 110.8 138.5)" fill="#2a160f" />
            <ellipse cx="129.2" cy="138.5" rx="5.2" ry="2.9" transform="rotate(16 129.2 138.5)" fill="#2a160f" />
            <path d="M106 144Q120 149.5 134 144" stroke={SKIN_D} strokeWidth="2" strokeOpacity="0.55" strokeLinecap="round" fill="none" />

            <path data-k="dimpleL" d="" stroke={SKIN_D} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0" {...init.dimpleL} />
            <path data-k="dimpleR" d="" stroke={SKIN_D} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0" {...init.dimpleR} />
            <path data-k="mouthIn" d="" fill="#3a1319" {...init.mouthIn} />
            <g clipPath={`url(#${id('mouth')})`}>
              <rect data-k="teeth" x="90" y="146" width="60" height="0" fill="#f3ece1" {...init.teeth} />
              <ellipse data-k="tongue" cx="120" cy="156" rx="6" ry="0" fill="#b3484f" {...init.tongue} />
            </g>
            <path data-k="upperLip" d="" fill="#5f3226" stroke="#4a251c" strokeWidth="0.8" strokeLinejoin="round" {...init.upperLip} />
            <path data-k="lowerLip" d="" fill="#74402f" stroke="#4a251c" strokeWidth="0.8" strokeLinejoin="round" {...init.lowerLip} />
            <ellipse data-k="lipHl" cx="120" cy="154" rx="6" ry="1.5" fill="#a06448" opacity="0.5" {...init.lipHl} />
            <path data-k="mouthLine" d="" stroke="#2b120f" strokeWidth="1.2" strokeLinecap="round" fill="none" {...init.mouthLine} />
            <path data-k="chinCrease" d="" stroke={SKIN_D} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.4" {...init.chinCrease} />

            {([
              { s: 'L' as const, cx: cL },
              { s: 'R' as const, cx: cR },
            ]).map(({ s, cx }) => (
              <g key={s}>
                <path data-k={`crease${s}`} d="" stroke={SKIN_D} strokeWidth="1.5" strokeLinecap="round" fill="none" {...init[`crease${s}`]} />
                <g data-k={`ball${s}`} clipPath={`url(#${id(`eye${s}`)})`} {...init[`ball${s}`]}>
                  <rect x={cx - 16} y={EYE_Y - 20} width="32" height="32" fill="#efe6d8" />
                  <rect x={cx - 16} y={EYE_Y - 20} width="32" height="12" fill="#3a2418" opacity="0.18" />
                  <g data-k={`iris${s}`} {...init[`iris${s}`]}>
                    <circle cx={cx} cy={EYE_Y - 1.6} r="9.4" fill="#3b2415" />
                    <circle cx={cx} cy={EYE_Y - 1.6} r="6.9" fill="#2a170e" />
                    <circle cx={cx} cy={EYE_Y - 1.6} r="4" fill="#0b0605" />
                    <circle cx={cx + 3} cy={EYE_Y - 4.2} r="2.7" fill="#ffffff" />
                    <circle cx={cx - 3.2} cy={EYE_Y + 2.6} r="1.3" fill="#ffffff" opacity="0.75" />
                  </g>
                  <rect x={cx - 16} y={EYE_Y - 20} width="32" height="9" fill="#150e0b" opacity="0.28" />
                </g>
                <path data-k={`low${s}`} d="" stroke={SKIN_D} strokeWidth="1.3" strokeLinecap="round" fill="none" {...init[`low${s}`]} />
                <path data-k={`lash${s}`} d="" stroke={LASH} strokeWidth="2.7" strokeLinecap="round" fill="none" {...init[`lash${s}`]} />
                <path data-k={`arc${s}`} d="" stroke={LASH} strokeWidth="3.1" strokeLinecap="round" fill="none" opacity="0" {...init[`arc${s}`]} />
              </g>
            ))}

            <path data-k="browL" d="" fill={HAIR_C} stroke={HAIR_C} strokeWidth="1" strokeLinejoin="round" {...init.browL} />
            <path data-k="browR" d="" fill={HAIR_C} stroke={HAIR_C} strokeWidth="1" strokeLinejoin="round" {...init.browR} />

                                    <path d={HAIR_PATH} fill={HAIR_C} />
            <path d={HAIR.outer} fill="none" stroke="#2c4468" strokeWidth="1.1" strokeLinejoin="round" />
            <g clipPath={`url(#${id('hair')})`}>
              <path d="M140 20C176 34 186 70 174 112L210 120L210 10Z" fill="#0a0706" opacity="0.5" />
              <path d="M70 70C72 50 88 34 112 30" stroke={HAIR_L} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" />
              <path d="M84 56C92 46 104 41 118 40" stroke="#41322a" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.8" />
              <path d={CURLS} stroke="#46362c" strokeWidth="1.15" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M78 65C92 61 148 61 162 65" stroke="#0a0706" strokeWidth="2.2" fill="none" opacity="0.7" />
            </g>
          </g>
        </g>

        <g data-k="zzz" className="mascot-zzz" opacity="0" {...init.zzz}>
          <text x="182" y="62" fontSize="22" fontWeight="700" fill="#2dd4ff" fontFamily="ui-monospace, monospace">z</text>
          <text x="196" y="42" fontSize="16" fontWeight="700" fill="#2dd4ff" fontFamily="ui-monospace, monospace" opacity="0.8">z</text>
          <text x="207" y="26" fontSize="12" fontWeight="700" fill="#2dd4ff" fontFamily="ui-monospace, monospace" opacity="0.6">z</text>
        </g>

        <g className="mascot-hand hand-chin">
          <path d="M214 270C206 240 190 214 168 200" stroke={SW} strokeWidth="34" strokeLinecap="round" fill="none" />
          <path d="M225 270C217 242 204 224 186 210" stroke={SW_D} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.6" />
          <rect x="131" y="169" width="40" height="29" rx="13" transform="rotate(-18 151 183)" fill={SKIN} stroke={SKIN_D} strokeWidth="1.3" />
          <rect x="150" y="146" width="9" height="30" rx="4.5" transform="rotate(8 154 160)" fill={SKIN} stroke={SKIN_D} strokeWidth="1.3" />
          <path d="M141 180Q146 177 151 181M146 188Q151 185 157 189" stroke={SKIN_D} strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <ellipse cx="136" cy="185" rx="6.5" ry="5" fill={SKIN_L} stroke={SKIN_D} strokeWidth="1.2" />
        </g>

        <g className="mascot-hand hand-thumb">
          <path d="M218 270C212 248 204 232 192 222" stroke={SW} strokeWidth="38" strokeLinecap="round" fill="none" />
          <path d="M229 268C224 250 216 238 206 230" stroke={SW_D} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.6" />
          <rect x="172" y="160" width="15" height="48" rx="7.5" transform="rotate(-7 180 190)" fill={SKIN} stroke={SKIN_D} strokeWidth="1.3" />
          <path d="M175.5 168.5Q179 165 183.5 167" stroke={SKIN_D} strokeWidth="1.1" fill="none" strokeLinecap="round" />
          <rect x="165" y="192" width="44" height="34" rx="14" fill={SKIN} stroke={SKIN_D} strokeWidth="1.3" />
          <rect x="166" y="193" width="14" height="32" rx="7" fill={SKIN_L} opacity="0.35" />
          <path d="M184 201H204M184 209H206M185 217H203" stroke={SKIN_D} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.85" />
        </g>

        <g className="mascot-hand hand-wave">
          <path d="M206 270C204 240 206 214 210 192" stroke={SW} strokeWidth="34" strokeLinecap="round" fill="none" />
          <path d="M221 270C220 244 221 222 224 206" stroke={SW_D} strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.6" />
          <g className="mascot-wave">
            <rect x="196" y="156" width="28" height="38" rx="12" fill={SKIN} stroke={SKIN_D} strokeWidth="1.3" />
            <rect x="194" y="125" width="7.5" height="38" rx="3.75" transform="rotate(-9 198 160)" fill={SKIN} stroke={SKIN_D} strokeWidth="1.2" />
            <rect x="202" y="119" width="7.5" height="42" rx="3.75" transform="rotate(-2 206 160)" fill={SKIN} stroke={SKIN_D} strokeWidth="1.2" />
            <rect x="210" y="121" width="7.5" height="40" rx="3.75" transform="rotate(6 214 160)" fill={SKIN} stroke={SKIN_D} strokeWidth="1.2" />
            <rect x="218" y="129" width="7" height="34" rx="3.5" transform="rotate(14 221 160)" fill={SKIN} stroke={SKIN_D} strokeWidth="1.2" />
            <rect x="184" y="158" width="9" height="24" rx="4.5" transform="rotate(-40 188 170)" fill={SKIN_L} stroke={SKIN_D} strokeWidth="1.2" />
            <path d="M202 170Q210 175 218 170" stroke={SKIN_D} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.6" />
          </g>
        </g>
      </g>
    </svg>
  )
}
