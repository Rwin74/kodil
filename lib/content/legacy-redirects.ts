import type { PublicRedirect } from '@/lib/content/repository'

const legacyPaths = {
  '/artikulasyon-bozuklugu': '/blog/artikulasyon-bozuklugu-nedir-harfleri-soyleyememe',
  '/bebeklerde-dil-gelisimi-nasil-seyreder': '/blog/dil-edinimi-ne-zaman-baslar',
  '/cerebral-palysde-eslik-eden-dil-ve-konusma-problemleri-nelerdir': '/blog/cerebral-palysde-eslik-eden-dil-ve-konusma-problemleri-nelerdir',
  '/cocugum-konusmuyor-krese-anaokulu-gunduz-bakimevi-gondermeli-miyim': '/blog/cocugum-konusmuyor-ne-zaman-uzmana-basvurmaliyim',
  '/cocugumun-evde-dil-ve-konusma-becerilerini-nasil-desteklerim': '/blog/etkilesim-temelli-uygulamalar',
  '/cocukluk-cagi-konusma-apraksisi-nedir': '/blog/apraksi-nedir-belirtileri-ve-tedavisi',
  '/corpus-collasum-disgenezisi': '/blog',
  '/dikkat-eksikligi-ergoterapi': '/blog/ergoterapi-merkezi-secerken-nelere-dikkat-edilmeli',
  '/dil-ve-konusma-bozukluklarinda-erken-mudahalenin-onemi': '/blog/kocaeli-dil-ve-konusma-terapisti-neden-erken-mudahale',
  '/dil-ve-konusma-terapistlerinin-otizm-spektrum-bozuklugu-alaninda-hizmetleri-nelerdir': '/blog/kocaeli-otizm-ve-dil-terapisi-yaklasimlarimiz',
  '/dizartri-nedir': '/blog/dizartri-nedir',
  '/down-sendromu-nedir': '/blog/down-sendromu-nedir',
  '/down-sendromunda-eslik-eden-konusma-problemleri-nedir': '/blog/down-sendromu-nedir',
  '/dudak-damak-yarikligi-nedir': '/blog/dudak-damak-yarigi-sonrasi-konusma-terapisi',
  '/dudak-damak-yarikliginda-eslik-eden-dil-ve-konusma-problemleri-nelerdir': '/blog/dudak-damak-yarigi-sonrasi-konusma-terapisi',
  '/duyu-butunleme-nedir': '/blog/duyusal-hassasiyet-ve-duyu-butunleme',
  '/elektronik-cihazin-konusmaya-etkisi': '/blog/elektronik-cihazin-konusmaya-etkisi',
  '/ergoteristlerin-otizmde-rolu': '/blog/ergoterapi-merkezi-secerken-nelere-dikkat-edilmeli',
  '/etkilesim-temelli-uygulamalar': '/blog/etkilesim-temelli-uygulamalar',
  '/hizli-bozuk-konusma': '/blog/hizli-bozuk-konusma',
  '/isitme-engelinde-eslik-eden-dil-ve-konusma-problemleri-nelerdir': '/blog/isitme-engelinde-eslik-eden-dil-ve-konusma-problemleri-nelerdir',
  '/kocaeli-ergoterapi': '/blog/kocaeli-ergoterapi',
  '/otizm-spektrum-bozuklugu-nedir-nedenleri-nelerdir': '/blog/otizm-spektrum-bozuklugu-nedir-nedenleri-nelerdir',
  '/psikoterapi-yontemleri-ve-uygulama-asamalari-nedir': '/blog/psikoterapi-yontemleri-ve-uygulama-asamalari-nedir',
  '/sesletim-artikulasyon-bozuklugu-nedir': '/blog/sesletim-artikulasyon-bozuklugu-nedir',
  '/kurumsal': '/hakkimizda',
  '/terapistler': '/ekibimiz',
  '/kocaeli-psikoterapi': '/blog/psikoterapi-yontemleri-ve-uygulama-asamalari-nedir',
  '/sizden-gelen-sorular': '/blog',
  '/terapiler': '/kimlere-yardimci-oluyoruz',
  '/author/kocaelidil': '/ekibimiz',
} as const

const archivePrefixes = ['/category', '/tag', '/author'] as const

export interface StoredRedirectRule {
  source: string
  destination: string
  permanent: true
}

/** Faz 2 import envanterini korur; uygulama zamanında tek adım çözülür. */
export function storedLegacyRedirectRules(): StoredRedirectRule[] {
  return [
    ...Object.entries(legacyPaths).flatMap(([source, destination]) => [
      { source, destination, permanent: true as const },
      { source: `${source}/`, destination, permanent: true as const },
    ]),
    ...archivePrefixes.flatMap((prefix) => [
      { source: prefix, destination: '/blog', permanent: true as const },
      { source: `${prefix}/`, destination: '/blog', permanent: true as const },
      { source: `${prefix}/:slug*`, destination: '/blog', permanent: true as const },
      { source: `${prefix}/:slug*/`, destination: '/blog', permanent: true as const },
    ]),
    { source: '/:path+/', destination: '/:path+', permanent: true as const },
  ]
}

export function resolveStoredRedirectRule(
  rule: Pick<StoredRedirectRule, 'source' | 'destination'>,
  pathname: string,
): string | undefined {
  if (rule.source === pathname) return rule.destination
  if (rule.source === '/:path+/' && pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  const archiveMatch = rule.source.match(/^\/(category|tag|author)(?:\/:slug\*)?\/?$/)
  if (archiveMatch && (pathname === `/${archiveMatch[1]}` || pathname.startsWith(`/${archiveMatch[1]}/`))) {
    return rule.destination
  }
  return undefined
}

export function resolveFileRedirect(pathname: string): PublicRedirect | undefined {
  for (const rule of storedLegacyRedirectRules()) {
    const targetPath = resolveStoredRedirectRule(rule, pathname)
    if (targetPath && targetPath !== pathname) {
      return { sourcePath: pathname, targetPath, httpCode: 308 }
    }
  }
  return undefined
}
