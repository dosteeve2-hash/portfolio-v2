import type { Localized } from './locales'

export type CertificationGroupId = 'ai' | 'web' | 'design' | 'university'

export interface Certification {
  readonly id: string
  readonly group: CertificationGroupId
  /** Langue d'origine du document (intitulés non traduits). */
  readonly lang: 'en' | 'tr'
  /** Intitulé exact, dans la langue d'origine du certificat. */
  readonly title: string
  readonly subtitle?: string
  readonly issuer: string
  /** Date de réussite (UTC) telle qu'elle figure sur le PDF ; absente si le document n'en porte pas. */
  readonly date?: string
  readonly minutes?: number
  readonly skills: readonly string[]
  readonly credentialId?: string
  readonly note?: Localized
  readonly pdfUrl: string
  readonly verifyUrl?: string
}

export const LINKEDIN_CERTIFICATIONS_URL =
  'https://www.linkedin.com/in/steeve-donald-compaor%C3%A9-65ba13296/details/certifications/'

const LINKEDIN_LEARNING = 'LinkedIn Learning'

interface CourseInput {
  readonly id: string
  readonly group: CertificationGroupId
  readonly title: string
  readonly date: string
  readonly minutes: number
  readonly skills: readonly string[]
  readonly credentialId: string
  readonly file: string
}

function course(input: CourseInput): Certification {
  return {
    id: input.id,
    group: input.group,
    lang: 'en',
    title: input.title,
    issuer: LINKEDIN_LEARNING,
    date: input.date,
    minutes: input.minutes,
    skills: input.skills,
    credentialId: input.credentialId,
    pdfUrl: `/certifications/${input.file}`,
    verifyUrl: LINKEDIN_CERTIFICATIONS_URL,
  }
}

