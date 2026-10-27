'use client'

import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'
import { clamp, isResting, stepInertia, type Bounds, type Motion2D } from '@/kit/lib/math'

export interface Sticker {
  readonly id: string
  /** Position de départ en % de la zone (coin haut-gauche de l'élément). */
  readonly x: number
  readonly y: number
  /** Inclinaison en degrés. */
  readonly rotate?: number
  readonly children: ReactNode
  /** Nom lu par les lecteurs d'écran. */
  readonly label: string
  readonly className?: string
}

export interface DragStickersProps {
  readonly items: readonly Sticker[]
  readonly className?: string
  readonly style?: CSSProperties
  /** Frottement de l'inertie (0,92 par défaut ; plus proche de 1 = glisse plus longtemps). */
  readonly friction?: number
}

interface DragState {
  pointerId: number
  lastX: number
  lastY: number
  lastT: number
  vx: number
  vy: number
}

const KEY_STEP = 12

/**
 * Éléments déplaçables avec inertie (autocollants, post-it, étiquettes). Le déplacement est
 * piloté au pointeur (souris, doigt, stylet) et au clavier (flèches, Maj pour aller plus vite).
 * Le mouvement est appliqué en transform ; la boucle d'inertie ne tourne que le temps du lancer.
 * En mouvement réduit, il n'y a pas d'inertie : l'élément s'arrête où on le lâche.
 */
export default function DragStickers({ items, className, style, friction = 0.92 }: DragStickersProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const nodes = useRef(new Map<string, HTMLElement>())
  const offsets = useRef(new Map<string, Motion2D>())
  const drags = useRef(new Map<string, DragState>())
  const rafs = useRef(new Map<string, number>())
  const topZ = useRef(10)
  const reduced = useReducedMotion()

  const paint = (id: string, rotate: number) => {
    const node = nodes.current.get(id)
    const o = offsets.current.get(id)
    if (!node || !o) return
    node.style.transform = `translate3d(${o.x.toFixed(1)}px, ${o.y.toFixed(1)}px, 0) rotate(${rotate}deg)`
  }

  const boundsFor = (id: string): Bounds | null => {
    const area = areaRef.current
    const node = nodes.current.get(id)
    const o = offsets.current.get(id)
    if (!area || !node || !o) return null
    const a = area.getBoundingClientRect()
    const n = node.getBoundingClientRect()
    // n.left inclut déjà l'offset courant : on le retire pour obtenir la position de repos.
    const baseLeft = n.left - o.x
    const baseTop = n.top - o.y
    return {
      minX: a.left - baseLeft,
      maxX: a.right - n.width - baseLeft,
      minY: a.top - baseTop,
      maxY: a.bottom - n.height - baseTop,
    }
  }

  const move = (id: string, rotate: number, dx: number, dy: number) => {
    const o = offsets.current.get(id) ?? { x: 0, y: 0, vx: 0, vy: 0 }
    const b = boundsFor(id)
    offsets.current.set(id, {
      ...o,
      x: b ? clamp(o.x + dx, b.minX, b.maxX) : o.x + dx,
      y: b ? clamp(o.y + dy, b.minY, b.maxY) : o.y + dy,
    })
    paint(id, rotate)
  }

  const launch = (id: string, rotate: number, vx: number, vy: number) => {
    const bounds = boundsFor(id)
    if (!bounds) return
    let state: Motion2D = { ...(offsets.current.get(id) ?? { x: 0, y: 0 }), vx, vy }
    let last = 0
    const tick = (now: number) => {
      const dt = last === 0 ? 16 : Math.min(48, now - last)
      last = now
      state = stepInertia(state, dt, bounds, friction)
      offsets.current.set(id, state)
      paint(id, rotate)
      if (isResting(state)) rafs.current.delete(id)
      else rafs.current.set(id, window.requestAnimationFrame(tick))
    }
    rafs.current.set(id, window.requestAnimationFrame(tick))
  }

  const stopInertia = (id: string) => {
    const raf = rafs.current.get(id)
    if (raf !== undefined) window.cancelAnimationFrame(raf)
    rafs.current.delete(id)
  }

  useEffect(() => {
    const running = rafs.current
    return () => {
      for (const raf of running.values()) window.cancelAnimationFrame(raf)
      running.clear()
    }
  }, [])

  const onDown = (event: PointerEvent<HTMLElement>, sticker: Sticker) => {
    if (event.button !== 0) return
    stopInertia(sticker.id)
    event.currentTarget.setPointerCapture(event.pointerId)
    topZ.current += 1
    event.currentTarget.style.zIndex = String(topZ.current)
    event.currentTarget.style.cursor = 'grabbing'
    drags.current.set(sticker.id, {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: event.timeStamp,
      vx: 0,
      vy: 0,
    })
  }

  const onMove = (event: PointerEvent<HTMLElement>, sticker: Sticker) => {
    const drag = drags.current.get(sticker.id)
    if (!drag || drag.pointerId !== event.pointerId) return
    const now = event.timeStamp
    const dt = Math.max(1, now - drag.lastT)
    const dx = event.clientX - drag.lastX
    const dy = event.clientY - drag.lastY
    drag.vx = 0.7 * drag.vx + 0.3 * (dx / dt)
    drag.vy = 0.7 * drag.vy + 0.3 * (dy / dt)
    drag.lastX = event.clientX
    drag.lastY = event.clientY
    drag.lastT = now
    move(sticker.id, sticker.rotate ?? 0, dx, dy)
  }

  const onUp = (event: PointerEvent<HTMLElement>, sticker: Sticker) => {
    const drag = drags.current.get(sticker.id)
    if (!drag || drag.pointerId !== event.pointerId) return
    drags.current.delete(sticker.id)
    event.currentTarget.style.cursor = 'grab'
    const idle = event.timeStamp - drag.lastT > 90
    if (!reduced && !idle && Math.hypot(drag.vx, drag.vy) > 0.05) launch(sticker.id, sticker.rotate ?? 0, drag.vx, drag.vy)
  }

  const onKey = (event: KeyboardEvent<HTMLElement>, sticker: Sticker) => {
    const step = event.shiftKey ? KEY_STEP * 3 : KEY_STEP
    const deltas: Record<string, readonly [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    const delta = deltas[event.key]
    if (!delta) return
    event.preventDefault()
    stopInertia(sticker.id)
    move(sticker.id, sticker.rotate ?? 0, delta[0], delta[1])
  }

  return (
    <div ref={areaRef} className={className} style={{ position: 'relative', ...style }}>
      {items.map((sticker) => (
        <div
          key={sticker.id}
          ref={(node) => {
            if (node) nodes.current.set(sticker.id, node)
            else nodes.current.delete(sticker.id)
          }}
          role="button"
          tabIndex={0}
          aria-roledescription="élément déplaçable"
          aria-label={sticker.label}
          className={sticker.className}
          onPointerDown={(event) => onDown(event, sticker)}
          onPointerMove={(event) => onMove(event, sticker)}
          onPointerUp={(event) => onUp(event, sticker)}
          onPointerCancel={(event) => onUp(event, sticker)}
          onKeyDown={(event) => onKey(event, sticker)}
          style={{
            position: 'absolute',
            left: `${sticker.x}%`,
            top: `${sticker.y}%`,
            transform: `rotate(${sticker.rotate ?? 0}deg)`,
            touchAction: 'none',
            pointerEvents: 'auto',
            cursor: 'grab',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            willChange: 'transform',
          }}
        >
          {sticker.children}
        </div>
      ))}
    </div>
  )
}
