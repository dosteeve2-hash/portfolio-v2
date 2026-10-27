import { useId } from 'react'
import type { Dictionary } from '@/content/types'
import { desktopLayout, mobileLayout, type Layout } from '@/lib/architectureLayout'
import Reveal from './Reveal'
import Section from './Section'

interface DiagramProps {
  readonly layout: Layout
  readonly dict: Dictionary
  readonly className: string
}

/**
 * Schéma d'architecture au trait : chaque lien se trace (stroke-dashoffset), chaque bloc apparaît
 * (opacity), l'ensemble se déclenche quand le conteneur Reveal reçoit `data-shown`. Aucun JavaScript d'animation.
 */
function Diagram({ layout, dict, className }: DiagramProps) {
  const titleId = useId()
  const descId = useId()

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
        <g key={edge.id} style={{ '--d': `${edge.at * 0.7}s` } as React.CSSProperties}>
          <path
            d={edge.d}
            pathLength={1}
            className={edge.dashed ? 'arch-edge arch-edge-dashed' : 'arch-edge'}
          />
          {edge.label ? (
            <text
              x={edge.label.x}
              y={edge.label.y}
              textAnchor={edge.label.anchor}
              className="arch-node arch-label"
              fontSize={11}
            >
              {dict.architecture.fallback}
            </text>
          ) : null}
        </g>
      ))}

      {layout.nodes.map((node) => {
        const copy = dict.architecture.nodes[node.id]
        const left = node.x - node.w / 2
        const top = node.y - node.h / 2
        const hasSub = Boolean(copy.sub)
        return (
          <g key={node.id} className="arch-node" style={{ '--d': `${node.at * 0.7}s` } as React.CSSProperties}>
            <rect
              x={left}
              y={top}
              width={node.w}
              height={node.h}
              rx={6}
              className={node.emphasis ? 'arch-box arch-box-main' : 'arch-box'}
            />
            <text
              x={node.x}
              y={hasSub ? node.y - 3 : node.y + 5}
              textAnchor="middle"
              className="arch-title"
              fontSize={node.emphasis ? 18 : 15}
            >
              {copy.title}
            </text>
            {copy.sub ? (
              <text x={node.x} y={node.y + 15} textAnchor="middle" className="arch-sub" fontSize={10.5}>
                {copy.sub}
              </text>
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}

export function ArchitectureDiagram({ dict }: { readonly dict: Dictionary }) {
  return (
    <Reveal>
      <div className="calque rounded-md border border-line2 bg-bg2 p-4 md:p-8">
        <Diagram layout={desktopLayout} dict={dict} className="mx-auto hidden h-auto w-full max-w-4xl md:block" />
        <Diagram layout={mobileLayout} dict={dict} className="mx-auto block h-auto w-full max-w-sm md:hidden" />
      </div>
    </Reveal>
  )
}

export default function Architecture({ dict, index = 5 }: { readonly dict: Dictionary; readonly index?: number }) {
  return (
    <Section
      id="architecture"
      index={index}
      tone="navy"
      label={dict.nav.architecture}
      title={dict.architecture.title}
      intro={dict.architecture.intro}
    >
      <ArchitectureDiagram dict={dict} />
    </Section>
  )
}
