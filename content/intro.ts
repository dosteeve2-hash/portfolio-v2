import { introTimelineEn } from './introTimeline.en'
import { introTimelineFr } from './introTimeline.fr'
import { introTimelineTr } from './introTimeline.tr'
import type { IntroTimeline } from './introTypes'
import type { Locale } from './locales'

export const introTimelines: Readonly<Record<Locale, IntroTimeline>> = {
  fr: introTimelineFr,
  en: introTimelineEn,
  tr: introTimelineTr,
}

/** Prénom prononcé dans la voix off et posé dans le titre de l'accueil. */
export const INTRO_NAME = 'Donald'

/** Couleur annotée dans la maquette : l'or de la charte. */
export const INTRO_SWATCH = '#F0A832'
