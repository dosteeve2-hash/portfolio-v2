export const EXPRESSIONS = [
  'neutral',
  'happy',
  'laugh',
  'wow',
  'thinking',
  'wink',
  'proud',
  'wave',
  'curious',
  'sleepy',
] as const

export type Expression = (typeof EXPRESSIONS)[number]

export type Hand = 'none' | 'wave' | 'chin' | 'thumb'

export interface LookVector {
  x: number
  y: number
}

export interface Pose {
  browLy: number
  browLt: number
  browRy: number
  browRt: number
  openL: number
  openR: number
  smileL: number
  smileR: number
  squint: number
  lookX: number
  lookY: number
  mouthW: number
  mouthS: number
  mouthO: number
  mouthR: number
  mouthX: number
  cheeks: number
  tilt: number
  headX: number
  headY: number
  zzz: number
}

export type PoseKey = keyof Pose

export const POSE_KEYS: readonly PoseKey[] = [
  'browLy',
  'browLt',
  'browRy',
  'browRt',
  'openL',
  'openR',
  'smileL',
  'smileR',
  'squint',
  'lookX',
  'lookY',
  'mouthW',
  'mouthS',
  'mouthO',
  'mouthR',
  'mouthX',
  'cheeks',
  'tilt',
  'headX',
  'headY',
  'zzz',
]

const BASE: Pose = {
  browLy: 0,
  browLt: 0,
  browRy: 0,
  browRt: 0,
  openL: 1,
  openR: 1,
  smileL: 0,
  smileR: 0,
  squint: 0,
  lookX: 0,
  lookY: 0,
  mouthW: 13.5,
  mouthS: 0.4,
  mouthO: 0,
  mouthR: 0,
  mouthX: 0,
  cheeks: 0.1,
  tilt: 0,
  headX: 0,
  headY: 0,
  zzz: 0,
}

function pose(overrides: Partial<Pose>): Pose {
  return { ...BASE, ...overrides }
}

export interface ExpressionDef {
  readonly pose: Pose
  readonly hand: Hand
}

