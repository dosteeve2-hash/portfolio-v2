import { same, type Localized } from './locales'

export interface SpokenLanguage {
  readonly name: Localized
  readonly level: Localized
}

const veryGood: Localized = { fr: 'très bien', en: 'very good', tr: 'çok iyi' }
const good: Localized = { fr: 'bien', en: 'good', tr: 'iyi' }

export const spokenLanguages: readonly SpokenLanguage[] = [
  { name: { fr: 'Français', en: 'French', tr: 'Fransızca' }, level: veryGood },
  { name: { fr: 'Anglais', en: 'English', tr: 'İngilizce' }, level: good },
  { name: { fr: 'Turc', en: 'Turkish', tr: 'Türkçe' }, level: good },
  { name: same('Mooré'), level: good },
  { name: same('Bambara'), level: good },
]
