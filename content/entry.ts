import type { Locale, Localized } from './locales'

/**
 * Textes des deux pages d'entrée : /stage (formation, curiosité, disponibilité été 2027) et /emploi
 * (production, qualité, sécurité, déploiements). Tout fait avancé ici vient d'un dépôt, d'un test ou du CV :
 * aucun client, aucun chiffre d'usage, aucun témoignage. {n} = projets accessibles en ligne.
 * TODO relecture TR : traduction à faire relire par un locuteur natif.
 */

export interface Figure {
  readonly value: number
  readonly suffix?: string
  readonly label: string
}

export interface Cartouche {
  readonly name: string
  readonly formation: string
  readonly place: string
  readonly languages: string
  readonly availability: string
  readonly labels: {
    readonly name: string
    readonly formation: string
    readonly place: string
    readonly languages: string
    readonly availability: string
  }
}

export interface CaseText {
  readonly problem: string
  readonly choice: string
  readonly proofs: readonly string[]
}

export interface EntryCommon {
  readonly spec: string
  readonly problem: string
  readonly choice: string
  readonly proof: string
  readonly testsLabel: string
  readonly seeAllProjects: string
  readonly progressLabel: string
}

export interface StageCopy {
  readonly metaTitle: string
  readonly metaDescription: string
  readonly kicker: string
  readonly title: string
  readonly lead: string
  readonly cv: string
  readonly write: string
  readonly figures: readonly [string, string, string]
  readonly cartouche: Cartouche
  readonly formationTitle: string
  readonly formationIntro: string
  readonly projectsTitle: string
  readonly projectsIntro: string
  readonly availabilityTitle: string
  readonly availabilityIntro: string
  readonly availabilityPoints: readonly string[]
  readonly otherEntry: string
}

export interface EmploiCopy {
  readonly metaTitle: string
  readonly metaDescription: string
  readonly kicker: string
  readonly title: string
  readonly lead: string
  readonly contact: string
  readonly cv: string
  readonly figures: readonly [string, string, string]
  readonly figureNote: string
  readonly cartouche: Cartouche
  readonly otherEntry: string
  readonly casesTitle: string
  readonly casesIntro: string
  readonly proofTitle: string
  readonly proofIntro: string
  readonly qualityTitle: string
  readonly qualityPoints: readonly string[]
  readonly securityTitle: string
  readonly securityPoints: readonly string[]
  readonly deployTitle: string
  readonly deployPoints: readonly string[]
}

interface EntryLocale {
  readonly common: EntryCommon
  readonly stage: StageCopy
  readonly emploi: EmploiCopy
}

