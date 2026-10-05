'use client'

import { useEffect, useRef, useState } from 'react'

interface TypedLineProps {
  readonly lead: string
  readonly labels: readonly string[]
  readonly start: boolean
  readonly reduceMotion: boolean
}

const TYPE_MS = 48
const ERASE_MS = 24
const HOLD_MS = 1800
const GAP_MS = 320

function Caret() {
  return <span aria-hidden="true" className="mascot-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-gold" />
}

export default function TypedLine({ lead, labels, start, reduceMotion }: TypedLineProps) {
  const [leadCount, setLeadCount] = useState(0)
  const [labelIndex, setLabelIndex] = useState(0)
  const [labelCount, setLabelCount] = useState(0)
  const [phase, setPhase] = useState<'lead' | 'typing' | 'holding' | 'erasing'>('lead')
  const [onScreen, setOnScreen] = useState(true)
  const rootRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const node = rootRef.current
    if (!node || reduceMotion) return undefined
    let inView = true
    const sync = () => setOnScreen(inView && document.visibilityState === 'visible')
    const observer = new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting)
      sync()
    })
    observer.observe(node)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion || !start || !onScreen || phase !== 'lead') return undefined
    if (leadCount >= lead.length) {
      const id = window.setTimeout(() => setPhase('typing'), 380)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setLeadCount((count) => count + 1), leadCount === 0 ? 250 : 38)
    return () => window.clearTimeout(id)
  }, [start, reduceMotion, onScreen, phase, leadCount, lead.length])

  useEffect(() => {
    if (reduceMotion || !onScreen || phase === 'lead') return undefined
    const current = labels[labelIndex] ?? ''
    if (phase === 'typing') {
      if (labelCount >= current.length) {
        const id = window.setTimeout(() => setPhase('holding'), 0)
        return () => window.clearTimeout(id)
      }
      const id = window.setTimeout(() => setLabelCount((count) => count + 1), TYPE_MS)
      return () => window.clearTimeout(id)
    }
    if (phase === 'holding') {
      const id = window.setTimeout(() => setPhase('erasing'), HOLD_MS)
      return () => window.clearTimeout(id)
    }
    if (labelCount <= 0) {
      const id = window.setTimeout(() => {
        setLabelIndex((index) => (index + 1) % Math.max(1, labels.length))
        setPhase('typing')
      }, GAP_MS)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setLabelCount((count) => count - 1), ERASE_MS)
    return () => window.clearTimeout(id)
  }, [reduceMotion, onScreen, phase, labelCount, labelIndex, labels])

  const longest = labels.reduce((best, label) => (label.length > best.length ? label : best), '')
  const shownLead = reduceMotion ? lead : lead.slice(0, leadCount)
  const shownLabel = reduceMotion ? (labels[0] ?? '') : (labels[labelIndex] ?? '').slice(0, labelCount)
  const leadActive = !reduceMotion && phase === 'lead' && start && onScreen

  return (
    <>
      <p ref={rootRef} className="font-display text-2xl italic text-gold2 sm:text-3xl">
        <span className="sr-only">{lead}</span>
        <span aria-hidden="true" className="relative inline-block">
          <span className="invisible">{lead}</span>
          <span className="absolute inset-0">
            {shownLead}
            {leadActive ? <Caret /> : null}
          </span>
        </span>
      </p>
      <p className="mt-3 font-mono text-sm tracking-wide text-cyan">
        <span className="sr-only">{labels.join(' · ')}</span>
        <span aria-hidden="true" className="relative inline-block">
          <span className="invisible">{longest}</span>
          <span className="absolute inset-0 whitespace-nowrap">
            {shownLabel}
            {!reduceMotion && onScreen && phase !== 'lead' ? <Caret /> : null}
          </span>
        </span>
      </p>
    </>
  )
}
