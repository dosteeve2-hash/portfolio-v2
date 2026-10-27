import type { Localized } from './locales'

/**
 * running : système en fonctionnement (usage personnel) · live : application déployée
 * dev : en développement · proto : prototype non déployé
 */
export type ProjectStatus = 'running' | 'live' | 'dev' | 'proto'

export interface Project {
  readonly id: string
  readonly name: Localized
  /** Slogan PROPOSÉ (tiré des fichiers du dépôt, voir FAITS_PROJETS.md) : à valider par Steeve. */
  readonly tagline: Localized
  readonly result: Localized
  /** Pile relevée dans le package.json du dépôt. */
  readonly stack: readonly string[]
  readonly status: ProjectStatus
  /** Renseigné seulement si l'adresse répond HTTP 200 (testé le 2026-10-27). */
  readonly href?: string
  readonly featured?: boolean
  /** Dossier du symbole dans public/logos/. */
  readonly logo: string
  /** Couleur propre au projet (lueur de survol). */
  readonly accent: string
  /** Mois du premier commit du dépôt (AAAA-MM), pour la frise chronologique. */
  readonly since: string
  /** Préfixe des médias de public/projects/ (<capture>-d.webp, <capture>-m.webp, <capture>.webm, <capture>.mp4). Absent : aucun site public à filmer. */
  readonly capture?: string
  /** Nombre de tests automatisés vérifié dans le dépôt (ETAT.md du 2026-10-18 et du 2026-09-24). */
  readonly tests?: number
}

