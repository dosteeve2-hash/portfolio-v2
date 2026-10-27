import type { Locale } from './locales'

export interface QuickQuestion {
  readonly id: 'who' | 'skills' | 'projects' | 'internship' | 'contact' | 'cv'
  readonly label: string
}

export interface MascotText {
  readonly welcome: string
  readonly hint: string
  readonly open: string
  readonly close: string
  readonly panelTitle: string
  readonly assistantName: string
  readonly thinking: string
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
}

// TODO relecture TR : traduction à faire relire par un locuteur natif.
export const mascotText: Readonly<Record<Locale, MascotText>> = {
  fr: {
    welcome:
      'Bonjour, je suis l’assistant de ce site. Je réponds seulement avec ce qui y est écrit.',
    hint: 'Une question ?',
    open: 'Ouvrir l’assistant du portfolio',
    close: 'Fermer',
    panelTitle: 'Assistant du portfolio',
    assistantName: 'Assistant',
    thinking: 'Réflexion en cours',
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
  },
  en: {
    welcome: 'Hello, I’m this site’s assistant. I only answer with what is written on it.',
    hint: 'A question?',
    open: 'Open the portfolio assistant',
    close: 'Close',
    panelTitle: 'Portfolio assistant',
    assistantName: 'Assistant',
    thinking: 'Working on it',
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
  },
  tr: {
    welcome: 'Merhaba, ben bu sitenin asistanıyım. Yalnızca sitede yazanlarla cevap veririm.',
    hint: 'Bir sorun mu var?',
    open: 'Portföy asistanını aç',
    close: 'Kapat',
    panelTitle: 'Portföy asistanı',
    assistantName: 'Asistan',
    thinking: 'Cevap hazırlanıyor',
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
  },
}

export function fill(template: string, values: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}
