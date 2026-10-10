import type { Localized } from './locales'

/**
 * running : système en fonctionnement (usage personnel) · live : application déployée
 * dev : en développement · proto : prototype non déployé · hub : écosystème (documentation, vision)
 */
export type ProjectStatus = 'running' | 'live' | 'dev' | 'proto' | 'hub'

export interface Project {
  readonly id: string
  readonly name: Localized
  /** Slogan PROPOSÉ (tiré des fichiers du dépôt, voir FAITS_PROJETS.md) : à valider par Steeve. */
  readonly tagline: Localized
  readonly result: Localized
  /** Pile relevée dans le package.json du dépôt. */
  readonly stack: readonly string[]
  readonly status: ProjectStatus
  /** Renseigné seulement si l'adresse répond HTTP 200 (testé le 2026-10-10). */
  readonly href?: string
  readonly featured?: boolean
}

export const projects: readonly Project[] = [
  {
    id: 'orchestrator',
    featured: true,
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
  },
  {
    id: 'comptrack',
    name: { fr: 'CompTrack', en: 'CompTrack', tr: 'CompTrack' },
    tagline: {
      fr: 'La comptabilité des PME, claire et conforme.',
      en: 'Small-business accounting, clear and compliant.',
      tr: 'KOBİ muhasebesi: net ve mevzuata uygun.',
    },
    result: {
      fr: 'Une application de comptabilité pour PME, conforme au référentiel SYSCOHADA : tableau de bord, facturation, clients et fournisseurs, rapports.',
      en: 'An accounting application for small businesses, compliant with the SYSCOHADA framework: dashboard, invoicing, customers and suppliers, reports.',
      tr: 'KOBİ’ler için SYSCOHADA standardına uygun muhasebe uygulaması: gösterge paneli, faturalama, müşteriler ve tedarikçiler, raporlar.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Recharts', 'jsPDF'],
    status: 'live',
    href: 'https://comptrack-chi.vercel.app',
  },
  {
    id: 'ueemt',
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
    name: { fr: 'MIFA Life Shop', en: 'MIFA Life Shop', tr: 'MIFA Life Shop' },
    tagline: {
      fr: 'Les produits africains authentiques, à portée de main.',
      en: 'Authentic African products, within reach.',
      tr: 'Özgün Afrika ürünleri, hemen yanınızda.',
    },
    result: {
      fr: 'Une boutique en ligne de produits locaux africains : fiches produits, collections, panier et suivi des commandes.',
      en: 'An online shop for local African products: product pages, collections, cart and order tracking.',
      tr: 'Yerel Afrika ürünleri için çevrimiçi mağaza: ürün sayfaları, koleksiyonlar, sepet ve sipariş takibi.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Zod'],
    status: 'dev',
    href: 'https://mifa-life-shop-9k55.vercel.app',
  },
  {
    id: 'valuechain',
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
    id: 'indubot',
    name: { fr: 'Indubot Afrika', en: 'Indubot Afrika', tr: 'Indubot Afrika' },
    tagline: {
      fr: "L'industrie africaine, mieux outillée.",
      en: 'African industry, better equipped.',
      tr: 'Afrika sanayisi, daha iyi donanımlı.',
    },
    result: {
      fr: "Un logiciel de gestion industrielle de l'écosystème FORGE Afrika, avec des tableaux de bord de données, en cours de construction.",
      en: 'An industrial management tool from the FORGE Afrika ecosystem, with data dashboards, still under construction.',
      tr: 'FORGE Afrika ekosisteminden, veri panolarıyla donatılmış, yapım aşamasındaki bir sanayi yönetimi yazılımı.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Better Auth', 'Tailwind CSS', 'Visx'],
    status: 'dev',
  },
  {
    id: 'sugu',
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
  },
  {
    id: 'forge',
    name: { fr: 'FORGE Afrika', en: 'FORGE Afrika', tr: 'FORGE Afrika' },
    tagline: {
      fr: "Forger les outils de l'industrialisation africaine.",
      en: 'Forging the tools of African industrialisation.',
      tr: 'Afrika sanayileşmesinin araçlarını dövmek.',
    },
    result: {
      fr: "L'écosystème qui relie ces logiciels : une suite d'outils pour les PME, coopératives, exportateurs et industriels africains, avec sa vision et sa feuille de route.",
      en: 'The ecosystem tying these tools together: a suite of tools for African small businesses, cooperatives, exporters and manufacturers, with its vision and roadmap.',
      tr: 'Bu yazılımları birbirine bağlayan ekosistem: Afrikalı KOBİ’ler, kooperatifler, ihracatçılar ve sanayiciler için bir araç paketi; vizyonu ve yol haritasıyla.',
    },
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
    status: 'hub',
  },
]
