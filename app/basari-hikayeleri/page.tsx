import { Metadata } from 'next'
import { Stats } from '@/components/stats'
import { SuccessStories } from '@/components/success-stories'
import { NextStep } from '@/components/next-step'

export const metadata: Metadata = {
  title: 'Başarı Hikayeleri ve İstatistikler',
  description: 'KODİL ile terapi sürecini tamamlayan ve hayatına yeni bir sayfa açan danışanlarımızın başarı hikayeleri.',
  alternates: {
    canonical: '/basari-hikayeleri',
  },
}

export default function BasariHikayeleriPage() {
  return (
    <main>
      <div className="pt-24 lg:pt-32 pb-16">
        <Stats />
        <SuccessStories />
      </div>
      <NextStep title="Blog ve Soru-Cevap" href="/blog" />
    </main>
  )
}