export const EXPRESSION_DEFS: Readonly<Record<Expression, ExpressionDef>> = {
  neutral: { pose: pose({}), hand: 'none' },
  happy: {
    pose: pose({
      browLy: -3,
      browRy: -3,
      squint: 0.45,
      mouthW: 14.5,
      mouthS: 1.05,
      mouthO: 0.12,
      cheeks: 0.38,
      tilt: 1.5,
    }),
    hand: 'none',
  },
  laugh: {
    pose: pose({
      browLy: -3.5,
      browRy: -3.5,
      smileL: 1,
      smileR: 1,
      squint: 1,
      mouthW: 17,
      mouthS: 1.1,
      mouthO: 0.95,
      mouthR: 0.2,
      cheeks: 0.55,
      tilt: -3,
      headY: -1,
    }),
    hand: 'none',
  },
  wow: {
    pose: pose({
      browLy: -6,
      browRy: -6,
      browLt: -1.5,
      browRt: -1.5,
      openL: 1.12,
      openR: 1.12,
      mouthW: 8.5,
      mouthS: -0.15,
      mouthO: 1.05,
      mouthR: 1,
      cheeks: 0.05,
      headY: -2,
    }),
    hand: 'none',
  },
  thinking: {
    pose: pose({
      browLy: 1,
      browRy: -6,
      browRt: -1.5,
      openL: 0.9,
      openR: 0.95,
      lookX: 0.75,
      lookY: -0.95,
      mouthW: 7,
      mouthS: -0.1,
      mouthX: 6,
      cheeks: 0.05,
      tilt: 3.5,
      headX: -1.5,
    }),
    hand: 'chin',
  },
  wink: {
    pose: pose({
      browLy: -2,
      browRy: 3.5,
      openR: 0,
      smileR: 1,
      squint: 0.3,
      mouthW: 14,
      mouthS: 1.1,
      mouthX: 1.5,
      cheeks: 0.4,
      tilt: -4,
    }),
    hand: 'none',
  },
  proud: {
    pose: pose({
      browLy: -4,
      browRy: -4,
      squint: 0.55,
      mouthW: 15.5,
      mouthS: 1.15,
      mouthO: 0.28,
      cheeks: 0.42,
      tilt: -3.5,
      headY: -2,
    }),
    hand: 'thumb',
  },
  wave: {
    pose: pose({
      browLy: -5,
      browRy: -5,
      squint: 0.25,
      mouthW: 15,
      mouthS: 1.1,
      mouthO: 0.5,
      mouthR: 0.15,
      cheeks: 0.35,
      tilt: 2,
    }),
    hand: 'wave',
  },
  curious: {
    pose: pose({
      browLy: 1.5,
      browRy: -6,
      browRt: -1.5,
      browLt: 1,
      openL: 0.95,
      openR: 1.1,
      lookX: 0.5,
      lookY: -0.2,
      mouthW: 9,
      mouthS: 0.55,
      mouthO: 0.2,
      mouthR: 0.25,
      mouthX: 3,
      cheeks: 0.05,
      tilt: 8,
      headX: 2,
    }),
    hand: 'none',
  },
  sleepy: {
    pose: pose({
      browLy: 2.5,
      browRy: 2.5,
      browLt: -1.8,
      browRt: -1.8,
      openL: 0.22,
      openR: 0.22,
      lookY: 0.6,
      mouthW: 10,
      mouthS: 0.05,
      mouthO: 0.1,
      mouthR: 0.25,
      cheeks: 0.05,
      tilt: 5,
      headY: 4,
      zzz: 1,
    }),
    hand: 'none',
  },
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

const f = (n: number): string => (Math.round(n * 100) / 100).toString()

export const CX = 120
export const EYE_Y = 103
export const EYE_DX = 26
export const MOUTH_Y = 149

export interface EyeGeo {
  readonly fill: string
  readonly upper: string
  readonly lower: string
  readonly crease: string
  readonly arc: string
}

export function eyeGeo(cx: number, open: number, squint: number): EyeGeo {
  const y0 = EYE_Y + 1.5
  const x0 = cx - 13.5
  const x1 = cx + 13.5
  const o = Math.max(0, open)
  const h1 = 15.5 * o * (1 - 0.3 * squint)
  const h2 = 9 * o * (1 - 0.6 * squint)
  const upper = `M${f(x0)} ${f(y0)}C${f(x0 + 5)} ${f(y0 - h1)} ${f(x1 - 5)} ${f(y0 - h1)} ${f(x1)} ${f(y0)}`
  const tail = `C${f(x1 - 6)} ${f(y0 + h2)} ${f(x0 + 6)} ${f(y0 + h2)} ${f(x0)} ${f(y0)}Z`
  const lower = `M${f(x1)} ${f(y0)}C${f(x1 - 6)} ${f(y0 + h2 + 1.2)} ${f(x0 + 6)} ${f(y0 + h2 + 1.2)} ${f(x0)} ${f(y0)}`
  const crease = `M${f(x0 + 2)} ${f(y0 - 3.2)}C${f(x0 + 7)} ${f(y0 - h1 - 5)} ${f(x1 - 7)} ${f(y0 - h1 - 5)} ${f(x1 - 1)} ${f(y0 - 3.2)}`
  const arc = `M${f(x0 + 0.5)} ${f(y0 + 3.5)}Q${f(cx)} ${f(y0 - 12)} ${f(x1 - 0.5)} ${f(y0 + 3.5)}`
  return { fill: upper + tail, upper, lower, crease, arc }
}

export function browPath(side: 'L' | 'R', lift: number, tilt: number): string {
  const flip = (x: number): number => (side === 'L' ? x : 240 - x)
  const inner = { x: 112.5, y: 87.5 + lift + tilt }
  const ctrl = { x: 92, y: 78 + lift }
  const outer = { x: 69.5, y: 87 + lift }
  const steps = 10
  const top: string[] = []
  const bottom: string[] = []
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps
    const u = 1 - t
    // t=0 : extrémité externe, t=1 : extrémité interne
    const x = u * u * outer.x + 2 * u * t * ctrl.x + t * t * inner.x
    const y = u * u * outer.y + 2 * u * t * ctrl.y + t * t * inner.y
    const dx = 2 * u * (ctrl.x - outer.x) + 2 * t * (inner.x - ctrl.x)
    const dy = 2 * u * (ctrl.y - outer.y) + 2 * t * (inner.y - ctrl.y)
    const len = Math.hypot(dx, dy) || 1
    const nx = -dy / len
    const ny = dx / len
    const half = 1.3 + 1.9 * Math.pow(t, 0.75)
    top.push(`${f(flip(x + nx * half))} ${f(y + ny * half)}`)
    bottom.push(`${f(flip(x - nx * half))} ${f(y - ny * half)}`)
  }
  return `M${top.join('L')}L${bottom.reverse().join('L')}Z`
}

