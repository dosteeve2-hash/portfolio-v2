import type { Dictionary } from './types'

export const en: Dictionary = {
  meta: {
    title: 'Steeve Donald Compaoré — La forge du futur',
    description:
      'Portfolio of Steeve Donald Compaoré, computer science student: full stack development, AI integration and automation. Open to summer 2027 internships.',
  },
  brand: { name: 'La forge du futur', slogan: 'Where the future gets forged.' },
  nav: {
    label: 'Main navigation',
    skipToContent: 'Skip to content',
    home: 'Home',
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    architecture: 'Architecture',
    certifications: 'Certifications',
    journey: 'Journey',
    contact: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  language: { label: 'Choose language' },
  badge: 'Open to internships · Summer 2027',
  intro: {
    skip: 'Skip the introduction',
    listen: 'Listen',
    mute: 'Mute the voice',
    unmute: 'Unmute the voice',
    frameName: 'Frame — Donald',
    roles: ['software engineer', 'creator'],
  },
  hero: {
    subtitle:
      'A computer science student building complete web applications and weaving AI into them, from idea to deployment.',
    cv: 'Download my CV',
    contact: 'Get in touch',
    portraitAlt: 'Portrait of Steeve Donald Compaoré',
  },
  about: {
    title: 'About',
    paragraphs: [
      'I am a computer science student at Tokat Gaziosmanpaşa University in Turkey. I am from Burkina Faso and live in Tokat.',
      'I build software end to end: interface, API, database and deployment.',
      'I also orchestrate AI agents: a manager delegates to several models so I ship faster, without giving up code review or testing.',
      'I am looking for a summer 2027 internship in Turkey (Istanbul, Tokat) or remotely.',
    ],
    languagesTitle: 'Languages',
  },
  skills: {
    title: 'Skills',
    intro: 'Levels come from my CV; tools I use in my projects are listed without a rating.',
    levels: { veryGood: 'Very good', good: 'Good', average: 'Average' },
  },
  projects: {
    title: 'Projects',
    intro: 'Four builds, including proof of how I work with AI agents.',
    visit: 'View project',
    featured: 'Flagship proof',
    noPublicLink: 'Demo on request',
  },
  architecture: {
    title: 'Orchestrator architecture',
    intro:
      'A manager receives requests, picks the right agent, switches to another when a quota is reached and logs every delegation.',
    svgTitle: 'Multi-agent orchestrator diagram',
    svgDesc:
      'The manager sits in the centre. GitHub and Telegram feed it requests. It delegates to Copilot, Gemini, Codex and Ollama, with automatic fallback between agents, and writes every delegation to a log.',
    nodes: {
      github: { title: 'GitHub', sub: 'channel' },
      telegram: { title: 'Telegram', sub: 'channel' },
      manager: { title: 'Manager', sub: 'routing' },
      copilot: { title: 'Copilot' },
      gemini: { title: 'Gemini' },
      codex: { title: 'Codex' },
      ollama: { title: 'Ollama', sub: 'local' },
      journal: { title: 'Delegation log' },
    },
    fallback: 'quota reached → fallback',
  },
  certifications: {
    title: 'Certifications',
    intro: 'Each certification will come with its verification link.',
    emptyTitle: 'Update in progress',
    emptyText: 'Certifications will appear here as soon as they have been verified. Nothing is shown before then.',
    verify: 'Verify',
    viewPdf: 'View PDF',
  },
  journey: {
    title: 'Journey',
    items: [
      {
        period: '2022 – 2023',
        title: 'Short-cycle higher education (associate)',
        text: 'First cycle before the bachelor’s degree.',
      },
      {
        period: '2023 – present',
        title: 'BSc in Computer Science Engineering',
        text: 'Tokat Gaziosmanpaşa University, Türkiye.',
      },
      {
        period: 'Projects',
        title: 'Live applications',
        text: 'UEEMT-Tokat, CompTrack and AURA Pro are deployed and reachable from the Projects section.',
      },
      {
        period: 'Recently',
        title: 'AI agent orchestration',
        text: 'A multi-agent bench: one manager, four agents, automatic fallback on quota and a delegation log.',
      },
      {
        period: 'Summer 2027',
        title: 'Goal: an internship',
        text: 'In Turkey (Istanbul, Tokat) or remotely.',
      },
    ],
  },
  contact: {
    title: 'Contact',
    text: 'An internship, a project or a question? Write to me, I am happy to reply.',
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'Download my CV',
  },
  cvPage: {
    title: 'CV coming soon',
    text: 'My CV is not published yet. In the meantime, write to me and I will send it over.',
    back: 'Back to home',
    contact: 'Get in touch',
    draftTitle: 'Draft to validate',
    draftText: 'Preview of the versions under review. They are not officially published yet.',
  },
  notFound: {
    title: 'Page not found',
    text: 'This page does not exist or no longer exists.',
    back: 'Back to home',
  },
  footer: { rights: 'All rights reserved.' },
}

