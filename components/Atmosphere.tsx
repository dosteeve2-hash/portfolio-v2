'use client'

import { useEffect, useRef } from 'react'

function lightEffectsAllowed(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return false
  if (navigator.hardwareConcurrency <= 2) return false
  return true
}

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || !lightEffectsAllowed()) return undefined
    let targetX = -1000
    let targetY = -1000
    let x = targetX
    let y = targetY
    let raf = 0
    let seen = false

    const frame = () => {
      raf = 0
      x += (targetX - x) * 0.14
      y += (targetY - y) * 0.14
      node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      if (Math.abs(targetX - x) > 0.4 || Math.abs(targetY - y) > 0.4) raf = window.requestAnimationFrame(frame)
    }
    const kick = () => {
      if (raf === 0) raf = window.requestAnimationFrame(frame)
    }
    const onMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      if (!seen) {
        seen = true
        x = targetX
        y = targetY
        node.style.opacity = '1'
      }
      kick()
    }
    const onLeave = () => {
      node.style.opacity = '0'
      seen = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      if (raf !== 0) window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 -ml-[260px] -mt-[260px] h-[520px] w-[520px] opacity-0 transition-opacity duration-500"
      style={{
        background:
          'radial-gradient(circle, rgba(29,78,216,0.09) 0%, rgba(29,78,216,0.04) 26%, rgba(240,168,50,0.03) 48%, transparent 68%)',
        willChange: 'transform',
      }}
    />
  )
}

function SpotlightController() {
  useEffect(() => {
    if (!lightEffectsAllowed()) return undefined
    let raf = 0
    let pending: { card: HTMLElement; x: number; y: number } | null = null

    const flush = () => {
      raf = 0
      if (!pending) return
      const box = pending.card.getBoundingClientRect()
      pending.card.style.setProperty('--mx', `${(pending.x - box.left).toFixed(0)}px`)
      pending.card.style.setProperty('--my', `${(pending.y - box.top).toFixed(0)}px`)
      pending = null
    }
    const onMove = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const card = target.closest<HTMLElement>('[data-spotlight]')
      if (!card) return
      pending = { card, x: event.clientX, y: event.clientY }
      if (raf === 0) raf = window.requestAnimationFrame(flush)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      if (raf !== 0) window.cancelAnimationFrame(raf)
    }
  }, [])

  return null
}

export default function Atmosphere() {
  return (
    <>
      <CursorGlow />
      <SpotlightController />
    </>
  )
}
