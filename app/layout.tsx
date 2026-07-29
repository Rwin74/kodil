import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import { SmoothScroll } from '@/components/smooth-scroll'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { JsonLd } from '@/components/json-ld'
import { BackgroundGradients } from '@/components/background-gradients'
import { WhatsAppButton } from '@/components/whatsapp-button'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://kocaelidilvekonusma.com'),
  title: {
    default: 'Kocaeli Dil ve Konuşma Terapisti | KODİL Ergoterapi Merkezi',
    template: '%s | KODİL',
  },
  description:
    'Kocaeli dil ve konuşma terapisti arayışınızda uzman kadromuzla yanınızdayız. KODİL; apraksi, duyusal hassasiyet, duyu bütünleme ve konuşma bozuklukları alanında Kocaeli dil terapisti arayan aileler için en güvenilir çocuk odaklı gelişim merkezidir.',
  generator: 'v0.app',
  keywords: [
    'kocaeli dil ve konuşma terapisti',
    'kocaeli dil ve konuşma',
    'kocaeli dil terapisti',
    'kocaeli konuşma terapisti',
    'kocaeli çocuk dil terapisti',
    'kocaeli en iyi dil ve konuşma terapisti',
    'apraksi',
    'apraksi nedir',
    'duyusal hassasiyet',
    'duyusal hassasiyet nedir',
    'granülom nedir',
    'duyu hassasiyeti',
    'duyu hassasiyeti nedir',
    'dil edinimi ne zaman başlar',
    'hassasiyet nedir',
    'kocaeli ergoterapi',
    'kocaeli dil konuşma',
    'çocuk gelişimi kocaeli'
  ],
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/tr-TR',
    },
  },
  openGraph: {
    title: 'Kocaeli Dil ve Konuşma Terapisti | KODİL Ergoterapi Merkezi',
    description: 'Kocaeli dil ve konuşma terapisti arayışınızda uzman kadromuzla yanınızdayız. KODİL; apraksi, duyusal hassasiyet, duyu bütünleme ve konuşma bozuklukları alanında Kocaeli dil terapisti arayan aileler için en güvenilir çocuk odaklı gelişim merkezidir.',
    url: 'https://kocaelidilvekonusma.com',
    siteName: 'KODİL',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kocaeli Dil ve Konuşma Terapisti | KODİL Ergoterapi Merkezi',
    description: 'Kocaeli dil ve konuşma terapisti arayışınızda uzman kadromuzla yanınızdayız. KODİL; apraksi, duyusal hassasiyet, duyu bütünleme ve konuşma bozuklukları alanında Kocaeli dil terapisti arayan aileler için en güvenilir çocuk odaklı gelişim merkezidir.',
  },
  icons: {
    icon: '/images/favicon.png',
    shortcut: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f6efe0',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${manrope.variable} bg-background`}>
      <head>
        <JsonLd />
      </head>
      <body className="font-sans antialiased">
        <SmoothScroll>
          <div className="relative min-h-screen overflow-x-clip flex flex-col">
            <BackgroundGradients />
            <SiteNav />
            <div className="flex-1">
              {children}
            </div>
            <SiteFooter />
          </div>
        </SmoothScroll>
        <WhatsAppButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
