import type { SkillLevel } from './skills'

export type NodeId =
  | 'github'
  | 'telegram'
  | 'manager'
  | 'copilot'
  | 'gemini'
  | 'codex'
  | 'ollama'
  | 'journal'

export interface Dictionary {
  readonly meta: { readonly title: string; readonly description: string }
  readonly brand: { readonly name: string; readonly slogan: string }
  readonly nav: {
    readonly label: string
    readonly skipToContent: string
    readonly home: string
    readonly about: string
    readonly skills: string
    readonly projects: string
    readonly architecture: string
    readonly certifications: string
    readonly journey: string
    readonly contact: string
    readonly openMenu: string
    readonly closeMenu: string
  }
  readonly language: { readonly label: string }
  readonly badge: string
  readonly intro: { readonly skip: string }
  readonly hero: {
    readonly subtitle: string
    readonly cv: string
    readonly contact: string
    readonly portraitAlt: string
  }
  readonly about: { readonly title: string; readonly paragraphs: readonly string[] }
  readonly skills: {
    readonly title: string
    readonly intro: string
    readonly levels: Readonly<Record<SkillLevel, string>>
  }
  readonly projects: {
    readonly title: string
    readonly intro: string
    readonly visit: string
    readonly featured: string
    readonly noPublicLink: string
  }
  readonly architecture: {
    readonly title: string
    readonly intro: string
    readonly svgTitle: string
    readonly svgDesc: string
    readonly nodes: Readonly<Record<NodeId, { readonly title: string; readonly sub?: string }>>
    readonly fallback: string
  }
  readonly certifications: {
    readonly title: string
    readonly intro: string
    readonly emptyTitle: string
    readonly emptyText: string
    readonly verify: string
    readonly viewPdf: string
  }
  readonly journey: {
    readonly title: string
    readonly items: readonly {
      readonly period: string
      readonly title: string
      readonly text: string
    }[]
  }
  readonly contact: {
    readonly title: string
    readonly text: string
    readonly email: string
    readonly github: string
    readonly linkedin: string
    readonly cv: string
  }
  readonly cvPage: {
    readonly title: string
    readonly text: string
    readonly back: string
    readonly contact: string
  }
  readonly notFound: { readonly title: string; readonly text: string; readonly back: string }
  readonly footer: { readonly rights: string }
}
