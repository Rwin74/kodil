export const SITE_URL = 'https://kocaelidilvekonusma.com'

/**
 * Kurumun kendi canlı sitesinden bağlanan ve profil başlığı kurum adıyla
 * eşleşen hesaplar. Yeni bir hesap yalnız karşılıklı kurum doğrulaması ve
 * erişim kontrolü kaydedildikten sonra bu listeye alınmalıdır.
 */
export const OFFICIAL_SOCIAL_PROFILES = {
  instagram: {
    name: 'Instagram',
    url: 'https://www.instagram.com/kocaelidilkonusmamerkezi/',
    verifiedIsoDate: '2026-08-26',
    verificationSourceUrl: SITE_URL,
  },
  facebook: {
    name: 'Facebook',
    url: 'https://www.facebook.com/people/Kocaeli-Dil-Konu%C5%9Fma-ve-Ergoterapi-Merkezi/61581354345505/',
    verifiedIsoDate: '2026-08-26',
    verificationSourceUrl: SITE_URL,
  },
} as const

export const SITE = {
  // Sosyal profillerde ve canlı kurum içeriğinde kullanılan kamusal kurum adı.
  // Yasal unvan doğrulanmadığı için schema.org legalName özellikle üretilmez.
  name: 'Kocaeli Dil, Konuşma ve Ergoterapi Merkezi',
  shortName: 'KODİL',
  url: SITE_URL,
  locale: 'tr-TR',
  language: 'tr',
  logo: {
    path: '/images/son-logo.webp',
    width: 1842,
    height: 567,
    alt: 'KODİL logosu',
  },
  primaryImage: {
    path: '/images/kocaeli-dil-ve-konusma-terapisi-merkezi-oyun-odasi.jpeg',
    width: 1500,
    height: 2000,
    alt: 'KODİL merkezindeki masa, sandalye ve oyun materyallerinin bulunduğu terapi odası',
    caption: 'KODİL merkezindeki terapi odası ve oyun materyalleri.',
    context: 'Merkez ortamını gösterir; bir vaka, danışan yorumu veya tedavi sonucu anlatmaz.',
  },
  sessionImage: {
    path: '/images/kocaeli-cocuk-dil-terapisti-seansi.jpeg',
    width: 1500,
    height: 2000,
    alt: 'Masa başında çocuk odaklı bir etkinlik sırasında kullanılan materyaller',
    caption: 'Çocuk odaklı bir etkinlikte kullanılan masa ve çalışma materyalleri.',
    context: 'Mevcut özgün görsel süreç ortamını gösterir; kişisel vaka sonucu olarak sunulmaz.',
  },
  phone: '+905015640041',
  phoneDisplay: '0501 564 00 41',
  email: 'yardenegitim@gmail.com',
  whatsappUrl: 'https://wa.me/905015640041',
  socialProfiles: [OFFICIAL_SOCIAL_PROFILES.instagram, OFFICIAL_SOCIAL_PROFILES.facebook],
  address: {
    streetAddress: 'Altek Plaza, Dumlupınar, Şht. Turgut Çiçek Cad. D:3. Kat B12',
    addressLocality: 'Kartepe',
    addressRegion: 'Kocaeli',
    postalCode: '41250',
    addressCountry: 'TR',
  },
  // Bu saatler yeni üretilmedi; kurtarılan ve canlı iletişim sayfasındaki
  // yayımlanmış kayıtla aynıdır. Güncelliği kurum yetkilisince teyit edilmelidir.
  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '12:00',
      closes: '20:00',
    },
    {
      days: ['Saturday', 'Sunday'],
      opens: '10:00',
      closes: '20:00',
    },
  ],
} as const

export const SITE_ADDRESS = `${SITE.address.streetAddress}, ${SITE.address.postalCode} ${SITE.address.addressLocality}/${SITE.address.addressRegion}`

export const SITE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_ADDRESS)}`

export const SCHEMA_IDS = {
  organization: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  logo: `${SITE_URL}/#logo`,
  address: `${SITE_URL}/#postal-address`,
  whatsapp: `${SITE_URL}/#whatsapp`,
} as const

export interface PageSeo {
  path: string
  name: string
  title: string
  description: string
  schemaType?: 'WebPage' | 'CollectionPage' | 'ContactPage' | 'AboutPage' | 'ProfilePage'
}