const fr: EntryLocale = {
  common: {
    spec: 'SPEC',
    problem: 'Problème',
    choice: 'Choix techniques',
    proof: 'Preuves',
    testsLabel: 'tests automatisés',
    seeAllProjects: 'Voir les {n} projets',
    progressLabel: 'Progression de la lecture',
  },
  stage: {
    metaTitle: 'Stage été 2027 — Steeve Donald Compaoré, étudiant en génie logiciel',
    metaDescription:
      "Étudiant en 4e année d'informatique à l'Université de Tokat Gaziosmanpaşa, disponible pour un stage à l'été 2027 en Turquie ou à distance : projets en ligne, certifications, CV.",
    kicker: 'Stage · Été 2027',
    title: 'Un stagiaire qui arrive avec {n} projets déjà en ligne.',
    lead: "Étudiant en 4e année d'informatique à l'Université de Tokat Gaziosmanpaşa. Je cherche un stage d'été 2027 en Turquie (Istanbul, Tokat) ou à distance, et je viens pour apprendre en livrant.",
    cv: 'Télécharger le CV',
    write: 'ou écrivez-moi',
    figures: ['projets en ligne', 'certifications', 'heures de formation'],
    cartouche: {
      name: 'Steeve Donald Compaoré',
      formation: 'Licence en génie informatique, 4e année',
      place: 'Tokat, Turquie',
      languages: 'Français, anglais, turc',
      availability: "Stage d'été 2027",
      labels: { name: 'Nom', formation: 'Formation', place: 'Lieu', languages: 'Langues de travail', availability: 'Disponibilité' },
    },
    formationTitle: 'Formation et curiosité',
    formationIntro:
      "Un cursus universitaire, complété par des certifications suivies en dehors des cours : IA, web, TypeScript, design. Les niveaux de compétence sont ceux de mon CV, sans arrondi.",
    projectsTitle: 'Des projets pour un stage',
    projectsIntro:
      "Choisis pour montrer ce que j'apprends : un jeu hors ligne, la plateforme d'une association, un outil de commerce, un prototype testé et un banc d'agents IA. Les statuts sont ceux des dépôts.",
    availabilityTitle: 'Disponibilité',
    availabilityIntro: "Ce que j'attends d'un stage, et ce que je peux apporter dès la première semaine.",
    availabilityPoints: [
      "Période : été 2027 ; la durée se discute avec vous.",
      "Lieu : Turquie (Istanbul, Tokat) ou à distance.",
      "Sur un code existant : lire, tester, corriger, livrer par petites étapes.",
      "Langues de travail : français, anglais, turc.",
    ],
    otherEntry: "Vous recrutez pour un poste plutôt qu'un stage ?",
  },
  emploi: {
    metaTitle: 'Emploi — Steeve Donald Compaoré, développeur full stack',
    metaDescription:
      'Applications testées et déployées : Next.js, TypeScript, PostgreSQL, Vercel. Études de cas avec architecture et preuves, CV et contact.',
    kicker: 'Emploi · Développement logiciel',
    title: 'Je livre des applications testées et déployées de A à Z.',
    lead: "Étudiant en génie logiciel (4e année, Université de Tokat Gaziosmanpaşa). Next.js, TypeScript, PostgreSQL, déploiement sur Vercel, tests automatisés, interfaces en trois langues. Ouvert aux opportunités en Turquie ou à distance.",
    contact: 'Me contacter',
    cv: 'ou télécharger le CV',
    figures: ['projets en ligne', 'tests automatisés (2 projets)', 'accessibilité Lighthouse de ce site'],
    figureNote: 'Mesure locale du 27/10/2026 sur ce site ; les tests sont ceux des dépôts COMBINE et FINE Game.',
    cartouche: {
      name: 'Steeve Donald Compaoré',
      formation: 'Licence en génie informatique, 4e année',
      place: 'Tokat, Turquie',
      languages: 'Français, anglais, turc',
      availability: 'Ouvert aux opportunités',
      labels: { name: 'Nom', formation: 'Formation', place: 'Lieu', languages: 'Langues de travail', availability: 'Disponibilité' },
    },
    otherEntry: "Vous cherchez un stagiaire pour l'été 2027 ?",
    casesTitle: 'Cinq études de cas',
    casesIntro:
      "Pour chaque projet : le problème, les choix techniques, et ce qui peut être vérifié. Quand il n'y a pas de preuve, il n'y a pas de ligne.",
    proofTitle: 'Qualité, sécurité, déploiements',
    proofIntro: 'Trois contrôles, avec ce qui est réellement en place, projet par projet.',
    qualityTitle: 'Qualité',
    qualityPoints: [
      "125 tests automatisés dans deux projets : 93 sur COMBINE (TypeScript, ESLint et build verts) et 32 sur le moteur de FINE Game.",
      "Le moteur de FINE Game est équilibré par simulation de 3 000 parties.",
      "Ce site : accessibilité et bonnes pratiques Lighthouse à 100 sur le banc local ; mouvement réduit respecté.",
      "Les README de onze dépôts ont été relus le 27/10/2026 : fonctions non livrées passées en « prévu », chiffres inventés retirés.",
    ],
    securityTitle: 'Sécurité',
    securityPoints: [
      "En-têtes HTTP de sécurité sur ce site (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).",
      "Authentification déléguée à une bibliothèque (Better Auth sur COMBINE et Indubot Afrika), validation des entrées avec Zod sur COMBINE et MIFA Life Shop.",
      "Aucun secret dans l'historique : analyse gitleaks de 24 dépôts le 03/10/2026, aucun vrai secret trouvé.",
    ],
    deployTitle: 'Déploiements',
    deployPoints: [
      "{n} projets accessibles en ligne sur Vercel, chacun avec son adresse publique dans la section Projets.",
      "Déploiements en ligne de commande ou depuis Git ; ce portfolio et FINE Game partent de la ligne de commande.",
      "Un prototype (COMBINE) reste volontairement hors ligne : pas de déploiement public tant qu'il n'a pas de base de données validée.",
    ],
  },
}

