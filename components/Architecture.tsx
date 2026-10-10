'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useId } from 'react'
import type { Dictionary } from '@/content/types'
import { desktopLayout, mobileLayout, type Layout } from '@/lib/architectureLayout'
import Section from './Section'

interface DiagramProps {
  readonly layout: Layout
  readonly dict: Dictionary
  readonly className: string
}

function Diagram({ layout, dict, className }: DiagramProps) {
  const reduce = useReducedMotion()
  const titleId = useId()
  const descId = useId()
  const t = (at: number) => (reduce ? 0 : at)

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      className={className}
    >
      <title id={titleId}>{dict.architecture.svgTitle}</title>
      <desc id={descId}>{dict.architecture.svgDesc}</desc>

      {layout.edges.map((edge) => (
        <g key={edge.id}>
          <motion.path
            d={edge.d}
            fill="none"
            stroke="#f0a832"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeDasharray={edge.dashed ? '5 5' : undefined}
            initial={{ pathLength: 0, opacity: 0.2 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: t(edge.at), duration: reduce ? 0.2 : 0.5, ease: 'easeInOut' }}
          />
          {edge.label ? (
            <motion.text
              x={edge.label.x}
              y={edge.label.y}
              textAnchor={edge.label.anchor}
              fill="#f7c060"
              fontSize={11}
              fontFamily="var(--font-jetbrains), monospace"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: t(edge.at + 0.3), duration: 0.4 }}
            >
              {dict.architecture.fallback}
            </motion.text>
          ) : null}
        </g>
      ))}

      {layout.nodes.map((node) => {
        const copy = dict.architecture.nodes[node.id]
        const left = node.x - node.w / 2
        const top = node.y - node.h / 2
        const hasSub = Boolean(copy.sub)
        return (
          <motion.g
            key={node.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: t(node.at), duration: 0.4 }}
          >
            <motion.rect
              x={left}
              y={top}
              width={node.w}
              height={node.h}
              rx={12}
              fill="#12306f"
              initial={{ stroke: '#2d5099', strokeWidth: 1.5 }}
              whileInView={{ stroke: node.emphasis ? '#f0a832' : '#c8901f', strokeWidth: node.emphasis ? 2.2 : 1.5 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: t(node.at + 0.15), duration: 0.5 }}
            />
            <text
              x={node.x}
              y={hasSub ? node.y - 3 : node.y + 5}
              textAnchor="middle"
              fill="#f4f6fb"
              fontSize={node.emphasis ? 18 : 15}
              fontWeight={600}
              fontFamily="var(--font-outfit), sans-serif"
            >
              {copy.title}
            </text>
            {copy.sub ? (
              <text
                x={node.x}
                y={node.y + 15}
                textAnchor="middle"
                fill="#bac7e4"
                fontSize={10.5}
                fontFamily="var(--font-jetbrains), monospace"
              >
                {copy.sub}
              </text>
            ) : null}
          </motion.g>
        )
      })}
    </svg>
  )
}

export default function Architecture({ dict }: { readonly dict: Dictionary }) {
  return (
    <Section
      id="architecture"
      index={5}
      tone="navy"
      label={dict.nav.architecture}
      title={dict.architecture.title}
      intro={dict.architecture.intro}
    >
      <div className="rounded-2xl border border-line2 bg-bg2 p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] md:p-8">
        <Diagram layout={desktopLayout} dict={dict} className="mx-auto hidden h-auto w-full max-w-4xl md:block" />
        <Diagram layout={mobileLayout} dict={dict} className="mx-auto block h-auto w-full max-w-sm md:hidden" />
      </div>
    </Section>
  )
}
