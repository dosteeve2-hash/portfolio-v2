import cv from './cv-data.json'
import { certifications } from './certifications'
import { getDictionary } from './index'
import { spokenLanguages } from './languages'
import type { Locale } from './locales'
import { mascotText } from './mascotText'
import { projects } from './projects'
import { cvHref, MASCOT_NAME, SITE } from './site'
import { skillGroups } from './skills'

export type SectionId = 'about' | 'skills' | 'projects' | 'architecture' | 'certifications' | 'journey' | 'contact'

export type AssistantAction =
  | { readonly kind: 'scroll'; readonly section: SectionId }
  | { readonly kind: 'cv' }
  | { readonly kind: 'mail' }
  | { readonly kind: 'github' }
  | { readonly kind: 'linkedin' }

export type IntentId =
  | 'who'
  | 'skills'
  | 'projects'
  | 'internship'
  | 'contact'
  | 'cv'
  | 'education'
  | 'spoken'
  | 'experience'
  | 'location'
  | 'certifications'
  | 'ai'
  | 'bot'
  | 'greeting'
  | 'thanks'

export interface Intent {
  readonly id: IntentId
  readonly keywords: Readonly<Record<Locale, readonly string[]>>
  readonly reply: (locale: Locale) => string
  readonly actions?: readonly AssistantAction[]
}

const lines = (...parts: readonly string[]): string => parts.join('\n')

// TODO relecture TR : traductions à faire relire par un locuteur natif.
const skillsIntro: Readonly<Record<Locale, string>> = {
  fr: 'Voici mes compétences, avec les niveaux que j’ai indiqués dans mon CV :',
  en: 'Here are my skills, with the levels I gave in my CV:',
  tr: 'İşte CV’mde belirttiğim seviyelerle yeteneklerim:',
}

const projectsIntro: Readonly<Record<Locale, string>> = {
  fr: 'Quatre réalisations :',
  en: 'Four projects:',
  tr: 'Dört proje:',
}

const locationReply: Readonly<Record<Locale, string>> = {
  fr: 'Je vis à Tokat, en Türkiye. Je suis burkinabè et j’étudie à l’Université de Tokat Gaziosmanpaşa.',
  en: 'I live in Tokat, Türkiye. I am Burkinabè and I study at Tokat Gaziosmanpaşa University.',
  tr: 'Türkiye’nin Tokat şehrinde yaşıyorum. Burkina Fasolu’yum ve Tokat Gaziosmanpaşa Üniversitesi’nde okuyorum.',
}

const botReply: Readonly<Record<Locale, string>> = {
  fr: 'Je suis un personnage dessiné pour ce portfolio, à l’effigie de Steeve. Mes réponses viennent d’un petit moteur local qui cherche des mots-clés dans le contenu du site : aucune IA externe, et ta question ne quitte pas ton navigateur.',
  en: 'I am a character drawn for this portfolio, in Steeve’s likeness. My answers come from a small local engine that looks for keywords in the site content: no external AI, and your question never leaves your browser.',
  tr: 'Ben bu portföy için çizilmiş, Steeve’i temsil eden bir karakterim. Cevaplarım, site içeriğinde anahtar kelime arayan küçük bir yerel motordan gelir: harici yapay zekâ yok ve sorun tarayıcından çıkmaz.',
}

const thanksReply: Readonly<Record<Locale, string>> = {
  fr: 'Avec plaisir ! N’hésite pas si tu as une autre question.',
  en: 'My pleasure! Ask me anything else if you like.',
  tr: 'Rica ederim! Başka bir sorun olursa çekinme.',
}

const certificationsListIntro: Readonly<Record<Locale, string>> = {
  fr: 'Certifications vérifiées :',
  en: 'Verified certifications:',
  tr: 'Doğrulanmış sertifikalar:',
}

const contactIntro: Readonly<Record<Locale, string>> = {
  fr: 'Tu peux m’écrire ou me retrouver ici :',
  en: 'You can write to me or find me here:',
  tr: 'Bana buradan ulaşabilirsin:',
}