export const PAGES = {
  home: {
    path: '/',
    name: 'KODİL · Kocaeli Dil, Konuşma ve Ergoterapi Merkezi',
    title: 'Kocaeli Dil ve Konuşma Terapisti | KODİL Ergoterapi Merkezi',
    description:
      'KODİL; Kocaeli’de dil ve konuşma terapisi, ergoterapi ve çocuk odaklı gelişim alanlarında ekip, süreç ve iletişim bilgileri sunar.',
    schemaType: 'WebPage',
  },
  whoWeHelp: {
    path: '/kimlere-yardimci-oluyoruz',
    name: 'Kimlere Yardımcı Oluyoruz',
    title: 'Kimlere Yardımcı Oluyoruz',
    description:
      'Çocuklar ve yetişkinler için sunduğumuz dil ve konuşma terapisi, ergoterapi ve gelişim destek alanları hakkında detaylı bilgi.',
    schemaType: 'WebPage',
  },
  therapyJourney: {
    path: '/terapi-yolculugu',
    name: 'Terapi Yolculuğu',
    title: 'Terapi Yolculuğu ve Süreç',
    description:
      "KODİL'de terapi süreci nasıl ilerler? Değerlendirme, planlama ve uygulama adımları ile çocuğunuzun gelişim yolculuğu.",
    schemaType: 'WebPage',
  },
  team: {
    path: '/ekibimiz',
    name: 'Ekibimiz',
    title: 'KODİL Ekip Profilleri | Ekibimiz',
    description:
      'KODİL ekip üyelerinin görevlerini, kişi profillerini ve yalnızca kaynağı doğrulanmış mesleki bilgilerini inceleyin.',
    schemaType: 'CollectionPage',
  },
  about: {
    path: '/hakkimizda',
    name: 'Hakkımızda',
    title: 'KODİL Hakkında | Ekip ve Çalışma Yaklaşımı',
    description:
      'KODİL’in ekip yapısını, çalışma alanlarını, yaklaşımını ve kurumsal bilgi doğrulama ilkelerini inceleyin.',
    schemaType: 'AboutPage',
  },
  successStories: {
    path: '/basari-hikayeleri',
    name: 'Deneyim ve Geri Bildirim',
    title: 'Deneyim ve Kullanıcı Geri Bildirimi İlkeleri',
    description:
      'KODİL kullanıcı geri bildirimlerinin kaynak, izin, mahremiyet ve yayın uygunluğu ilkelerini inceleyin.',
    schemaType: 'WebPage',
  },
  blog: {
    path: '/blog',
    name: 'Blog',
    title: 'Blog ve Sizden Gelen Sorular',
    description:
      'Dil ve konuşma terapisi, ergoterapi ve çocuk gelişimi hakkında bilgilendirici KODİL yayınları ve sık sorulan sorular.',
    schemaType: 'CollectionPage',
  },
  contact: {
    path: '/iletisim',
    name: 'İletişim',
    title: 'İletişim ve Sıkça Sorulan Sorular',
    description:
      'KODİL Kocaeli Dil, Konuşma ve Ergoterapi Merkezi adres, telefon, e-posta ve randevu iletişim bilgileri.',
    schemaType: 'ContactPage',
  },
  privacy: {
    path: '/gizlilik-ve-kvkk',
    name: 'Gizlilik ve KVKK Aydınlatma Metni',
    title: 'Gizlilik ve KVKK Aydınlatma Metni',
    description:
      'KODİL internet sitesinde iletişim verilerinin, teknik kayıtların ve ilgili kişi taleplerinin nasıl ele alındığına ilişkin bilgilendirme.',
    schemaType: 'WebPage',
  },
  cookies: {
    path: '/cerez-politikasi',
    name: 'Çerez Politikası',
    title: 'Çerez Politikası',
    description:
      'KODİL internet sitesinin güncel çerez, analiz aracı, dış bağlantı ve tarayıcı depolama envanterine ilişkin teknik açıklama.',
    schemaType: 'WebPage',
  },
  terms: {
    path: '/kullanim-kosullari',
    name: 'Kullanım Koşulları',
    title: 'İnternet Sitesi Kullanım Koşulları',
    description:
      'KODİL internet sitesindeki bilgilendirici içeriklerin, iletişim kanallarının ve dış bağlantıların kullanımına ilişkin koşullar.',
    schemaType: 'WebPage',
  },
  communicationPermissions: {
    path: '/iletisim-izinleri',
    name: 'İletişim İzinleri',
    title: 'İletişim İzinleri ve Açık Rıza Açıklaması',
    description:
      'İletişim talebinin yanıtlanması ile isteğe bağlı tanıtım ve duyuru iletilerinin birbirinden nasıl ayrıldığına ilişkin açıklama.',
    schemaType: 'WebPage',
  },
} as const satisfies Record<string, PageSeo>

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

for (const profile of SITE.socialProfiles) {
  const profileUrl = new URL(profile.url)
  const verificationUrl = new URL(profile.verificationSourceUrl)
  if (profileUrl.protocol !== 'https:' || verificationUrl.protocol !== 'https:') {
    throw new Error(`${profile.name}: resmî sosyal profil ve doğrulama kaynağı HTTPS olmalı.`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(profile.verifiedIsoDate)) {
    throw new Error(`${profile.name}: sosyal profil doğrulama tarihi YYYY-MM-DD biçiminde olmalı.`)
  }
}