const en: EntryLocale = {
  common: {
    spec: 'SPEC',
    problem: 'Problem',
    choice: 'Technical choices',
    proof: 'Evidence',
    testsLabel: 'automated tests',
    seeAllProjects: 'See all {n} projects',
    progressLabel: 'Reading progress',
  },
  stage: {
    metaTitle: 'Internship summer 2027 — Steeve Donald Compaoré, software engineering student',
    metaDescription:
      'Third-year computer science student at Tokat Gaziosmanpaşa University, available for a summer 2027 internship in Turkey or remotely: live projects, certifications, CV.',
    kicker: 'Internship · Summer 2027',
    title: 'An intern who arrives with {n} projects already online.',
    lead: 'Third-year computer science student at Tokat Gaziosmanpaşa University. I am looking for a summer 2027 internship in Turkey (Istanbul, Tokat) or remotely, and I come to learn by shipping.',
    cv: 'Download the CV',
    write: 'or write to me',
    figures: ['projects online', 'certifications', 'hours of training'],
    cartouche: {
      name: 'Steeve Donald Compaoré',
      formation: 'BSc Computer Science Engineering, year 3',
      place: 'Tokat, Türkiye',
      languages: 'French, English, Turkish',
      availability: 'Summer 2027 internship',
      labels: { name: 'Name', formation: 'Studies', place: 'Location', languages: 'Working languages', availability: 'Availability' },
    },
    formationTitle: 'Studies and curiosity',
    formationIntro:
      'A university degree, completed by certificates taken outside class: AI, web, TypeScript, design. Skill levels are the ones on my CV, not rounded up.',
    projectsTitle: 'Projects for an internship',
    projectsIntro:
      "Chosen to show what I am learning: an offline game, a student association's platform, a trading tool, a tested prototype and an AI agent bench. Statuses are the ones in the repositories.",
    availabilityTitle: 'Availability',
    availabilityIntro: 'What I expect from an internship, and what I can bring from the first week.',
    availabilityPoints: [
      'Period: summer 2027; the length is open for discussion.',
      'Place: Turkey (Istanbul, Tokat) or remote.',
      'On an existing codebase: read, test, fix, ship in small steps.',
      'Working languages: French, English, Turkish.',
    ],
    otherEntry: 'Hiring for a role rather than an internship?',
  },
  emploi: {
    metaTitle: 'Job — Steeve Donald Compaoré, full stack developer',
    metaDescription:
      'Tested, deployed applications: Next.js, TypeScript, PostgreSQL, Vercel. Case studies with architecture and evidence, CV and contact.',
    kicker: 'Job · Software development',
    title: 'I ship tested, deployed applications from start to finish.',
    lead: 'Software engineering student (year 3, Tokat Gaziosmanpaşa University). Next.js, TypeScript, PostgreSQL, deployment on Vercel, automated tests, interfaces in three languages. Open to opportunities in Turkey or remotely.',
    contact: 'Get in touch',
    cv: 'or download the CV',
    figures: ['projects online', 'automated tests (2 projects)', 'Lighthouse accessibility of this site'],
    figureNote: 'Local measurement of 27/10/2026 on this site; the tests are those of the COMBINE and FINE Game repositories.',
    cartouche: {
      name: 'Steeve Donald Compaoré',
      formation: 'BSc Computer Science Engineering, year 3',
      place: 'Tokat, Türkiye',
      languages: 'French, English, Turkish',
      availability: 'Open to opportunities',
      labels: { name: 'Name', formation: 'Studies', place: 'Location', languages: 'Working languages', availability: 'Availability' },
    },
    otherEntry: 'Looking for a summer 2027 intern?',
    casesTitle: 'Five case studies',
    casesIntro: 'For each project: the problem, the technical choices, and what can be verified. Where there is no evidence, there is no line.',
    proofTitle: 'Quality, security, deployments',
    proofIntro: 'Three checks, with what is really in place, project by project.',
    qualityTitle: 'Quality',
    qualityPoints: [
      '125 automated tests across two projects: 93 on COMBINE (TypeScript, ESLint and build all green) and 32 on the FINE Game engine.',
      'The FINE Game engine is balanced by simulating 3,000 games.',
      'This site: Lighthouse accessibility and best practices at 100 on the local bench; reduced motion respected.',
      'The READMEs of eleven repositories were reviewed on 27/10/2026: unshipped features moved to “planned”, invented figures removed.',
    ],
    securityTitle: 'Security',
    securityPoints: [
      'Security HTTP headers on this site (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).',
      'Authentication delegated to a library (Better Auth on COMBINE and Indubot Afrika), input validation with Zod on COMBINE and MIFA Life Shop.',
      'No secret in the history: gitleaks scan of 24 repositories on 03/10/2026, no real secret found.',
    ],
    deployTitle: 'Deployments',
    deployPoints: [
      '{n} projects reachable online on Vercel, each with its public address in the Projects section.',
      'Deployments from the command line or from Git; this portfolio and FINE Game ship from the command line.',
      'One prototype (COMBINE) deliberately stays offline: no public deployment until its database is validated.',
    ],
  },
}

