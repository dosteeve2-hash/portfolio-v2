export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value))
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

export function easeOutCubic(t: number): number {
  return 1 - (1 - clamp(t)) ** 3
}

/** 0 quand le haut de l'élément touche le bas de l'écran, 1 quand son bas quitte le haut de l'écran. */
export function sectionProgress(rectTop: number, height: number, viewport: number): number {
  const travel = viewport + height
  return travel <= 0 ? 0 : clamp((viewport - rectTop) / travel)
}

/** Progression d'une scène épinglée : 0 à l'accroche, 1 au décrochage (le cadre sticky a la hauteur de l'écran). */
export function pinnedProgress(rectTop: number, height: number, viewport: number): number {
  const travel = height - viewport
  return travel <= 0 ? 1 : clamp(-rectTop / travel)
}

export function formatCount(value: number, locale?: string, decimals = 0): string {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)
}

export interface Bounds {
  readonly minX: number
  readonly maxX: number
  readonly minY: number
  readonly maxY: number
}

export interface Motion2D {
  readonly x: number
  readonly y: number
  readonly vx: number
  readonly vy: number
}

/** Un pas d'inertie : frottement exponentiel indépendant de la cadence, rebond amorti sur les bords. */
export function stepInertia(state: Motion2D, dtMs: number, bounds: Bounds, friction = 0.92, bounce = 0.45): Motion2D {
  const decay = friction ** (dtMs / 16)
  let { x, y, vx, vy } = state
  x += vx * dtMs
  y += vy * dtMs
  vx *= decay
  vy *= decay
  if (x < bounds.minX) {
    x = bounds.minX
    vx = Math.abs(vx) * bounce
  } else if (x > bounds.maxX) {
    x = bounds.maxX
    vx = -Math.abs(vx) * bounce
  }
  if (y < bounds.minY) {
    y = bounds.minY
    vy = Math.abs(vy) * bounce
  } else if (y > bounds.maxY) {
    y = bounds.maxY
    vy = -Math.abs(vy) * bounce
  }
  return { x, y, vx, vy }
}

export function isResting(state: Motion2D, threshold = 0.01): boolean {
  return Math.hypot(state.vx, state.vy) < threshold
}

/** Découpe un texte en mots en gardant les espaces simples (le rendu les remet entre les mots). */
export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter((word) => word.length > 0)
}
