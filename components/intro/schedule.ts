import type { IntroTimeline, IntroWord } from '@/content/introTypes'

/** Courbes de la séquence : sortie douce, entrée-sortie, léger rebond pour l'aimantation. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const
export const EASE_PUSH = [0.33, 0, 0.2, 1] as const
export const EASE_SNAP = [0.34, 1.45, 0.64, 1] as const

/** La voix démarre après l'allumage (phase 1, purement CSS, visible avant l'hydratation). */
export const VOICE_AT = 0.5
/** Les mots apparaissent un souffle avant d'être entendus : l'œil perçoit alors l'image et le son ensemble. */
const VISUAL_LEAD = 0.06

export interface Schedule {
  readonly phase2: number
  readonly phase3: number
  readonly phase4: number
  readonly name: number
  readonly role1: number
  readonly role2: number
  readonly cursorIn: number
  readonly click: number
  readonly snapEnd: number
  readonly prepare: number
  readonly flyStart: number
  readonly flyEnd: number
  readonly end: number
  /** Mots de chaque phrase, avec l'instant (sur l'horloge de la scène) où ils doivent apparaître. */
  readonly welcome: readonly TimedWord[]
  readonly lead: readonly TimedWord[]
  readonly discover: readonly TimedWord[]
}

export interface TimedWord {
  readonly text: string
  readonly at: number
}

function wordsOf(timeline: IntroTimeline, sentence: number): readonly IntroWord[] {
  return timeline.words.filter((word) => word.sentence === sentence)
}

function timed(words: readonly IntroWord[]): readonly TimedWord[] {
  return words.map((word) => ({ text: word.text, at: VOICE_AT + word.start - VISUAL_LEAD }))
}

export function buildSchedule(timeline: IntroTimeline): Schedule {
  const at = (seconds: number) => VOICE_AT + seconds
  const sentence = (index: number) => timeline.sentences[index] ?? { start: index * 1.4, end: index * 1.4 + 1.2 }
  const first = sentence(0)
  const second = sentence(1)
  const third = sentence(2)

  const nameWords = wordsOf(timeline, 1)
  const lead = nameWords.filter((word) => word.start < timeline.marks.name - 0.01)

  const phase2 = at(first.start) - 0.12
  const phase3 = at(second.start) - 0.18
  const phase4 = at(third.start) - 0.12
  const role2 = at(timeline.marks.role2) - VISUAL_LEAD
  // L'aimantation doit être terminée avant la dernière phrase (l'anglais laisse peu de marge).
  const click = Math.max(role2 + 0.16, Math.min(role2 + 0.32, phase4 - 0.6))
  const snapEnd = click + 0.4
  const cursorIn = Math.max(at(timeline.marks.role1), click - 0.85)

  // Le cadre se déploie pendant la dernière phrase ; le nom et la ligne d'or s'envolent
  // vers l'accueil quand son dernier mot est prononcé.
  const discover = wordsOf(timeline, 2)
  const lastWord = discover[discover.length - 1]
  const flyStart = Math.max(phase4 + 0.6, at(lastWord ? lastWord.start : third.end - 0.4) + 0.12)
  const flyEnd = flyStart + 0.75

  return {
    phase2,
    phase3,
    phase4,
    name: at(timeline.marks.name) - VISUAL_LEAD,
    role1: at(timeline.marks.role1) - VISUAL_LEAD,
    role2,
    cursorIn,
    click,
    snapEnd,
    prepare: flyStart - 0.2,
    flyStart,
    flyEnd,
    end: flyEnd + 0.4,
    welcome: timed(wordsOf(timeline, 0)),
    lead: timed(lead),
    discover: timed(discover),
  }
}