const tr: EntryLocale = {
  common: {
    spec: 'ŞARTNAME',
    problem: 'Sorun',
    choice: 'Teknik tercihler',
    proof: 'Kanıtlar',
    testsLabel: 'otomatik test',
    seeAllProjects: '{n} projenin tümünü gör',
    progressLabel: 'Okuma ilerlemesi',
  },
  stage: {
    metaTitle: 'Yaz 2027 stajı — Steeve Donald Compaoré, yazılım mühendisliği öğrencisi',
    metaDescription:
      'Tokat Gaziosmanpaşa Üniversitesi bilgisayar mühendisliği 4. sınıf öğrencisi; 2027 yazında Türkiye’de veya uzaktan staja hazır: yayındaki projeler, sertifikalar, CV.',
    kicker: 'Staj · Yaz 2027',
    title: '{n} projesi zaten yayında olan bir stajyer.',
    lead: 'Tokat Gaziosmanpaşa Üniversitesi’nde bilgisayar mühendisliği 4. sınıf öğrencisiyim. 2027 yazı için Türkiye’de (İstanbul, Tokat) veya uzaktan bir staj arıyorum; teslim ederek öğrenmeye geliyorum.',
    cv: 'CV’yi indir',
    write: 'ya da bana yazın',
    figures: ['yayındaki proje', 'sertifika', 'saat eğitim'],
    cartouche: {
      name: 'Steeve Donald Compaoré',
      formation: 'Bilgisayar mühendisliği lisansı, 4. sınıf',
      place: 'Tokat, Türkiye',
      languages: 'Fransızca, İngilizce, Türkçe',
      availability: '2027 yaz stajı',
      labels: { name: 'Ad', formation: 'Eğitim', place: 'Konum', languages: 'Çalışma dilleri', availability: 'Müsaitlik' },
    },
    formationTitle: 'Eğitim ve merak',
    formationIntro:
      'Bir üniversite eğitimi ve ders dışında alınmış sertifikalar: yapay zekâ, web, TypeScript, tasarım. Yetenek düzeyleri CV’mdekilerdir, yukarı yuvarlanmamıştır.',
    projectsTitle: 'Staj için projeler',
    projectsIntro:
      'Ne öğrendiğimi göstermek için seçildi: çevrimdışı bir oyun, bir öğrenci derneğinin platformu, bir ticaret aracı, test edilmiş bir prototip ve bir yapay zekâ ajan tezgâhı. Durumlar depolardaki durumlardır.',
    availabilityTitle: 'Müsaitlik',
    availabilityIntro: 'Bir stajdan beklentim ve ilk haftadan getirebileceklerim.',
    availabilityPoints: [
      'Dönem: 2027 yazı; süre sizinle konuşularak belirlenir.',
      'Yer: Türkiye (İstanbul, Tokat) veya uzaktan.',
      'Mevcut bir kod tabanında: okumak, test etmek, düzeltmek, küçük adımlarla teslim etmek.',
      'Çalışma dilleri: Fransızca, İngilizce, Türkçe.',
    ],
    otherEntry: 'Staj yerine bir pozisyon için mi arıyorsunuz?',
  },
  emploi: {
    metaTitle: 'İş — Steeve Donald Compaoré, full stack geliştirici',
    metaDescription:
      'Test edilmiş ve yayına alınmış uygulamalar: Next.js, TypeScript, PostgreSQL, Vercel. Mimari ve kanıtlarla örnek çalışmalar, CV ve iletişim.',
    kicker: 'İş · Yazılım geliştirme',
    title: 'Baştan sona test edilmiş ve yayına alınmış uygulamalar teslim ederim.',
    lead: 'Yazılım mühendisliği öğrencisi (4. sınıf, Tokat Gaziosmanpaşa Üniversitesi). Next.js, TypeScript, PostgreSQL, Vercel’de yayına alma, otomatik testler, üç dilli arayüzler. Türkiye’de veya uzaktan fırsatlara açığım.',
    contact: 'Benimle iletişime geç',
    cv: 'ya da CV’yi indir',
    figures: ['yayındaki proje', 'otomatik test (2 proje)', 'bu sitenin Lighthouse erişilebilirliği'],
    figureNote: 'Bu sitede 27/10/2026 tarihli yerel ölçüm; testler COMBINE ve FINE Game depolarına aittir.',
    cartouche: {
      name: 'Steeve Donald Compaoré',
      formation: 'Bilgisayar mühendisliği lisansı, 4. sınıf',
      place: 'Tokat, Türkiye',
      languages: 'Fransızca, İngilizce, Türkçe',
      availability: 'Fırsatlara açık',
      labels: { name: 'Ad', formation: 'Eğitim', place: 'Konum', languages: 'Çalışma dilleri', availability: 'Müsaitlik' },
    },
    otherEntry: '2027 yazı için bir stajyer mi arıyorsunuz?',
    casesTitle: 'Beş örnek çalışma',
    casesIntro: 'Her proje için: sorun, teknik tercihler ve doğrulanabilir olanlar. Kanıt yoksa satır da yok.',
    proofTitle: 'Kalite, güvenlik, yayına alma',
    proofIntro: 'Üç kontrol; gerçekten uygulananlar, proje proje.',
    qualityTitle: 'Kalite',
    qualityPoints: [
      'İki projede 125 otomatik test: COMBINE’de 93 (TypeScript, ESLint ve derleme yeşil) ve FINE Game motorunda 32.',
      'FINE Game motoru 3.000 oyunluk benzetimle dengelendi.',
      'Bu site: yerel ölçümde Lighthouse erişilebilirlik ve en iyi uygulamalar 100; azaltılmış hareket tercihine saygı gösterilir.',
      'On bir deponun README dosyaları 27/10/2026’da gözden geçirildi: teslim edilmemiş özellikler “planlandı”ya alındı, uydurma rakamlar kaldırıldı.',
    ],
    securityTitle: 'Güvenlik',
    securityPoints: [
      'Bu sitede güvenlik HTTP başlıkları (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).',
      'Kimlik doğrulama bir kütüphaneye devredildi (COMBINE ve Indubot Afrika’da Better Auth); girdi doğrulaması COMBINE ve MIFA Life Shop’ta Zod ile.',
      'Geçmişte sır yok: 03/10/2026’da 24 depoda gitleaks taraması, gerçek bir sır bulunmadı.',
    ],
    deployTitle: 'Yayına alma',
    deployPoints: [
      'Vercel’de çevrimiçi erişilebilen {n} proje; her birinin herkese açık adresi Projeler bölümünde.',
      'Komut satırından veya Git’ten yayına alma; bu portfolyo ve FINE Game komut satırından yayınlanır.',
      'Bir prototip (COMBINE) bilerek çevrimdışı tutuluyor: veritabanı doğrulanana kadar herkese açık yayın yok.',
    ],
  },
}

