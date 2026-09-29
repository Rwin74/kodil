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
    default: 'Kocaeli Dil ve Konuşma Terapisi | Kartepe - KODİL',
    template: '%s | KODİL',
  },
  description:
    'KODİL; Kocaeli’de dil ve konuşma terapisi, ergoterapi ve çocuk odaklı gelişim alanlarında ekip, süreç ve iletişim bilgileri sunar.',
  generator: 'v0.app',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kocaeli Dil ve Konuşma Terapisi | Kartepe - KODİL',
    description: 'KODİL; Kocaeli’de dil ve konuşma terapisi, ergoterapi ve çocuk odaklı gelişim alanlarında ekip, süreç ve iletişim bilgileri sunar.',
    url: 'https://kocaelidilvekonusma.com',
    siteName: 'KODİL',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kocaeli Dil ve Konuşma Terapisi | Kartepe - KODİL',
    description: 'KODİL; Kocaeli’de dil ve konuşma terapisi, ergoterapi ve çocuk odaklı gelişim alanlarında ekip, süreç ve iletişim bilgileri sunar.',
  },
  icons: {
    icon: '/images/favicon.webp',
    shortcut: '/images/favicon.webp',
    apple: '/images/favicon.webp',
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
