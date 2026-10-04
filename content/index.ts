import { en } from './en'
import { fr } from './fr'
import type { Locale } from './locales'
import { tr } from './tr'
import type { Dictionary } from './types'

const dictionaries: Readonly<Record<Locale, Dictionary>> = { fr, en, tr }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
