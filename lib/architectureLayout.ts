import type { NodeId } from '@/content/types'

export interface LayoutNode {
  readonly id: NodeId
  readonly x: number
  readonly y: number
  readonly w: number
  readonly h: number
  readonly at: number
  readonly emphasis?: boolean
}

export interface LayoutEdge {
  readonly id: string
  readonly d: string
  readonly at: number
  readonly dashed?: boolean
  readonly label?: { readonly x: number; readonly y: number; readonly anchor: 'start' | 'middle' | 'end' }
}

export interface Layout {
  readonly width: number
  readonly height: number
  readonly nodes: readonly LayoutNode[]
  readonly edges: readonly LayoutEdge[]
}

export const desktopLayout: Layout = {
  width: 820,
  height: 460,
  nodes: [
    { id: 'github', x: 110, y: 130, w: 150, h: 56, at: 0 },
    { id: 'telegram', x: 110, y: 330, w: 150, h: 56, at: 0.15 },
    { id: 'manager', x: 400, y: 230, w: 200, h: 84, at: 0.9, emphasis: true },
    { id: 'copilot', x: 710, y: 60, w: 170, h: 48, at: 1.5 },
    { id: 'gemini', x: 710, y: 170, w: 170, h: 48, at: 1.7 },
    { id: 'codex', x: 710, y: 280, w: 170, h: 48, at: 1.9 },
    { id: 'ollama', x: 710, y: 390, w: 170, h: 48, at: 2.1 },
    { id: 'journal', x: 400, y: 400, w: 220, h: 52, at: 2.7 },
  ],
  edges: [
    { id: 'github-manager', d: 'M185 130 C245 130 245 205 300 205', at: 0.4 },
    { id: 'telegram-manager', d: 'M185 330 C245 330 245 255 300 255', at: 0.5 },
    { id: 'manager-copilot', d: 'M500 230 C565 230 560 60 625 60', at: 1.1 },
    { id: 'manager-gemini', d: 'M500 230 C565 230 560 170 625 170', at: 1.2 },
    { id: 'manager-codex', d: 'M500 230 C565 230 560 280 625 280', at: 1.3 },
    { id: 'manager-ollama', d: 'M500 230 C565 230 560 390 625 390', at: 1.4 },
    { id: 'manager-journal', d: 'M400 272 V374', at: 2.4 },
    {
      id: 'codex-ollama',
      d: 'M770 304 V366',
      at: 3.0,
      dashed: true,
      label: { x: 760, y: 340, anchor: 'end' },
    },
  ],
}

export const mobileLayout: Layout = {
  width: 360,
  height: 650,
  nodes: [
    { id: 'github', x: 95, y: 40, w: 150, h: 52, at: 0 },
    { id: 'telegram', x: 265, y: 40, w: 150, h: 52, at: 0.15 },
    { id: 'manager', x: 180, y: 170, w: 220, h: 70, at: 0.9, emphasis: true },
    { id: 'copilot', x: 180, y: 290, w: 240, h: 44, at: 1.5 },
    { id: 'gemini', x: 180, y: 360, w: 240, h: 44, at: 1.7 },
    { id: 'codex', x: 180, y: 430, w: 240, h: 44, at: 1.9 },
    { id: 'ollama', x: 180, y: 500, w: 240, h: 44, at: 2.1 },
    { id: 'journal', x: 180, y: 600, w: 240, h: 48, at: 2.7 },
  ],
  edges: [
    { id: 'github-manager', d: 'M95 66 C95 100 150 100 150 135', at: 0.4 },
    { id: 'telegram-manager', d: 'M265 66 C265 100 210 100 210 135', at: 0.5 },
    { id: 'manager-copilot', d: 'M70 170 H24 V290 H60', at: 1.1 },
    { id: 'manager-gemini', d: 'M24 360 H60', at: 1.2 },
    { id: 'manager-codex', d: 'M24 430 H60', at: 1.3 },
    { id: 'manager-ollama', d: 'M24 500 H60', at: 1.4 },
    { id: 'manager-trunk', d: 'M24 290 V500', at: 1.15 },
    { id: 'manager-journal', d: 'M290 170 H336 V600 H300', at: 2.4 },
    {
      id: 'codex-ollama',
      d: 'M110 452 V478',
      at: 3.0,
      dashed: true,
      label: { x: 122, y: 469, anchor: 'start' },
    },
  ],
}
