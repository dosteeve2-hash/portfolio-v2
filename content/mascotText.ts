import type { Locale } from './locales'
import type { Expression } from '@/components/mascot/pose'

export interface QuickQuestion {
  readonly id: 'who' | 'skills' | 'projects' | 'internship' | 'contact' | 'cv'
  readonly label: string
}

export interface MascotText {
  readonly welcome: string
  readonly hint: string
  readonly open: string
  readonly close: string
  readonly hide: string
  readonly show: string
  readonly panelTitle: string
  readonly dialogLabel: string
  readonly quickTitle: string
  readonly quick: readonly QuickQuestion[]
  readonly inputLabel: string
  readonly placeholder: string
  readonly send: string
  readonly you: string
  readonly skipTyping: string
  readonly goTo: string
  readonly openCv: string
  readonly writeMail: string
  readonly openGithub: string
  readonly openLinkedin: string
  readonly heroLabels: readonly string[]
  readonly lab: {
    readonly title: string
    readonly intro: string
    readonly play: string
    readonly follow: string
    readonly expressions: Readonly<Record<Expression, string>>
  }
}

// TODO relecture TR : traduction à faire relire par un locuteur natif.
export const mascotText: Readonly<Record<Locale, MascotText>> = {
  fr: {
    welcome:
      'Salut, c’est {name} ! Je suis la version dessinée de ce site. Je réponds seulement avec ce qui y est écrit.',
    hint: 'Une question ? Clique sur moi.',
    open: 'Discuter avec {name}',
    close: 'Fermer',
    hide: 'Masquer la mascotte',
    show: 'Afficher la mascotte',
    panelTitle: 'Discuter avec {name}',
    dialogLabel: 'Assistant du portfolio',
    quickTitle: 'Questions rapides',
    quick: [
      { id: 'who', label: 'Qui es-tu ?' },
      { id: 'skills', label: 'Quelles compétences ?' },
      { id: 'projects', label: 'Tes projets ?' },
      { id: 'internship', label: 'Tu cherches un stage ?' },
      { id: 'contact', label: 'Comment te contacter ?' },
      { id: 'cv', label: 'Télécharger le CV' },
    ],
    inputLabel: 'Ta question',
    placeholder: 'Écris ta question…',
    send: 'Envoyer',
    you: 'Toi',
    skipTyping: 'Afficher la réponse en entier',
    goTo: 'Aller à la section « {section} »',
    openCv: 'Ouvrir le CV',
    writeMail: 'Écrire un e-mail',
    openGithub: 'Ouvrir GitHub',
    openLinkedin: 'Ouvrir LinkedIn',
    heroLabels: [
      'Étudiant en génie informatique',
      'Développement web full stack',
      'Intégration d’IA',
      'Orchestration d’agents IA',
    ],
    lab: {
      title: 'Laboratoire de la mascotte',
      intro: 'Toutes les expressions et tous les gestes. Page de revue, non référencée.',
      play: 'Déclencher',
      follow: 'Suivre le pointeur',
      expressions: {
        neutral: 'Neutre',
        happy: 'Content',
        laugh: 'Rire',
        wow: 'Surpris',
        thinking: 'Réfléchit',
        wink: 'Clin d’œil',
        proud: 'Fier',
        wave: 'Salue',
        curious: 'Curieux',
        sleepy: 'Endormi',
      },
    },
  },
  en: {
    welcome: 'Hi, I’m {name}! I’m the drawn version of this site. I only answer with what is written on it.',
    hint: 'A question? Click me.',
    open: 'Chat with {name}',
    close: 'Close',
    hide: 'Hide the mascot',
    show: 'Show the mascot',
    panelTitle: 'Chat with {name}',
    dialogLabel: 'Portfolio assistant',
    quickTitle: 'Quick questions',
    quick: [
      { id: 'who', label: 'Who are you?' },
      { id: 'skills', label: 'What skills do you have?' },
      { id: 'projects', label: 'Your projects?' },
      { id: 'internship', label: 'Are you looking for an internship?' },
      { id: 'contact', label: 'How can I contact you?' },
      { id: 'cv', label: 'Download the CV' },
    ],
    inputLabel: 'Your question',
    placeholder: 'Type your question…',
    send: 'Send',
    you: 'You',
    skipTyping: 'Show the full answer',
    goTo: 'Go to the “{section}” section',
    openCv: 'Open the CV',
    writeMail: 'Write an email',
    openGithub: 'Open GitHub',
    openLinkedin: 'Open LinkedIn',
    heroLabels: [
      'Computer science engineering student',
      'Full stack web development',
      'AI integration',
      'AI agent orchestration',
    ],
    lab: {
      title: 'Mascot lab',
      intro: 'Every expression and gesture. Review page, not indexed.',
      play: 'Play',
      follow: 'Follow the pointer',
      expressions: {
        neutral: 'Neutral',
        happy: 'Happy',
        laugh: 'Laugh',
        wow: 'Wow',
        thinking: 'Thinking',
        wink: 'Wink',
        proud: 'Proud',
        wave: 'Wave',
        curious: 'Curious',
        sleepy: 'Sleepy',
      },
    },
  },
  tr: {
    welcome: 'Merhaba, ben {name}! Bu sitenin çizilmiş hâliyim. Yalnızca sitede yazanlarla cevap veririm.',
    hint: 'Bir sorun mu var? Bana tıkla.',
    open: '{name} ile sohbet et',
    close: 'Kapat',
    hide: 'Maskotu gizle',
    show: 'Maskotu göster',
    panelTitle: '{name} ile sohbet',
    dialogLabel: 'Portföy asistanı',
    quickTitle: 'Hızlı sorular',
    quick: [
      { id: 'who', label: 'Sen kimsin?' },
      { id: 'skills', label: 'Hangi yeteneklerin var?' },
      { id: 'projects', label: 'Projelerin neler?' },
      { id: 'internship', label: 'Staj arıyor musun?' },
      { id: 'contact', label: 'Sana nasıl ulaşırım?' },
      { id: 'cv', label: 'CV’ni indir' },
    ],
    inputLabel: 'Sorun',
    placeholder: 'Sorunu yaz…',
    send: 'Gönder',
    you: 'Sen',
    skipTyping: 'Cevabın tamamını göster',
    goTo: '“{section}” bölümüne git',
    openCv: 'CV’yi aç',
    writeMail: 'E-posta yaz',
    openGithub: 'GitHub’ı aç',
    openLinkedin: 'LinkedIn’i aç',
    heroLabels: [
      'Bilgisayar mühendisliği öğrencisi',
      'Full stack web geliştirme',
      'Yapay zekâ entegrasyonu',
      'Yapay zekâ ajanı orkestrasyonu',
    ],
    lab: {
      title: 'Maskot laboratuvarı',
      intro: 'Tüm ifadeler ve hareketler. İnceleme sayfası, dizine eklenmez.',
      play: 'Oynat',
      follow: 'İşaretçiyi izle',
      expressions: {
        neutral: 'Nötr',
        happy: 'Mutlu',
        laugh: 'Gülme',
        wow: 'Şaşkın',
        thinking: 'Düşünüyor',
        wink: 'Göz kırpma',
        proud: 'Gururlu',
        wave: 'Selam',
        curious: 'Meraklı',
        sleepy: 'Uykulu',
      },
    },
  },
}

export function fill(template: string, values: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}
