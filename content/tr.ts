import type { Dictionary } from './types'

// TODO relecture TR : traduction à faire relire par un locuteur natif.
export const tr: Dictionary = {
  meta: {
    title: 'Steeve Donald Compaoré — La forge du futur',
    description:
      'Bilgisayar bilimleri öğrencisi Steeve Donald Compaoré’nin portfolyosu: full stack geliştirme, yapay zekâ entegrasyonu ve otomasyon. 2027 yaz stajlarına açığım.',
  },
  brand: { name: 'La forge du futur', slogan: 'Geleceğin şekillendiği yer.' },
  nav: {
    label: 'Ana gezinme',
    skipToContent: 'İçeriğe geç',
    home: 'Ana sayfa',
    about: 'Hakkımda',
    skills: 'Yetenekler',
    projects: 'Projeler',
    architecture: 'Mimari',
    certifications: 'Sertifikalar',
    journey: 'Yolculuk',
    contact: 'İletişim',
    openMenu: 'Menüyü aç',
    closeMenu: 'Menüyü kapat',
  },
  language: { label: 'Dil seçin' },
  badge: 'Staja açığım · Yaz 2027',
  // TODO relecture TR : libellés de l'intro (Dinle, Sesi kapat, Çerçeve, üretici).
  intro: {
    skip: 'Girişi atla',
    mute: 'Sesi kapat',
    unmute: 'Sesi aç',
    frameName: 'Çerçeve — Donald',
    roles: ['yazılım mühendisi', 'üretici'],
  },
  hero: {
    subtitle:
      'Bilgisayar bilimleri öğrencisiyim; fikirden yayına kadar eksiksiz web uygulamaları geliştiriyor ve yapay zekâyı bunlara entegre ediyorum.',
    cv: 'CV’mi indir',
    contact: 'Benimle iletişime geç',
    portraitAlt: 'Steeve Donald Compaoré’nin portresi',
  },
  about: {
    title: 'Hakkımda',
    paragraphs: [
      'Tokat Gaziosmanpaşa Üniversitesi’nde bilgisayar bilimleri öğrencisiyim. Burkina Faso’luyum ve Tokat’ta yaşıyorum.',
      'Yazılımı uçtan uca geliştiriyorum: arayüz, API, veritabanı ve dağıtım.',
      'Ayrıca yapay zekâ ajanlarını yönetiyorum: bir yönetici birkaç modele iş devrediyor; böylece kod incelemesinden ve testlerden vazgeçmeden daha hızlı teslim ediyorum.',
      'Türkiye’de (İstanbul, Tokat) veya uzaktan 2027 yaz stajı arıyorum.',
    ],
    languagesTitle: 'Diller',
  },
  skills: {
    title: 'Yetenekler',
    intro: 'Seviyeler CV’mden gelir; projelerimde kullandığım araçlar puansız listelenir.',
    levels: { veryGood: 'Çok iyi', good: 'İyi', average: 'Orta' },
  },
  projects: {
    title: 'Projeler',
    intro: 'Dokuz çalışma: bir yapay zekâ ajanı tezgâhı, yayındaki uygulamalar ve hepsini birbirine bağlayan FORGE Afrika ekosistemi.',
    visit: 'Çevrimiçi gör',
    featured: 'Öne çıkan kanıt',
    noPublicLink: 'İstek üzerine demo',
    statuses: {
      running: 'Çalışıyor',
      live: 'Yayında',
      dev: 'Geliştiriliyor',
      proto: 'Prototip',
      hub: 'Ekosistem',
    },
  },
  architecture: {
    title: 'Orkestratör mimarisi',
    intro:
      'Bir yönetici istekleri alır, doğru ajanı seçer, kota dolduğunda başka bir ajana geçer ve her devri kaydeder.',
    svgTitle: 'Çoklu ajan orkestratörü şeması',
    svgDesc:
      'Yönetici ortada yer alır. GitHub ve Telegram ona istek gönderir. Copilot, Gemini, Codex ve Ollama’ya iş devreder; ajanlar arasında otomatik yedekleme vardır ve her devir bir günlüğe yazılır.',
    nodes: {
      github: { title: 'GitHub', sub: 'kanal' },
      telegram: { title: 'Telegram', sub: 'kanal' },
      manager: { title: 'Yönetici', sub: 'yönlendirme' },
      copilot: { title: 'Copilot' },
      gemini: { title: 'Gemini' },
      codex: { title: 'Codex' },
      ollama: { title: 'Ollama', sub: 'yerel' },
      journal: { title: 'Devir günlüğü' },
    },
    fallback: 'kota doldu → yedek',
  },
  certifications: {
    title: 'Sertifikalar',
    intro: 'On üç LinkedIn Learning sertifikası ve bir üniversite katılım belgesi; her biri özgün PDF’siyle.',
    statCount: 'sertifika',
    statHours: 'saat eğitim',
    groups: {
      ai: 'Yapay zekâ ve ajanlar',
      web: 'Web, JavaScript ve TypeScript',
      design: 'Tasarım',
      university: 'Üniversite eğitimleri',
    },
    verify: 'LinkedIn’de doğrula',
    viewPdf: 'Sertifikayı gör',
    idLabel: 'Kimlik',
    hourUnit: 'sa',
    minuteUnit: 'dk',
  },
  journey: {
    title: 'Yolculuk',
    items: [
      {
        period: '2022 – 2023',
        title: 'Ön lisans',
        text: 'Lisanstan önceki ilk aşama.',
      },
      {
        period: '2023 – günümüz',
        title: 'Bilgisayar Bilimleri Mühendisliği lisansı',
        text: 'Tokat Gaziosmanpaşa Üniversitesi, Türkiye.',
      },
      {
        period: 'Projeler',
        title: 'Yayındaki uygulamalar',
        text: 'UEEMT-Tokat, CompTrack, MIFA Life Shop ve ValueChain Connect çevrimiçi; Projeler bölümünden erişilebilir.',
      },
      {
        period: 'Yakın zamanda',
        title: 'Yapay zekâ ajanı orkestrasyonu',
        text: 'Çoklu ajan test tezgâhı: bir yönetici, dört ajan, kota dolunca otomatik yedekleme ve bir devir günlüğü.',
      },
      {
        period: 'Yaz 2027',
        title: 'Hedef: staj',
        text: 'Türkiye’de (İstanbul, Tokat) veya uzaktan.',
      },
    ],
  },
  contact: {
    title: 'İletişim',
    text: 'Bir staj, bir iş birliği ya da bir sorunuz mu var? Bana yazın, memnuniyetle yanıtlarım.',
    email: 'E-posta',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'CV’mi indir',
  },
  cvPage: {
    title: 'CV yakında burada',
    text: 'CV’m henüz yayımlanmadı. Şimdilik bana yazın, size göndereyim.',
    back: 'Ana sayfaya dön',
    contact: 'Benimle iletişime geç',
    draftTitle: 'Onay bekleyen taslak',
    draftText: 'İnceleme aşamasındaki sürümlerin önizlemesi. Henüz resmî olarak yayımlanmadı.',
  },
  notFound: {
    title: 'Sayfa bulunamadı',
    text: 'Bu sayfa mevcut değil ya da artık mevcut değil.',
    back: 'Ana sayfaya dön',
  },
  footer: { rights: 'Tüm hakları saklıdır.' },
}