// Source : les PDF « Certificate of Completion » (dossier Certification). Un seul exemplaire par cours.
export const certifications: readonly Certification[] = [
  course({
    id: 'designing-agentic-ai-products',
    group: 'ai',
    title: 'Designing Agentic AI Products (No Code Required)',
    date: '2026-10-03',
    minutes: 64,
    skills: ['AI Agents', 'Artificial Intelligence for Design', 'Product Design'],
    credentialId: '5c1642010a5bb394522174514097f1eb7d34aebf07dc795c00b7393fd56a56ce',
    file: 'designing-agentic-ai-products.pdf',
  }),
  course({
    id: 'advanced-prompting-copilot',
    group: 'ai',
    title: 'Advanced Prompting with GitHub Copilot',
    date: '2026-09-27',
    minutes: 73,
    skills: ['AI Prompting', 'Conversational AI', 'Artificial Intelligence (AI)'],
    credentialId: 'cdce55badff8332c84b4d66520e2115f2edcf4c201e3a217186c3717897e5830',
    file: 'advanced-prompting-copilot.pdf',
  }),
  course({
    id: 'ai-pair-programming-copilot',
    group: 'ai',
    title: 'AI Pair Programming with GitHub Copilot',
    date: '2026-09-27',
    minutes: 92,
    skills: ['GitHub Copilot', 'Artificial Intelligence (AI)'],
    credentialId: 'dab56c5654a7ec8b32de9f44883c117c7dd7029a3c5b7da5bba0b24bd188ffa9',
    file: 'ai-pair-programming-copilot.pdf',
  }),
  course({
    id: 'agentic-ai-collaboration-patterns',
    group: 'ai',
    title: 'Agentic AI Human-Agent Collaboration Design Patterns',
    date: '2026-09-25',
    minutes: 61,
    skills: ['AI Solutions', 'Design Patterns', 'Artificial Intelligence (AI)'],
    credentialId: 'fdece0eb4a58af0d461312a06ae9287d3c0fbcd0b3f6257cadfbcbecf038e021',
    file: 'agentic-ai-collaboration-patterns.pdf',
  }),
  course({
    id: 'voice-generation-mai-voice-1',
    group: 'ai',
    title: "Build with AI: Voice Generation with Microsoft's MAI-Voice-1 and Copilot Labs",
    date: '2026-09-24',
    minutes: 28,
    skills: ['Microsoft Copilot', 'MAI-Voice-1', 'Artificial Intelligence (AI)'],
    credentialId: 'bfc0a8db65bf51ad26b3e4bc5a8ee0987138d52c10068b00cae408cd90bfd0a2',
    file: 'voice-generation-mai-voice-1.pdf',
  }),
  course({
    id: 'claude-cowork-productivity',
    group: 'ai',
    title: 'Everyday Productivity with Claude Cowork',
    date: '2026-09-24',
    minutes: 23,
    skills: ['Anthropic Claude', 'Claude Skills', 'Artificial Intelligence (AI)'],
    credentialId: 'f379ccad0aa25344631c3d040044832dfd60d7a8a71fba0491bc52fec359ffe0',
    file: 'claude-cowork-productivity.pdf',
  }),
  course({
    id: 'website-interactivity-javascript',
    group: 'web',
    title: 'Building Website Interactivity with JavaScript',
    date: '2026-09-25',
    minutes: 190,
    skills: ['Web Development', 'JavaScript'],
    credentialId: '7323131476ff04a2b4f77703c5b389c4bd5174ae25464d2bd86a671a9defa2d5',
    file: 'website-interactivity-javascript.pdf',
  }),
  course({
    id: 'html-css-javascript-building-the-web',
    group: 'web',
    title: 'HTML, CSS, and JavaScript: Building the Web',
    date: '2026-09-24',
    minutes: 217,
    skills: ['Web Development', 'Cascading Style Sheets (CSS)', 'HTML'],
    credentialId: 'ae3fe91d7e7a245d6f68ef6aeee27e8972edd3af9da3cf1dbf648e0568a373fb',
    file: 'html-css-javascript-building-the-web.pdf',
  }),
  course({
    id: 'javascript-debugging',
    group: 'web',
    title: 'Learning JavaScript Debugging',
    date: '2026-09-24',
    minutes: 167,
    skills: ['Debugging Code', 'JavaScript'],
    credentialId: '180069eab50fea3d9654be697907d222c2396e27767ba259acba59ba447cf568',
    file: 'javascript-debugging.pdf',
  }),
  course({
    id: 'level-up-javascript',
    group: 'web',
    title: 'Level Up: JavaScript',
    date: '2026-09-24',
    minutes: 63,
    skills: ['JavaScript'],
    credentialId: 'fb0218b3c02afedd5ce59e1822a7f9a4564288f855c6edb8100fa3eaff7e732e',
    file: 'level-up-javascript.pdf',
  }),
  course({
    id: 'hands-on-intro-javascript',
    group: 'web',
    title: 'Hands-On Introduction: JavaScript',
    date: '2026-09-24',
    minutes: 103,
    skills: ['JavaScript'],
    credentialId: '25b89c313120e9871670dce5e95b05586f6a8dea2dcdf6ee15df6af09c1e5fab',
    file: 'hands-on-intro-javascript.pdf',
  }),
  course({
    id: 'typescript-for-javascript-developers',
    group: 'web',
    title: 'TypeScript for JavaScript Developers',
    date: '2026-09-23',
    minutes: 62,
    skills: ['JavaScript', 'Front-End Development', 'TypeScript'],
    credentialId: '7fe367348f9e8358db51ada80439c916d5185df154c8f168162b7f129ab63004',
    file: 'typescript-for-javascript-developers.pdf',
  }),
  course({
    id: 'graphic-design-layout-composition',
    group: 'design',
    title: 'Graphic Design Foundations: Layout and Composition',
    date: '2026-09-24',
    minutes: 123,
    skills: ['Graphic Design', 'Layout and Composition', 'Layout Design'],
    credentialId: '142fa456518e70460ff9d9085cb03db09a9f1f8afd7f80d709231328379cfeaf',
    file: 'graphic-design-layout-composition.pdf',
  }),
  {
    id: 'katilim-belgesi-tokat-gop',
    group: 'university',
    lang: 'tr',
    title: 'Bağımlılıkla Mücadelede Üniversite Temelli Eğitim Modeli',
    subtitle: 'Farkındalık, Önleme ve Sağlıklı Kampüs Yaklaşımı',
    issuer: 'Tokat Gaziosmanpaşa Üniversitesi',
    skills: [],
    note: {
      fr: 'Attestation de participation (Katılım Belgesi) à un programme de prévention des addictions, signée par le recteur, le Pr Dr Fatih Yılmaz.',
      en: 'Certificate of participation (Katılım Belgesi) in an addiction-prevention programme, signed by the rector, Prof. Dr. Fatih Yılmaz.',
      tr: 'Bağımlılıkla mücadele eğitim programına Katılım Belgesi; Rektör Prof. Dr. Fatih Yılmaz tarafından imzalanmıştır.',
    },
    pdfUrl: '/certifications/katilim-belgesi-tokat-gop.pdf',
  },
]

export const certificationGroupOrder: readonly CertificationGroupId[] = ['ai', 'web', 'design', 'university']

export function certificationsOf(group: CertificationGroupId): readonly Certification[] {
  return certifications.filter((item) => item.group === group)
}

export const linkedinLearningCount: number = certifications.filter((item) => item.issuer === LINKEDIN_LEARNING).length

export const totalMinutes: number = certifications.reduce((sum, item) => sum + (item.minutes ?? 0), 0)

export const totalHours: number = Math.floor(totalMinutes / 60)
