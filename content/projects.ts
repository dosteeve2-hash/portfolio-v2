import type { Localized } from './locales'

export interface Project {
  readonly id: string
  readonly name: Localized
  readonly result: Localized
  readonly stack: readonly string[]
  readonly href?: string
  readonly featured?: boolean
}

export const projects: readonly Project[] = [
  {
    id: 'orchestrator',
    featured: true,
    name: {
      fr: "Banc d'orchestration IA",
      en: 'AI orchestration bench',
      tr: 'Yapay zekâ orkestrasyon test tezgâhı',
    },
    result: {
      fr: "Un manager délègue le travail à plusieurs agents (Copilot, Gemini, Codex, Ollama), route chaque tâche, bascule automatiquement en cas de quota et garde un journal de délégation.",
      en: 'A manager delegates work to several agents (Copilot, Gemini, Codex, Ollama), routes each task, falls back automatically when a quota is hit and keeps a delegation log.',
      tr: 'Bir yönetici, işi birden fazla ajana (Copilot, Gemini, Codex, Ollama) devreder, her görevi yönlendirir, kota dolduğunda otomatik olarak yedeğe geçer ve bir devir günlüğü tutar.',
    },
    stack: ['PowerShell', 'GitHub', 'Telegram', 'Ollama'],
  },
  {
    id: 'ueemt',
    name: { fr: 'UEEMT-Tokat', en: 'UEEMT-Tokat', tr: 'UEEMT-Tokat' },
    result: {
      fr: "La plateforme en ligne d'une association étudiante, avec des animations fluides.",
      en: "An online platform for a student association, with smooth animations.",
      tr: 'Bir öğrenci derneği için akıcı animasyonlara sahip çevrimiçi platform.',
    },
    stack: ['Next.js', 'Supabase', 'Framer Motion'],
    href: 'https://ueemt-tokat.vercel.app',
  },
  {
    id: 'comptrack',
    name: { fr: 'CompTrack', en: 'CompTrack', tr: 'CompTrack' },
    result: {
      fr: 'Une application de comptabilité pour PME, conforme au référentiel SYSCOHADA.',
      en: 'An accounting application for small businesses, compliant with the SYSCOHADA framework.',
      tr: 'KOBİ’ler için SYSCOHADA standardına uygun bir muhasebe uygulaması.',
    },
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    href: 'https://comptrack-chi.vercel.app',
  },
  {
    id: 'aura',
    name: { fr: 'AURA Pro', en: 'AURA Pro', tr: 'AURA Pro' },
    result: {
      fr: 'Une vitrine produit soignée pour présenter des téléphones.',
      en: 'A polished product showcase for presenting phones.',
      tr: 'Telefonları tanıtmak için özenli bir ürün vitrini.',
    },
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    href: 'https://phone-showcase-nu.vercel.app',
  },
]
