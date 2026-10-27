import type { Locale } from './locales'

export interface PipelineStep {
  readonly name: string
  readonly sub: string
  readonly line: string
}

export interface WaouhCopy {
  readonly stackLabel: string
  readonly stickerHint: string
  readonly stickers: {
    readonly spec: string
    readonly projects: string
    readonly tests: string
    readonly languages: string
  }
  readonly scene: {
    readonly eyebrow: string
    readonly title: string
    readonly svgTitle: string
    readonly loop: string
    readonly counter: string
    readonly steps: readonly [PipelineStep, PipelineStep, PipelineStep, PipelineStep]
  }
}

/** Textes du mouvement (étiquettes déplaçables, bandeau, scène épinglée). Chiffres : toujours calculés, jamais saisis ici. */
export const waouh: Readonly<Record<Locale, WaouhCopy>> = {
  fr: {
    stackLabel: 'Pile technique utilisée dans mes projets',
    stickerHint: 'Étiquette déplaçable',
    stickers: {
      spec: 'SPEC',
      projects: '{n} projets en ligne',
      tests: '{n} tests',
      languages: 'FR · EN · TR',
    },
    scene: {
      eyebrow: 'Méthode',
      title: 'Du premier test à la mise en ligne',
      svgTitle: 'Schéma en quatre étapes : spécifier, tester, construire, livrer ; un échec renvoie à la correction.',
      loop: 'échec : on corrige',
      counter: '{tests} tests automatisés sur {projects} projets en ligne',
      steps: [
        { name: 'Spécifier', sub: 'cahier + test', line: 'Un cahier court et un premier test avant la première ligne de code.' },
        { name: 'Tester', sub: 'tests · lint · audit', line: 'Tests, lint et audit des dépendances à chaque changement ; un échec renvoie à la correction.' },
        { name: 'Construire', sub: 'build · en-têtes', line: 'Un build propre, des en-têtes de sécurité et l’accessibilité contrôlés avant de livrer.' },
        { name: 'Livrer', sub: 'Vercel · essai réel', line: 'Mise en ligne, puis un essai comme un vrai utilisateur : mobile 375 px, console, parcours complet.' },
      ],
    },
  },
  en: {
    stackLabel: 'Tech stack used across my projects',
    stickerHint: 'Draggable label',
    stickers: {
      spec: 'SPEC',
      projects: '{n} projects online',
      tests: '{n} tests',
      languages: 'FR · EN · TR',
    },
    scene: {
      eyebrow: 'Method',
      title: 'From the first test to going live',
      svgTitle: 'Four-step diagram: specify, test, build, ship; a failure loops back to the fix.',
      loop: 'failure: fix it',
      counter: '{tests} automated tests across {projects} projects online',
      steps: [
        { name: 'Specify', sub: 'brief + test', line: 'A short brief and a first test before the first line of code.' },
        { name: 'Test', sub: 'tests · lint · audit', line: 'Tests, lint and dependency audit on every change; a failure sends it back to the fix.' },
        { name: 'Build', sub: 'build · headers', line: 'A clean build, security headers and accessibility checked before shipping.' },
        { name: 'Ship', sub: 'Vercel · real test', line: 'Deployed, then tried like a real user: 375 px mobile, console, the whole journey.' },
      ],
    },
  },
  tr: {
    stackLabel: 'Projelerimde kullandığım teknoloji yığını',
    stickerHint: 'Sürüklenebilir etiket',
    stickers: {
      spec: 'SPEC',
      projects: '{n} proje yayında',
      tests: '{n} test',
      languages: 'FR · EN · TR',
    },
    scene: {
      eyebrow: 'Yöntem',
      title: 'İlk testten yayına',
      svgTitle: 'Dört adımlı şema: belirle, test et, derle, yayınla; başarısızlık düzeltmeye geri döner.',
      loop: 'hata: düzelt',
      counter: '{projects} yayındaki projede {tests} otomatik test',
      steps: [
        { name: 'Belirle', sub: 'kısa tanım + test', line: 'İlk kod satırından önce kısa bir tanım ve ilk test.' },
        { name: 'Test et', sub: 'test · lint · denetim', line: 'Her değişiklikte test, lint ve bağımlılık denetimi; hata olursa düzeltmeye dönülür.' },
        { name: 'Derle', sub: 'derleme · başlıklar', line: 'Yayından önce temiz derleme, güvenlik başlıkları ve erişilebilirlik kontrolü.' },
        { name: 'Yayınla', sub: 'Vercel · gerçek deneme', line: 'Yayına alınır, sonra gerçek kullanıcı gibi denenir: 375 px mobil, konsol, tüm akış.' },
      ],
    },
  },
}

export function fill(template: string, values: Readonly<Record<string, number | string>>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match))
}
