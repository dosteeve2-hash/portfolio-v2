import { same, type Localized } from './locales'

export type SkillLevel = 'veryGood' | 'good' | 'average'

export interface Skill {
  readonly name: Localized
  readonly level?: SkillLevel
  readonly note?: Localized
}

export interface SkillGroup {
  readonly id: string
  readonly title: Localized
  readonly items: readonly Skill[]
}

const underOneYear: Localized = { fr: 'moins d’un an', en: 'under a year', tr: '1 yıldan az' }
const oneToThree: Localized = { fr: '1 à 3 ans', en: '1 to 3 years', tr: '1-3 yıl' }

// Niveaux auto-évalués dans le CV de Steeve. Un outil sans `level` est listé sans note.
export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'ai',
    title: { fr: 'Intelligence artificielle', en: 'Artificial intelligence', tr: 'Yapay zekâ' },
    items: [
      {
        name: { fr: 'Intelligence artificielle', en: 'Artificial intelligence', tr: 'Yapay zekâ' },
        level: 'veryGood',
        note: oneToThree,
      },
    ],
  },
  {
    id: 'languages',
    title: { fr: 'Langages', en: 'Programming languages', tr: 'Programlama dilleri' },
    items: [
      { name: same('C#'), level: 'good', note: underOneYear },
      { name: same('Python'), level: 'average', note: underOneYear },
      { name: same('JavaScript'), level: 'average', note: underOneYear },
      { name: same('Java'), level: 'average', note: oneToThree },
    ],
  },
  {
    id: 'tools',
    title: { fr: 'Outils utilisés', en: 'Tools I use', tr: 'Kullandığım araçlar' },
    items: [
      { name: same('Next.js') },
      { name: same('TypeScript') },
      { name: same('Tailwind CSS') },
      { name: same('PostgreSQL (Neon, Supabase)') },
      { name: same('Vercel') },
      { name: same('Git / GitHub') },
    ],
  },
]