export const projects: readonly Project[] = [
  {
    id: 'orchestrator',
    featured: true,
    logo: 'banc-ia',
    accent: '#1d4ed8',
    since: '2026-10',
    name: {
      fr: "Banc d'orchestration IA",
      en: 'AI orchestration bench',
      tr: 'Yapay zekâ orkestrasyon tezgâhı',
    },
    tagline: {
      fr: 'Un manager, plusieurs agents, aucun arrêt faute de quota.',
      en: 'One manager, several agents, no stop when a quota runs out.',
      tr: 'Bir yönetici, birden fazla ajan, kota bitince bile duraksama yok.',
    },
    result: {
      fr: "Un manager délègue le travail à plusieurs agents (Copilot, Gemini, Codex, Ollama), route chaque tâche, bascule automatiquement en cas de quota et garde un journal de délégation.",
      en: 'A manager delegates work to several agents (Copilot, Gemini, Codex, Ollama), routes each task, falls back automatically when a quota is hit and keeps a delegation log.',
      tr: 'Bir yönetici, işi birden fazla ajana (Copilot, Gemini, Codex, Ollama) devreder, her görevi yönlendirir, kota dolduğunda otomatik olarak yedeğe geçer ve bir devir günlüğü tutar.',
    },
    stack: ['PowerShell', 'GitHub', 'Telegram', 'Ollama'],
    status: 'running',
  },
  {
    id: 'combine',
    logo: 'combine',
    accent: '#1BA899',
    since: '2026-09',
    name: { fr: 'COMBINE', en: 'COMBINE', tr: 'COMBINE' },
    tagline: {
      fr: 'Du dossier vérifiable au financement.',
      en: 'From a verifiable file to funding.',
      tr: 'Doğrulanabilir dosyadan finansmana.',
    },
    result: {
      fr: 'Une plateforme qui relie porteurs de projets africains, incubateurs et financeurs : dossier vérifiable, appels à candidatures, espace investisseur privé.',
      en: 'A platform linking African project founders, incubators and funders: a verifiable project file, calls for applications and a private investor space.',
      tr: 'Afrikalı proje sahiplerini, kuluçka merkezlerini ve finansörleri buluşturan platform: doğrulanabilir dosya, başvuru çağrıları ve özel yatırımcı alanı.',
    },
    stack: ['Next.js', 'TypeScript', 'Neon Postgres', 'Better Auth', 'Zod', 'Tailwind CSS', 'Playwright'],
    status: 'proto',
    tests: 93,
  },
  {
    id: 'sugu',
    logo: 'sugu',
    accent: '#E3A00F',
    since: '2026-07',
    capture: 'sugu',
    name: { fr: 'SUGU', en: 'SUGU', tr: 'SUGU' },
    tagline: {
      fr: 'Le cahier de comptes du commerçant, sur téléphone.',
      en: "The trader's account book, on a phone.",
      tr: 'Esnafın veresiye defteri, telefonda.',
    },
    result: {
      fr: 'Un outil de gestion pour le commerce informel : produits, ventes, stock et clients, en français, anglais, jula et mooré, utilisable hors connexion.',
      en: 'A management tool for informal trade: products, sales, stock and customers, in French, English, Jula and Mooré, usable offline.',
      tr: 'Kayıt dışı (enformel) ticaret için yönetim aracı: ürünler, satışlar, stok ve müşteriler; Fransızca, İngilizce, Jula ve Mooré dillerinde, çevrimdışı kullanılabilir.',
    },
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Framer Motion'],
    status: 'dev',
    href: 'https://duka-kappa.vercel.app',
  },
  {
    id: 'milltrack',
    logo: 'milltrack',
    accent: '#1F9AC7',
    since: '2026-06',
    capture: 'milltrack',
    name: { fr: 'MillTrack', en: 'MillTrack', tr: 'MillTrack' },
    tagline: {
      fr: 'Chaque kilo compte, du lot brut au lot fini.',
      en: 'Every kilo counts, from raw batch to finished batch.',
      tr: 'Her kilo sayılır: ham partiden bitmiş partiye.',
    },
    result: {
      fr: 'Un outil de suivi de production pour les usines de transformation : lots, stocks et rendement. Le projet se construit avec de premières usines pilotes.',
      en: 'A production-tracking tool for processing plants: batches, stock and yield. The project is being built with first pilot plants.',
      tr: 'İşleme tesisleri için üretim takip aracı: partiler, stok ve verim. Proje, ilk pilot tesislerle birlikte geliştiriliyor.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion', 'Recharts'],
    status: 'dev',
    href: 'https://taama-mu.vercel.app',
  },
  {
    id: 'comptrack',
    logo: 'comptrack',
    accent: '#B8862B',
    since: '2026-06',
    capture: 'comptrack',
    name: { fr: 'CompTrack', en: 'CompTrack', tr: 'CompTrack' },
    tagline: {
      fr: 'Des comptes équilibrés, sans comptable à plein temps.',
      en: 'Balanced books, without a full-time accountant.',
      tr: 'Tam zamanlı muhasebeci olmadan dengeli hesaplar.',
    },
    result: {
      fr: 'Une application de comptabilité pour PME, pensée autour du référentiel SYSCOHADA : suivi des opérations, factures et rapports. Aperçu en développement.',
      en: 'An accounting application for small businesses, built around the SYSCOHADA framework: operations tracking, invoices and reports. Preview in development.',
      tr: 'KOBİ’ler için SYSCOHADA standardı etrafında tasarlanmış muhasebe uygulaması: işlem takibi, faturalar ve raporlar. Önizleme geliştirme aşamasında.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Recharts', 'jsPDF'],
    status: 'dev',
    href: 'https://comptrack-chi.vercel.app',
  },
  {
    id: 'valuechain',
    logo: 'valuechain',
    accent: '#D6407F',
    since: '2026-07',
    capture: 'valuechain',
    name: { fr: 'ValueChain Connect', en: 'ValueChain Connect', tr: 'ValueChain Connect' },
    tagline: {
      fr: 'Les producteurs et les transformateurs, en relation directe.',
      en: 'Producers and processors, in direct contact.',
      tr: 'Üreticiler ve işleyiciler, doğrudan bağlantıda.',
    },
    result: {
      fr: "Une place de marché B2B qui connecte producteurs et transformateurs d'Afrique de l'Ouest : profils, catalogue, recherche et messagerie.",
      en: 'A B2B marketplace connecting producers and processors in West Africa: profiles, catalogue, search and messaging.',
      tr: 'Batı Afrika’daki üreticileri ve işleyicileri buluşturan B2B pazar yeri: profiller, katalog, arama ve mesajlaşma.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion', 'Recharts'],
    status: 'dev',
    href: 'https://valuechain-connect.vercel.app',
  },
  {
    id: 'agrotrack',
    logo: 'agrotrack',
    accent: '#E8641B',
    since: '2026-07',
    capture: 'agrotrack',
    name: { fr: 'AgroTrack BF', en: 'AgroTrack BF', tr: 'AgroTrack BF' },
    tagline: {
      fr: 'Le suivi des parcelles, pensé pour les coopératives.',
      en: 'Plot tracking, designed for cooperatives.',
      tr: 'Kooperatifler için tasarlanmış parsel takibi.',
    },
    result: {
      fr: 'Un outil de suivi des parcelles agricoles pour les coopératives. Le projet est en développement et cherche une coopérative pilote.',
      en: 'A plot-tracking tool for agricultural cooperatives. The project is in development and looking for a pilot cooperative.',
      tr: 'Tarım kooperatifleri için parsel takip aracı. Proje geliştirme aşamasında ve pilot bir kooperatif arıyor.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion', 'Recharts'],
    status: 'dev',
    href: 'https://agrotrack-bf.vercel.app',
  },
  {
    id: 'forja',
    logo: 'forja',
    accent: '#C4372F',
    since: '2026-07',
    capture: 'forja',
    name: { fr: 'FORJA', en: 'FORJA', tr: 'FORJA' },
    tagline: {
      fr: 'Du plant de café au conteneur, chaque étape documentée.',
      en: 'From coffee plant to container, every step documented.',
      tr: 'Kahve fidesinden konteynere, her adım belgelenmiş.',
    },
    result: {
      fr: "L'aperçu d'un outil de suivi des exportations de café du Burkina Faso, de l'origine jusqu'au dossier logistique. Le projet est en développement.",
      en: 'A preview of a tool for tracking coffee exports from Burkina Faso, from origin to the logistics file. The project is in development.',
      tr: 'Burkina Faso kahve ihracatını menşeden lojistik dosyasına kadar izleyen bir aracın önizlemesi. Proje geliştirme aşamasında.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
    status: 'dev',
    href: 'https://forja-pied.vercel.app',
  },
  {
    id: 'burkinacollect',
    logo: 'burkinacollect',
    accent: '#E8483F',
    since: '2026-06',
    capture: 'burkinacollect',
    name: { fr: 'BurkinaCollect', en: 'BurkinaCollect', tr: 'BurkinaCollect' },
    tagline: {
      fr: 'Collecter sans réseau.',
      en: 'Collect data without a network.',
      tr: 'Ağ olmadan veri toplayın.',
    },
    result: {
      fr: "Un projet de collecte de données de terrain hors ligne : la page de présentation et la synchronisation sont en place, l'application de collecte reste à construire.",
      en: 'An offline field-data collection project: the landing page and sync are in place, the collection app itself is still to be built.',
      tr: 'Çevrimdışı saha verisi toplama projesi: tanıtım sayfası ve eşitleme hazır, toplama uygulamasının kendisi henüz yapılacak.',
    },
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    status: 'dev',
    href: 'https://burkinacollect-bf.vercel.app',
  },
  {
    id: 'indubot',
    logo: 'indubot',
    accent: '#6D3FF0',
    since: '2026-08',
    capture: 'indubot',
    name: { fr: 'Indubot Afrika', en: 'Indubot Afrika', tr: 'Indubot Afrika' },
    tagline: {
      fr: "L'industrie africaine, mieux outillée.",
      en: 'African industry, better equipped.',
      tr: 'Afrika sanayisi, daha iyi donanımlı.',
    },
    result: {
      fr: 'Un logiciel de gestion industrielle avec des tableaux de bord de données, en cours de construction.',
      en: 'An industrial management tool with data dashboards, still under construction.',
      tr: 'Veri panolarıyla donatılmış, yapım aşamasındaki bir sanayi yönetimi yazılımı.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Better Auth', 'Tailwind CSS', 'Visx'],
    status: 'dev',
    href: 'https://indubot-afrika.vercel.app',
  },
  {
    id: 'finegame',
    logo: 'fine-game',
    accent: '#F2A900',
    since: '2026-10',
    capture: 'finegame',
    name: { fr: 'FINE Game', en: 'FINE Game', tr: 'FINE Game' },
    tagline: {
      fr: "Jouez avec l'argent pour apprendre à le garder.",
      en: 'Play with money to learn how to keep it.',
      tr: 'Parayla oynayın, onu korumayı öğrenin.',
    },
    result: {
      fr: "Un jeu de plateau éducatif sur la gestion de l'argent, jouable hors ligne à 2 à 4 joueurs ou contre des robots, en français, anglais et turc.",
      en: 'An educational board game about managing money, playable offline with 2 to 4 players or against bots, in French, English and Turkish.',
      tr: 'Para yönetimi üzerine eğitici bir masa oyunu: çevrimdışı oynanabilir, 2 ila 4 oyuncu ya da robotlara karşı; Fransızca, İngilizce ve Türkçe.',
    },
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'PWA'],
    status: 'live',
    tests: 32,
    href: 'https://fine-game-three.vercel.app',
  },
  {
    id: 'ueemt',
    logo: 'ueemt',
    accent: '#f58a5b',
    since: '2026-06',
    capture: 'ueemt',
    name: { fr: 'UEEMT-Tokat', en: 'UEEMT-Tokat', tr: 'UEEMT-Tokat' },
    tagline: {
      fr: 'La communauté malienne de Tokat, toujours connectée.',
      en: 'The Malian community of Tokat, always connected.',
      tr: 'Tokat’taki Malili topluluk, her zaman bağlantıda.',
    },
    result: {
      fr: "La plateforme en ligne d'une association étudiante : fil d'actualités, albums photos, annuaire des membres et notifications push.",
      en: 'The online platform of a student association: news feed, photo albums, member directory and push notifications.',
      tr: 'Bir öğrenci derneğinin çevrimiçi platformu: haber akışı, fotoğraf albümleri, üye rehberi ve anlık bildirimler.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion', 'Web Push'],
    status: 'live',
    href: 'https://ueemt-tokat.vercel.app',
  },
  {
    id: 'mifa',
    logo: 'mifa',
    accent: '#f06fa4',
    since: '2026-03',
    capture: 'mifa',
    name: { fr: 'MIFA Life Shop', en: 'MIFA Life Shop', tr: 'MIFA Life Shop' },
    tagline: {
      fr: 'Les produits africains authentiques, à portée de main.',
      en: 'Authentic African products, within reach.',
      tr: 'Özgün Afrika ürünleri, hemen yanınızda.',
    },
    result: {
      fr: 'Une boutique en ligne de produits africains pensée pour les PME : catalogue, catégories et prix affichés en FCFA. Version MVP, en recherche d’un pilote.',
      en: 'An online shop for African products designed for small businesses: catalogue, categories and prices shown in FCFA. MVP version, looking for a pilot.',
      tr: 'KOBİ’ler için tasarlanmış Afrika ürünleri çevrimiçi mağazası: katalog, kategoriler ve FCFA cinsinden fiyatlar. MVP sürümü, pilot arıyor.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Zod'],
    status: 'dev',
    href: 'https://mifa-life-shop-9k55.vercel.app',
  },
]

/** Projets du plus ancien au plus récent (à égalité, l'ordre d'affichage). */
export const projectsByDate: readonly Project[] = [...projects].sort((a, b) => a.since.localeCompare(b.since))

export const onlineProjectCount: number = projects.filter((project) => project.href !== undefined).length

export const automatedTestCount: number = projects.reduce((sum, project) => sum + (project.tests ?? 0), 0)

export function projectById(id: string): Project {
  const found = projects.find((project) => project.id === id)
  if (!found) throw new Error(`Projet inconnu : ${id}`)
  return found
}
