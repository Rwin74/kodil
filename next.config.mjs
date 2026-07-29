/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  async redirects() {
    return [
      { source: '/artikulasyon-bozuklugu', destination: '/blog/artikulasyon-bozuklugu-nedir-harfleri-soyleyememe', permanent: true },
      { source: '/bebeklerde-dil-gelisimi-nasil-seyreder', destination: '/blog/dil-edinimi-ne-zaman-baslar', permanent: true },
      { source: '/category/:slug*', destination: '/blog', permanent: true },
      { source: '/tag/:slug*', destination: '/blog', permanent: true },
      { source: '/cerebral-palysde-eslik-eden-dil-ve-konusma-problemleri-nelerdir', destination: '/blog/cerebral-palysde-eslik-eden-dil-ve-konusma-problemleri-nelerdir', permanent: true },
      { source: '/cocugum-konusmuyor-krese-anaokulu-gunduz-bakimevi-gondermeli-miyim', destination: '/blog/cocugum-konusmuyor-ne-zaman-uzmana-basvurmaliyim', permanent: true },
      { source: '/cocugumun-evde-dil-ve-konusma-becerilerini-nasil-desteklerim', destination: '/blog', permanent: true },
      { source: '/corpus-collasum-disgenezisi', destination: '/blog', permanent: true },
      { source: '/dikkat-eksikligi-ergoterapi', destination: '/blog/ergoterapi-merkezi-secerken-nelere-dikkat-edilmeli', permanent: true },
      { source: '/dil-ve-konusma-bozukluklarinda-erken-mudahalenin-onemi', destination: '/blog/kocaeli-dil-ve-konusma-terapisti-neden-erken-mudahale', permanent: true },
      { source: '/dil-ve-konusma-terapistlerinin-otizm-spektrum-bozuklugu-alaninda-hizmetleri-nelerdir', destination: '/blog/kocaeli-otizm-ve-dil-terapisi-yaklasimlarimiz', permanent: true },
      { source: '/dizartri-nedir', destination: '/blog/dizartri-nedir', permanent: true },
      { source: '/down-sendromu-nedir', destination: '/blog/down-sendromu-nedir', permanent: true },
      { source: '/down-sendromunda-eslik-eden-konusma-problemleri-nedir', destination: '/blog/down-sendromu-nedir', permanent: true },
      { source: '/dudak-damak-yarikligi-nedir', destination: '/blog/dudak-damak-yarigi-sonrasi-konusma-terapisi', permanent: true },
      { source: '/dudak-damak-yarikliginda-eslik-eden-dil-ve-konusma-problemleri-nelerdir', destination: '/blog/dudak-damak-yarigi-sonrasi-konusma-terapisi', permanent: true },
      { source: '/duyu-butunleme-nedir', destination: '/blog/duyusal-hassasiyet-ve-duyu-butunleme', permanent: true },
      { source: '/elektronik-cihazin-konusmaya-etkisi', destination: '/blog/elektronik-cihazin-konusmaya-etkisi', permanent: true },
      { source: '/ergoteristlerin-otizmde-rolu', destination: '/blog/ergoterapi-merkezi-secerken-nelere-dikkat-edilmeli', permanent: true },
      { source: '/etkilesim-temelli-uygulamalar', destination: '/blog/etkilesim-temelli-uygulamalar', permanent: true },
      { source: '/hizli-bozuk-konusma', destination: '/blog/hizli-bozuk-konusma', permanent: true },
      { source: '/isitme-engelinde-eslik-eden-dil-ve-konusma-problemleri-nelerdir', destination: '/blog/isitme-engelinde-eslik-eden-dil-ve-konusma-problemleri-nelerdir', permanent: true },
      { source: '/kocaeli-ergoterapi', destination: '/blog/kocaeli-ergoterapi', permanent: true },
      { source: '/otizm-spektrum-bozuklugu-nedir-nedenleri-nelerdir', destination: '/blog/otizm-spektrum-bozuklugu-nedir-nedenleri-nelerdir', permanent: true },
      { source: '/psikoterapi-yontemleri-ve-uygulama-asamalari-nedir', destination: '/blog/psikoterapi-yontemleri-ve-uygulama-asamalari-nedir', permanent: true },
      { source: '/sesletim-artikulasyon-bozuklugu-nedir', destination: '/blog/sesletim-artikulasyon-bozuklugu-nedir', permanent: true }
    ]
  },
}

export default nextConfig
