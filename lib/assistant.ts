import { intents, type AssistantAction, type IntentId } from '../content/assistantKb'
import type { Locale } from '../content/locales'
import { mascotText } from '../content/mascotText'
import { SITE } from '../content/site'

export interface AssistantReply {
  readonly found: boolean
  readonly intent: IntentId | null
  readonly text: string
  readonly actions: readonly AssistantAction[]
  readonly suggestions: readonly string[]
}

const FOUND_THRESHOLD = 2.5

// TODO relecture TR : traduction à faire relire par un locuteur natif.
const fallbackText: Readonly<Record<Locale, string>> = {
  fr: 'Je ne sais pas répondre à ça : je ne dis que ce qui est écrit sur ce site. Écris-moi directement à {email}. Tu peux aussi essayer l’une de ces questions :',
  en: 'I don’t know the answer to that: I only say what is written on this site. Write to me directly at {email}. You can also try one of these questions:',
  tr: 'Buna cevap veremiyorum: yalnızca bu sitede yazanları söylerim. Bana doğrudan {email} adresinden yaz. Şu sorulardan birini de deneyebilirsin:',
}

export function normalize(input: string): string {
  return input
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ı/g, 'i')
    .replace(/ß/g, 'ss')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true
  if (Math.abs(a.length - b.length) > 1) return false
  let i = 0
  let j = 0
  let edits = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1
      j += 1
      continue
    }
    edits += 1
    if (edits > 1) return false
    if (a.length > b.length) i += 1
    else if (a.length < b.length) j += 1
    else {
      i += 1
      j += 1
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1
}

interface PreparedIntent {
  readonly index: number
  readonly keywords: readonly string[]
}

const prepared: readonly PreparedIntent[] = intents.map((intent, index) => {
  const all = [...intent.keywords.fr, ...intent.keywords.en, ...intent.keywords.tr].map((keyword) => normalize(keyword))
  return { index, keywords: Array.from(new Set(all)).filter((keyword) => keyword.length > 0) }
})

function scoreKeywords(padded: string, tokens: readonly string[], keywords: readonly string[]): number {
  let score = 0
  for (const keyword of keywords) {
    const words = keyword.split(' ').length
    if (padded.includes(` ${keyword} `)) {
      score += 3 + (words - 1) * 2
      continue
    }
    if (words > 1 || keyword.length < 5) continue
    for (const token of tokens) {
      if (token.length >= 5 && token.startsWith(keyword)) {
        score += 1.5
        break
      }
      if (token.length >= 6 && keyword.length >= 6 && withinOneEdit(token, keyword)) {
        score += 2.5
        break
      }
    }
  }
  return score
}

export function answerQuestion(query: string, locale: Locale): AssistantReply {
  const normalized = normalize(query)
  const tokens = normalized.length > 0 ? normalized.split(' ') : []
  const padded = ` ${normalized} `

  let best = -1
  let bestScore = 0
  for (const item of prepared) {
    const score = scoreKeywords(padded, tokens, item.keywords)
    if (score > bestScore) {
      bestScore = score
      best = item.index
    }
  }

  const intent = best >= 0 ? intents[best] : undefined
  if (intent && bestScore >= FOUND_THRESHOLD) {
    return {
      found: true,
      intent: intent.id,
      text: intent.reply(locale),
      actions: intent.actions ?? [],
      suggestions: [],
    }
  }

  const suggestions = mascotText[locale].quick
    .filter((q) => q.id === 'who' || q.id === 'projects' || q.id === 'contact')
    .map((q) => q.label)
  return {
    found: false,
    intent: null,
    text: fallbackText[locale].replace('{email}', SITE.email),
    actions: [{ kind: 'mail' }],
    suggestions,
  }
}
