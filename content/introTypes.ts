import type { Locale } from './locales'

export interface IntroWord {
  readonly text: string
  readonly start: number
  readonly end: number
  readonly sentence: number
}

export interface IntroTimeline {
  readonly locale: Locale
  readonly audio: string | null
  readonly voice: string | null
  readonly rate: string | null
  readonly duration: number
  readonly marks: { readonly name: number; readonly role1: number; readonly role2: number }
  readonly sentences: readonly { readonly start: number; readonly end: number }[]
  readonly words: readonly IntroWord[]
}