export interface MouthGeo {
  readonly interior: string
  readonly upperLip: string
  readonly lowerLip: string
  readonly line: string
  readonly dimpleL: string
  readonly dimpleR: string
  readonly teethY: number
  readonly teethH: number
  readonly tongueCy: number
  readonly tongueRx: number
  readonly tongueRy: number
  readonly highlightY: number
  readonly chinY: number
  readonly x0: number
  readonly x1: number
}

function control(mid: number, cornerY: number): number {
  return (4 * mid - cornerY) / 3
}

export function mouthGeo(pose: Pose): MouthGeo {
  const cx = CX + pose.mouthX
  const w = Math.max(3, pose.mouthW)
  const s = pose.mouthS
  const o = clamp(pose.mouthO, 0, 1.1)
  const cornerY = MOUTH_Y - s * 5.5
  const topMid = MOUTH_Y + s * 1.6 - o * 1.2
  const botMid = topMid + o * 15
  const k = 0.5 + clamp(pose.mouthR, 0, 1) * 0.85
  const cT = control(topMid, cornerY)
  const cB = control(botMid, cornerY)
  const xl = cx - w
  const xr = cx + w
  const topEdge = `C${f(cx - w * k)} ${f(cT)} ${f(cx + w * k)} ${f(cT)} ${f(xr)} ${f(cornerY)}`
  const botEdgeRev = `C${f(cx + w * k)} ${f(cB)} ${f(cx - w * k)} ${f(cB)} ${f(xl)} ${f(cornerY)}`
  const interior = `M${f(xl)} ${f(cornerY)}${topEdge}${botEdgeRev}Z`

  const tU = 5.2
  const peakY = topMid - tU * 1.05
  const dipY = topMid - tU * 0.62
  const edgeY = cT - tU * 1.15
  const upperLip =
    `M${f(xl)} ${f(cornerY)}` +
    `Q${f(cx - w * 0.55)} ${f(edgeY)} ${f(cx - 3.6)} ${f(peakY)}` +
    `Q${f(cx - 1.6)} ${f(peakY - 0.3)} ${f(cx)} ${f(dipY)}` +
    `Q${f(cx + 1.6)} ${f(peakY - 0.3)} ${f(cx + 3.6)} ${f(peakY)}` +
    `Q${f(cx + w * 0.55)} ${f(edgeY)} ${f(xr)} ${f(cornerY)}` +
    `C${f(cx + w * k)} ${f(cT)} ${f(cx - w * k)} ${f(cT)} ${f(xl)} ${f(cornerY)}Z`

  const tL = 7.6
  const lowMid = botMid + tL
  const cLow = control(lowMid, cornerY + 0.8)
  const lowerLip =
    `M${f(xr)} ${f(cornerY)}` +
    `C${f(cx + w * k)} ${f(cB)} ${f(cx - w * k)} ${f(cB)} ${f(xl)} ${f(cornerY)}` +
    `C${f(cx - w * 0.85)} ${f(cLow)} ${f(cx + w * 0.85)} ${f(cLow)} ${f(xr)} ${f(cornerY)}Z`

  const line = `M${f(xl)} ${f(cornerY)}C${f(cx - w * k)} ${f(cT)} ${f(cx + w * k)} ${f(cT)} ${f(xr)} ${f(cornerY)}`
  const dimple = (x: number, dir: 1 | -1): string =>
    `M${f(x + dir * 1.6)} ${f(cornerY - 2.4)}q${f(dir * 2.6)} ${f(3.2)} ${f(dir * 0.4)} ${f(6.2)}`

  return {
    interior,
    upperLip,
    lowerLip,
    line,
    dimpleL: dimple(xl, -1),
    dimpleR: dimple(xr, 1),
    teethY: topMid - 2,
    teethH: Math.min(6.5, o * 11),
    tongueCy: botMid - 0.5,
    tongueRx: w * 0.55,
    tongueRy: Math.max(0, o * 6),
    highlightY: botMid + 2.6,
    chinY: lowMid + 4.5,
    x0: xl,
    x1: xr,
  }
}