export const entry: Readonly<Record<Locale, EntryLocale>> = { fr, en, tr }

export interface CaseStudy {
  readonly id: string
  readonly texts: Readonly<Record<Locale, CaseText>>
}

const t = (fr: CaseText, en: CaseText, tr: CaseText): Readonly<Record<Locale, CaseText>> => ({ fr, en, tr })

/** Études de cas : le nom, la pile, le statut et l'adresse viennent de content/projects.ts. */
export const caseStudies: readonly CaseStudy[] = [
  {
    id: 'finegame',
    texts: t(
      {
        problem: "Apprendre à gérer son argent en jouant, sans connexion, en français, en anglais et en turc.",
        choice:
          "Un moteur de règles séparé de l'interface, donc testable seul ; une application web installable (PWA) qui marche hors ligne ; 2 à 4 joueurs ou robots.",
        proofs: ['32 tests automatisés sur le moteur', 'Équilibrage par simulation de 3 000 parties', 'En ligne, interface en trois langues'],
      },
      {
        problem: 'Learning to manage money by playing, offline, in French, English and Turkish.',
        choice:
          'A rules engine separated from the interface, so it can be tested on its own; an installable web app (PWA) that works offline; 2 to 4 players or bots.',
        proofs: ['32 automated tests on the engine', 'Balanced by simulating 3,000 games', 'Online, interface in three languages'],
      },
      {
        problem: 'Parayı oynayarak yönetmeyi öğrenmek: çevrimdışı; Fransızca, İngilizce ve Türkçe.',
        choice:
          'Arayüzden ayrılmış bir kural motoru, yani tek başına test edilebilir; çevrimdışı çalışan kurulabilir bir web uygulaması (PWA); 2 ila 4 oyuncu veya robot.',
        proofs: ['Motorda 32 otomatik test', '3.000 oyunluk benzetimle dengeleme', 'Çevrimiçi, üç dilli arayüz'],
      },
    ),
  },
  {
    id: 'combine',
    texts: t(
      {
        problem: 'Relier porteurs de projets, incubateurs et financeurs autour d’un dossier vérifiable.',
        choice:
          'Next.js et TypeScript, base Neon Postgres, authentification Better Auth, validation des entrées avec Zod, tests de bout en bout Playwright.',
        proofs: ['93 tests ; TypeScript, ESLint et build verts', 'CI verte sur la première demande de fusion', 'Prototype : non déployé publiquement, aucun client'],
      },
      {
        problem: 'Linking project founders, incubators and funders around a verifiable file.',
        choice:
          'Next.js and TypeScript, Neon Postgres database, Better Auth authentication, input validation with Zod, Playwright end-to-end tests.',
        proofs: ['93 tests; TypeScript, ESLint and build green', 'CI green on the first pull request', 'Prototype: not publicly deployed, no customer'],
      },
      {
        problem: 'Proje sahiplerini, kuluçka merkezlerini ve finansörleri doğrulanabilir bir dosya etrafında buluşturmak.',
        choice:
          'Next.js ve TypeScript, Neon Postgres veritabanı, Better Auth kimlik doğrulaması, Zod ile girdi doğrulaması, Playwright uçtan uca testler.',
        proofs: ['93 test; TypeScript, ESLint ve derleme yeşil', 'İlk birleştirme isteğinde CI yeşil', 'Prototip: herkese açık yayın yok, müşteri yok'],
      },
    ),
  },
  {
    id: 'orchestrator',
    texts: t(
      {
        problem: "Un quota d'agent IA épuisé ne doit pas arrêter le travail.",
        choice:
          'Un gestionnaire route chaque tâche vers un agent (Copilot, Gemini, Codex, Ollama), bascule sur le suivant quand un quota est atteint et journalise chaque délégation. Scripts PowerShell, canal GitHub.',
        proofs: ['Canal GitHub testé de bout en bout (réponse en 6 s)', 'Journal de délégation tenu', 'En fonctionnement, usage personnel'],
      },
      {
        problem: 'An exhausted AI agent quota must not stop the work.',
        choice:
          'A manager routes each task to an agent (Copilot, Gemini, Codex, Ollama), switches to the next one when a quota is reached and logs every delegation. PowerShell scripts, GitHub channel.',
        proofs: ['GitHub channel tested end to end (6 s reply)', 'Delegation log kept', 'Running, personal use'],
      },
      {
        problem: 'Tükenen bir yapay zekâ ajan kotası işi durdurmamalı.',
        choice:
          'Bir yönetici her görevi bir ajana (Copilot, Gemini, Codex, Ollama) yönlendirir, kota dolunca bir sonrakine geçer ve her devri kaydeder. PowerShell betikleri, GitHub kanalı.',
        proofs: ['GitHub kanalı uçtan uca test edildi (6 sn yanıt)', 'Devir günlüğü tutuluyor', 'Çalışıyor, kişisel kullanım'],
      },
    ),
  },
  {
    id: 'sugu',
    texts: t(
      {
        problem: 'Un commerçant informel tient ses ventes, son stock et ses crédits clients sur un cahier.',
        choice:
          'Next.js et TypeScript, interface pensée pour le téléphone, en français, anglais, jula et mooré ; conçu pour fonctionner hors connexion.',
        proofs: ['Aperçu en ligne', 'Statut honnête : en développement', 'Les moyens de paiement mobile sont des libellés, sans intégration'],
      },
      {
        problem: 'An informal trader keeps sales, stock and customer credit in a notebook.',
        choice:
          'Next.js and TypeScript, phone-first interface in French, English, Jula and Mooré; designed to work offline.',
        proofs: ['Preview online', 'Honest status: in development', 'Mobile payment methods are labels only, with no integration'],
      },
      {
        problem: 'Kayıt dışı bir esnaf satışlarını, stokunu ve müşteri veresiyesini defterde tutuyor.',
        choice:
          'Next.js ve TypeScript; Fransızca, İngilizce, Jula ve Mooré dillerinde, telefon öncelikli arayüz; çevrimdışı çalışacak şekilde tasarlandı.',
        proofs: ['Önizleme çevrimiçi', 'Dürüst durum: geliştirme aşamasında', 'Mobil ödeme yöntemleri yalnızca etiket, entegrasyon yok'],
      },
    ),
  },
  {
    id: 'ueemt',
    texts: t(
      {
        problem: "Une association étudiante a besoin d'un endroit commun : actualités, albums, annuaire des membres.",
        choice: 'Next.js, TypeScript et Supabase ; notifications push web ; interface pour téléphone.',
        proofs: ['En ligne', 'Fil d’actualités, albums, annuaire des membres, notifications', 'Projet associatif'],
      },
      {
        problem: 'A student association needs one shared place: news, albums, member directory.',
        choice: 'Next.js, TypeScript and Supabase; web push notifications; phone-friendly interface.',
        proofs: ['Online', 'News feed, albums, member directory, notifications', 'Association project'],
      },
      {
        problem: 'Bir öğrenci derneğinin ortak bir yere ihtiyacı var: haberler, albümler, üye rehberi.',
        choice: 'Next.js, TypeScript ve Supabase; web anlık bildirimleri; telefona uygun arayüz.',
        proofs: ['Çevrimiçi', 'Haber akışı, albümler, üye rehberi, bildirimler', 'Dernek projesi'],
      },
    ),
  },
]

/** Projets de /stage, dans l'ordre voulu pour un stage (démonstrations accessibles d'abord). */
export const stageProjectOrder: readonly string[] = ['finegame', 'ueemt', 'sugu', 'combine', 'orchestrator', 'mifa']

export const localizedCount = (text: string, n: number): string => text.replaceAll('{n}', String(n))

export type { Localized }
