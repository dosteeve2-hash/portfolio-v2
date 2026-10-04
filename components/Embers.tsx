'use client'

import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 24

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  age: number
  ttl: number
}

function spawn(width: number, height: number, fromStart: boolean): Particle {
  const ttl = 4 + Math.random() * 4
  return {
    x: Math.random() * width,
    y: height * (0.55 + Math.random() * 0.5),
    vx: (Math.random() - 0.5) * 8,
    vy: -(10 + Math.random() * 22),
    radius: 1 + Math.random() * 1.8,
    age: fromStart ? Math.random() * ttl : 0,
    ttl,
  }
}

export default function Embers() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    const host = canvas?.parentElement
    if (!canvas || !context || !host) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cores = navigator.hardwareConcurrency ?? 4
    if (reduceMotion || cores <= 2) return

    let width = 0
    let height = 0
    let frame = 0
    let last = 0
    let inView = true
    let particles: Particle[] = []

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = host.clientWidth
      height = host.clientHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      particles = Array.from({ length: PARTICLE_COUNT }, () => spawn(width, height, true))
    }

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      context.clearRect(0, 0, width, height)
      context.globalCompositeOperation = 'lighter'
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]
        if (!p) continue
        p.age += dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        if (p.age >= p.ttl || p.y < -10) {
          particles[i] = spawn(width, height, false)
          continue
        }
        const progress = p.age / p.ttl
        const alpha = Math.sin(progress * Math.PI) * 0.7
        const glow = p.radius * 5
        const gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow)
        gradient.addColorStop(0, `rgba(247, 192, 96, ${alpha})`)
        gradient.addColorStop(0.4, `rgba(240, 168, 50, ${alpha * 0.35})`)
        gradient.addColorStop(1, 'rgba(240, 168, 50, 0)')
        context.fillStyle = gradient
        context.beginPath()
        context.arc(p.x, p.y, glow, 0, Math.PI * 2)
        context.fill()
      }
      frame = requestAnimationFrame(draw)
    }

    const shouldRun = () => inView && document.visibilityState === 'visible'

    const sync = () => {
      cancelAnimationFrame(frame)
      if (shouldRun()) {
        last = performance.now()
        frame = requestAnimationFrame(draw)
      }
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    const intersection = new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting)
      sync()
    })
    intersection.observe(host)
    document.addEventListener('visibilitychange', sync)
    sync()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
}
