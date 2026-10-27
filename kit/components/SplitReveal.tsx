'use client'

import { Fragment, useEffect, useRef, type CSSProperties, type ElementType } from 'react'
import { useReducedMotion } from '@/kit/hooks/useReducedMotion'
import { batchLayout, EASE, inViewport, onFirstView } from '@/kit/lib/dom'
import { splitWords } from '@/kit/lib/math'

export interface SplitRevealProps {
  readonly text: string
  readonly as?: ElementType
  readonly by?: 'word' | 'char'
  /** Décalage entre deux unités, en secondes. */
  readonly stagger?: number
  readonly delay?: number
  readonly duration?: number
  readonly className?: string
}

const maskStyle: CSSProperties = {
  display: 'inline-block',
  overflow: 'hidden',
  verticalAlign: 'top',
  paddingBottom: '0.14em',
  marginBottom: '-0.14em',
}

/**
 * Texte révélé mot à mot (ou lettre à lettre) : chaque unité monte de derrière un masque.
 * Le lecteur d'écran lit le texte entier (aria-label) ; sans JavaScript ou en mouvement réduit, le texte est déjà en place.
 */
export default function SplitReveal({
  text,
  as: Tag = 'span',
  by = 'word',
  stagger = 0.06,
  delay = 0,
  duration = 0.8,
  className,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const words = splitWords(text)

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return undefined
    const units = Array.from(root.querySelectorAll<HTMLElement>('[data-mk-unit]'))
    if (units.length === 0) return undefined
    let cancelled = false
    let dispose: (() => void) | undefined
    let timer = 0
    batchLayout(() => {
      if (cancelled || inViewport(root, 40)) return undefined
      return () => {
        for (const unit of units) {
          unit.style.transition = 'none'
          unit.style.transform = 'translate3d(0, 112%, 0)'
        }
        dispose = onFirstView(root, () => {
          units.forEach((unit, i) => {
            unit.style.transition = `transform ${duration}s ${EASE} ${delay + i * stagger}s`
            unit.style.transform = ''
          })
          timer = window.setTimeout(() => {
            for (const unit of units) unit.style.transition = ''
          }, (duration + delay + units.length * stagger + 0.1) * 1000)
        })
      }
    })
    return () => {
      cancelled = true
      dispose?.()
      window.clearTimeout(timer)
      for (const unit of units) {
        unit.style.transition = ''
        unit.style.transform = ''
      }
    }
  }, [reduced, text, by, stagger, delay, duration])

  return (
    <Tag ref={ref} aria-label={text} className={className}>
      {words.map((word, wi) => (
        <Fragment key={`${wi}-${word}`}>
          {wi > 0 ? ' ' : null}
          <span aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {by === 'char' ? (
              Array.from(word).map((char, ci) => (
                <span key={ci} style={maskStyle}>
                  <span data-mk-unit="" style={{ display: 'inline-block' }}>
                    {char}
                  </span>
                </span>
              ))
            ) : (
              <span style={maskStyle}>
                <span data-mk-unit="" style={{ display: 'inline-block' }}>
                  {word}
                </span>
              </span>
            )}
          </span>
        </Fragment>
      ))}
    </Tag>
  )
}
