import type { Dictionary } from './types'

export const fr: Dictionary = {
  meta: {
    title: 'Steeve Donald Compaoré — La forge du futur',
    description:
      "Portfolio de Steeve Donald Compaoré, étudiant en informatique : développement full stack, intégration d'IA et automatisation. Ouvert aux stages d'été 2027.",
  },
  brand: { name: 'La forge du futur', slogan: 'Là où le futur commence.' },
  nav: {
    label: 'Navigation principale',
    skipToContent: 'Aller au contenu',
    home: 'Accueil',
    about: 'À propos',
    skills: 'Compétences',
    projects: 'Projets',
    architecture: 'Architecture',
    certifications: 'Certifications',
    journey: 'Parcours',
    contact: 'Contact',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
  language: { label: 'Choisir la langue' },
  badge: 'Ouvert aux stages · Été 2027',
  intro: {
    skip: "Passer l'introduction",
    mute: 'Couper la voix',
    unmute: 'Remettre la voix',
    frameName: 'Cadre — Donald',
    roles: ['ingénieur logiciel', 'créateur'],
  },
  hero: {
    subtitle:
      "Étudiant en informatique, je construis des applications web complètes et j'y intègre l'IA, de l'idée jusqu'au déploiement.",
    cv: 'Télécharger mon CV',
    contact: 'Me contacter',
    portraitAlt: 'Portrait de Steeve Donald Compaoré',
  },
  about: {
    title: 'À propos',
    paragraphs: [
      "Je suis étudiant en informatique à l'Université de Tokat Gaziosmanpaşa, en Turquie. Burkinabè, je vis à Tokat.",
      "Je construis des logiciels de bout en bout : interface, API, base de données et déploiement.",
      "J'orchestre aussi des agents IA : un manager délègue à plusieurs modèles pour que je livre plus vite, sans renoncer à la relecture ni aux tests.",
      "Je cherche un stage d'été 2027 en Turquie (Istanbul, Tokat) ou à distance.",
    ],
    languagesTitle: 'Langues',
  },
  skills: {
    title: 'Compétences',
    intro: 'Niveaux issus de mon CV ; les outils que j’utilise dans mes projets sont listés sans note.',
    levels: { veryGood: 'Très bien', good: 'Bien', average: 'Moyen' },
  },
  projects: {
    title: 'Projets',
    intro: "Neuf réalisations : un banc d'agents IA, des applications en ligne et l'écosystème FORGE Afrika qui les relie.",
    visit: 'Voir en ligne',
    featured: 'Preuve phare',
    noPublicLink: 'Démonstration sur demande',
    statuses: {
      running: 'En fonctionnement',
      live: 'En ligne',
      dev: 'En développement',
      proto: 'Prototype',
      hub: 'Écosystème',
    },
  },
  architecture: {
    title: "Architecture de l'orchestrateur",
    intro:
      'Un manager reçoit les demandes, choisit le bon agent, bascule sur un autre si un quota est atteint et consigne chaque délégation.',
    svgTitle: "Schéma de l'orchestrateur multi-agents",
    svgDesc:
      "Le manager est au centre. GitHub et Telegram l'alimentent en demandes. Il délègue à Copilot, Gemini, Codex et Ollama, avec un repli automatique entre agents, et écrit chaque délégation dans un journal.",
    nodes: {
      github: { title: 'GitHub', sub: 'canal' },
      telegram: { title: 'Telegram', sub: 'canal' },
      manager: { title: 'Manager', sub: 'routage' },
      copilot: { title: 'Copilot' },
      gemini: { title: 'Gemini' },
      codex: { title: 'Codex' },
      ollama: { title: 'Ollama', sub: 'local' },
      journal: { title: 'Journal de délégation' },
    },
    fallback: 'quota atteint → repli',
  },
  certifications: {
    title: 'Certifications',
    intro:
      "Treize certifications LinkedIn Learning et une attestation universitaire, chacune avec son PDF d'origine.",
    statCount: 'certifications',
    statHours: 'heures de formation',
    groups: {
      ai: 'IA et agents',
      web: 'Web, JavaScript et TypeScript',
      design: 'Design',
      university: 'Formations universitaires',
    },
    verify: 'Vérifier sur LinkedIn',
    viewPdf: 'Voir le certificat',
    idLabel: 'Identifiant',
    hourUnit: 'h',
    minuteUnit: 'min',
  },
  journey: {
    title: 'Parcours',
    items: [
      {
        period: '2022 – 2023',
        title: 'Études supérieures courtes (associate)',
        text: 'Premier cycle avant la licence.',
      },
      {
        period: '2023 – aujourd’hui',
        title: 'Licence en génie informatique',
        text: 'Université de Tokat Gaziosmanpaşa, Türkiye.',
      },
      {
        period: 'Projets',
        title: 'Applications en ligne',
        text: 'UEEMT-Tokat, CompTrack, MIFA Life Shop et ValueChain Connect sont en ligne, accessibles depuis la section Projets.',
      },
      {
        period: 'Récemment',
        title: "Orchestration d'agents IA",
        text: 'Un banc multi-agents : un manager, quatre agents, un repli automatique en cas de quota et un journal de délégation.',
      },
      {
        period: 'Été 2027',
        title: 'Objectif : un stage',
        text: 'En Turquie (Istanbul, Tokat) ou à distance.',
      },
    ],
  },
  contact: {
    title: 'Contact',
    text: "Un stage, une mission ou une question ? Écrivez-moi, je réponds volontiers.",
    email: 'E-mail',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'Télécharger mon CV',
  },
  cvPage: {
    title: 'CV bientôt disponible',
    text: "Mon CV n'est pas encore publié. En attendant, écrivez-moi et je vous l'envoie.",
    back: "Retour à l'accueil",
    contact: 'Me contacter',
    draftTitle: 'Brouillon à valider',
    draftText: 'Aperçu des versions en cours de relecture. Elles ne sont pas encore publiées officiellement.',
  },
  notFound: {
    title: 'Page introuvable',
    text: "Cette page n'existe pas ou n'existe plus.",
    back: "Retour à l'accueil",
  },
  footer: { rights: 'Tous droits réservés.' },
}