const cvAvailableReply: Readonly<Record<Locale, string>> = {
  fr: 'Mon CV est disponible en PDF. Je te l’ouvre.',
  en: 'My CV is available as a PDF. I’ll open it for you.',
  tr: 'CV’m PDF olarak mevcut. Senin için açıyorum.',
}

export const intents: readonly Intent[] = [
  {
    id: 'who',
    keywords: {
      fr: ['qui es tu', 'qui etes vous', 'qui tu es', 'presente toi', 'presentez vous', 'qui est steeve', 'parle moi de toi', 'c est qui', 'profil'],
      en: ['who are you', 'who is steeve', 'about you', 'about yourself', 'introduce yourself', 'tell me about yourself', 'profile'],
      tr: ['sen kimsin', 'kimsin', 'kendini tanit', 'kendinden bahset', 'kimdir', 'hakkinda'],
    },
    reply: (locale) => {
      const { paragraphs } = getDictionary(locale).about
      return `${paragraphs[0] ?? ''} ${paragraphs[1] ?? ''}`.trim()
    },
    actions: [{ kind: 'scroll', section: 'about' }],
  },
  {
    id: 'skills',
    keywords: {
      fr: ['competence', 'competences', 'savoir faire', 'que sais tu faire', 'technologies', 'technos', 'langages', 'langage', 'stack', 'outils', 'tu maitrises', 'tu sais faire'],
      en: ['skills', 'skill', 'abilities', 'technologies', 'tech stack', 'stack', 'tools', 'programming languages', 'what can you do', 'proficient'],
      tr: ['yetenek', 'yetenekler', 'beceri', 'beceriler', 'teknoloji', 'araclar', 'programlama', 'neler yapabilirsin', 'hangi yeteneklerin'],
    },
    reply: (locale) => {
      const dict = getDictionary(locale)
      const rated = skillGroups
        .flatMap((group) => group.items)
        .filter((item) => item.level !== undefined)
        .map((item) => {
          const level = item.level ? dict.skills.levels[item.level] : ''
          const note = item.note ? `, ${item.note[locale]}` : ''
          return `• ${item.name[locale]} : ${level}${note}`
        })
      const tools = skillGroups
        .filter((group) => group.items.every((item) => item.level === undefined))
        .map((group) => `${group.title[locale]} : ${group.items.map((item) => item.name[locale]).join(', ')}`)
      return lines(skillsIntro[locale], ...rated, ...tools)
    },
    actions: [{ kind: 'scroll', section: 'skills' }],
  },
  {
    id: 'projects',
    keywords: {
      fr: ['projet', 'projets', 'realisation', 'realisations', 'applications', 'apps', 'tu as fait', 'tu as cree', 'travaux', 'demo'],
      en: ['project', 'projects', 'what have you built', 'built', 'applications', 'apps', 'showcase', 'your work'],
      tr: ['proje', 'projeler', 'projelerin', 'calismalar', 'uygulamalar', 'neler yaptin', 'yaptigin'],
    },
    reply: (locale) =>
      lines(projectsIntro[locale], ...projects.map((project) => `• ${project.name[locale]} : ${project.result[locale]}`)),
    actions: [{ kind: 'scroll', section: 'projects' }],
  },
  {
    id: 'internship',
    keywords: {
      fr: ['stage', 'stages', 'cherches un stage', 'alternance', 'recrute', 'recrutement', 'disponible', 'disponibilite', 'embauche', 'ete 2027', '2027', 'job', 'emploi'],
      en: ['internship', 'intern', 'looking for', 'available', 'availability', 'hire', 'hiring', 'job', 'summer 2027', '2027', 'open to work', 'recruit'],
      tr: ['staj', 'staj ariyor', 'ariyor musun', 'musait', 'musaitlik', 'ise alim', 'yaz 2027', '2027', 'is ariyor'],
    },
    reply: (locale) => {
      const profile = cv.locales[locale].profile
      return `${getDictionary(locale).badge}. ${profile}`
    },
    actions: [{ kind: 'scroll', section: 'contact' }],
  },
  {
    id: 'contact',
    keywords: {
      fr: ['contact', 'contacter', 'contacte', 'joindre', 'ecrire', 'email', 'mail', 'e mail', 'courriel', 'adresse', 'github', 'linkedin', 'telephone', 'comment te contacter', 'comment te joindre'],
      en: ['contact', 'email', 'mail', 'reach', 'get in touch', 'write to you', 'linkedin', 'github', 'phone', 'address', 'message you'],
      tr: ['iletisim', 'ulas', 'ulasim', 'ulasirim', 'eposta', 'e posta', 'mail', 'linkedin', 'github', 'telefon', 'mesaj'],
    },
    reply: (locale) => {
      const parts = [contactIntro[locale], `• E-mail : ${SITE.email}`, `• GitHub : github.com/${SITE.githubUser}`]
      if (SITE.linkedinUrl) parts.push(`• LinkedIn : ${SITE.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}`)
      return lines(...parts)
    },
    actions: SITE.linkedinUrl
      ? [{ kind: 'mail' }, { kind: 'github' }, { kind: 'linkedin' }]
      : [{ kind: 'mail' }, { kind: 'github' }],
  },
  {
    id: 'cv',
    keywords: {
      fr: ['cv', 'curriculum', 'telecharger', 'telecharge', 'telechargement', 'pdf'],
      en: ['cv', 'resume', 'curriculum', 'download', 'pdf'],
      tr: ['cv', 'ozgecmis', 'indir', 'indirmek', 'pdf'],
    },
    reply: (locale) => (SITE.cvAvailable ? cvAvailableReply[locale] : getDictionary(locale).cvPage.text),
    actions: [{ kind: 'cv' }],
  },
  {
    id: 'education',
    keywords: {
      fr: ['etudes', 'etude', 'formation', 'universite', 'diplome', 'licence', 'ecole', 'cursus', 'etudiant', 'ou etudies tu', 'etudies'],
      en: ['education', 'study', 'studies', 'university', 'degree', 'school', 'student', 'where do you study', 'background'],
      tr: ['egitim', 'universite', 'okul', 'bolum', 'okuyorsun', 'ogrenci', 'lisans', 'nerede okuyorsun'],
    },
    reply: (locale) => lines(...cv.locales[locale].education.map((entry) => `• ${entry.period} : ${entry.text}`)),
    actions: [{ kind: 'scroll', section: 'journey' }],
  },
  {
    id: 'spoken',
    keywords: {
      fr: ['langue', 'langues', 'parles tu', 'tu parles', 'quelles langues'],
      en: ['spoken languages', 'languages do you speak', 'do you speak', 'speak', 'which languages'],
      tr: ['hangi dilleri', 'dil biliyorsun', 'konusuyorsun', 'konusur', 'yabanci dil', 'diller'],
    },
    reply: (locale) => spokenLanguages.map((language) => `${language.name[locale]} (${language.level[locale]})`).join(' · '),
    actions: [{ kind: 'scroll', section: 'about' }],
  },
  {
    id: 'experience',
    keywords: {
      fr: ['experience', 'experiences', 'parcours professionnel', 'travaille', 'metier', 'boulot', 'youtube', 'community manager'],
      en: ['experience', 'work experience', 'worked', 'jobs', 'employment', 'career', 'youtube', 'community manager'],
      tr: ['deneyim', 'tecrube', 'calistin', 'is deneyimi', 'youtube', 'sosyal medya'],
    },
    reply: (locale) => lines(...cv.locales[locale].experience.map((entry) => `• ${entry.period} : ${entry.text}`)),
    actions: [{ kind: 'scroll', section: 'journey' }],
  },
  {
    id: 'location',
    keywords: {
      fr: ['ou habites tu', 'tu habites', 'habites', 'ou vis tu', 'ville', 'pays', 'origine', 'd ou viens tu', 'burkina', 'burkinabe', 'turquie', 'tokat', 'localisation', 'nationalite'],
      en: ['where do you live', 'live', 'where are you', 'where are you from', 'city', 'country', 'origin', 'location', 'nationality', 'burkina', 'turkey', 'tokat'],
      tr: ['nerede yasiyorsun', 'yasiyorsun', 'nerelisin', 'sehir', 'ulke', 'burkina', 'turkiye', 'tokat', 'nereden'],
    },
    reply: (locale) => locationReply[locale],
  },
  {
    id: 'certifications',
    keywords: {
      fr: ['certification', 'certifications', 'certificat', 'certificats', 'badge', 'attestation'],
      en: ['certification', 'certifications', 'certificate', 'certificates', 'badge', 'credential'],
      tr: ['sertifika', 'sertifikalar', 'sertifikasyon', 'belge'],
    },
    reply: (locale) => {
      const { certifications: text } = getDictionary(locale)
      if (certifications.length === 0) return `${text.emptyTitle}. ${text.emptyText}`
      return lines(certificationsListIntro[locale], ...certifications.map((item) => `• ${item.title} (${item.issuer}, ${item.date})`))
    },
    actions: [{ kind: 'scroll', section: 'certifications' }],
  },
  {
    id: 'ai',
    keywords: {
      fr: ['ia', 'intelligence artificielle', 'agents', 'agent', 'orchestrateur', 'orchestration', 'multi agents', 'banc', 'copilot', 'gemini', 'codex', 'ollama', 'architecture', 'delegation', 'manager', 'automatisation', 'llm'],
      en: ['ai', 'artificial intelligence', 'agents', 'agent', 'orchestrator', 'orchestration', 'multi agent', 'bench', 'copilot', 'gemini', 'codex', 'ollama', 'architecture', 'delegation', 'automation', 'llm'],
      tr: ['yapay zeka', 'yz', 'ajan', 'ajanlar', 'orkestrasyon', 'orkestrator', 'yonetici', 'test tezgahi', 'copilot', 'gemini', 'codex', 'ollama', 'mimari', 'otomasyon'],
    },
    reply: (locale) => {
      const dict = getDictionary(locale)
      const orchestrator = projects.find((project) => project.id === 'orchestrator')
      return lines(dict.architecture.intro, orchestrator ? orchestrator.result[locale] : '')
    },
    actions: [{ kind: 'scroll', section: 'architecture' }],
  },
  {
    id: 'bot',
    keywords: {
      fr: ['es tu une ia', 'tu es une ia', 'tu es un robot', 'robot', 'chatbot', 'bot', 'qui t a cree', 'qui t a dessine', 'qui t a fait', 'mascotte', 'dessin', 'comment tu fonctionnes', 'tu es reel'],
      en: ['are you an ai', 'are you a robot', 'robot', 'chatbot', 'bot', 'who made you', 'who drew you', 'mascot', 'how do you work', 'are you real'],
      tr: ['yapay zeka misin', 'robot musun', 'chatbot', 'bot', 'seni kim yapti', 'seni kim cizdi', 'maskot', 'nasil calisiyorsun', 'gercek misin'],
    },
    reply: (locale) => botReply[locale],
  },
  {
    id: 'greeting',
    keywords: {
      fr: ['salut', 'bonjour', 'bonsoir', 'coucou', 'hello', 'hey', 'allo'],
      en: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'greetings', 'yo'],
      tr: ['merhaba', 'selam', 'gunaydin', 'iyi aksamlar', 'slm'],
    },
    reply: (locale) => mascotText[locale].welcome.replace('{name}', MASCOT_NAME),
  },
  {
    id: 'thanks',
    keywords: {
      fr: ['merci', 'super', 'genial', 'parfait'],
      en: ['thanks', 'thank you', 'great', 'awesome', 'perfect', 'cool'],
      tr: ['tesekkurler', 'tesekkur', 'sag ol', 'harika', 'super'],
    },
    reply: (locale) => thanksReply[locale],
  },
]

export function actionHref(action: AssistantAction, locale: Locale): string {
  switch (action.kind) {
    case 'scroll':
      return `#${action.section}`
    case 'cv':
      return cvHref(locale)
    case 'mail':
      return `mailto:${SITE.email}`
    case 'github':
      return `https://github.com/${SITE.githubUser}`
    case 'linkedin':
      return SITE.linkedinUrl
  }
}
