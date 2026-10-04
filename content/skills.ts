import { same, type Localized } from './locales'

export type SkillLevel = 'master' | 'comfortable' | 'learning'

export interface Skill {
  readonly name: Localized
  readonly level: SkillLevel
}

export interface SkillGroup {
  readonly id: string
  readonly title: Localized
  readonly items: readonly Skill[]
}

// Niveaux provisoires : à confirmer par Steve avant toute diffusion.
export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'fullstack',
    title: {
      fr: 'Développement full stack',
      en: 'Full stack development',
      tr: 'Full stack geliştirme',
    },
    items: [
      { name: same('TypeScript'), level: 'comfortable' },
      { name: same('Next.js'), level: 'comfortable' },
      { name: same('Node.js'), level: 'comfortable' },
      { name: same('Python'), level: 'comfortable' },
      { name: same('PostgreSQL'), level: 'comfortable' },
      { name: same('Tailwind CSS'), level: 'comfortable' },
    ],
  },
  {
    id: 'ai',
    title: {
      fr: "Intégration d'IA",
      en: 'AI integration',
      tr: 'Yapay zekâ entegrasyonu',
    },
    items: [
      {
        name: {
          fr: 'API de modèles de langage',
          en: 'Language model APIs',
          tr: 'Dil modeli API’leri',
        },
        level: 'comfortable',
      },
      {
        name: { fr: 'Agents et workflows', en: 'Agents and workflows', tr: 'Ajanlar ve iş akışları' },
        level: 'comfortable',
      },
      {
        name: {
          fr: 'Vibe coding encadré',
          en: 'Supervised vibe coding',
          tr: 'Denetimli vibe coding',
        },
        level: 'comfortable',
      },
    ],
  },
  {
    id: 'deploy',
    title: { fr: 'Déploiement', en: 'Deployment', tr: 'Dağıtım' },
    items: [
      { name: same('Vercel'), level: 'comfortable' },
      { name: same('Git / GitHub'), level: 'comfortable' },
      { name: same('Neon / Supabase'), level: 'comfortable' },
    ],
  },
  {
    id: 'security',
    title: {
      fr: 'Sécurité applicative de base',
      en: 'Basic application security',
      tr: 'Temel uygulama güvenliği',
    },
    items: [
      { name: { fr: 'Validation Zod', en: 'Zod validation', tr: 'Zod doğrulama' }, level: 'comfortable' },
      { name: { fr: 'Authentification', en: 'Authentication', tr: 'Kimlik doğrulama' }, level: 'comfortable' },
      { name: { fr: 'En-têtes HTTP', en: 'HTTP headers', tr: 'HTTP başlıkları' }, level: 'comfortable' },
      { name: same('OWASP'), level: 'learning' },
    ],
  },
]
