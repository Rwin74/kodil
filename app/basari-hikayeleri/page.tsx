import { Metadata } from 'next'
import { Stats } from '@/components/stats'
import { SuccessStories } from '@/components/success-stories'
import { NextStep } from '@/components/next-step'

export const metadata: Metadata = {
  title: 'Deneyim ve Geri Bildirim İlkeleri',
  description: 'Gerçek kullanıcı geri bildirimleri yalnızca kaynağı, yayın izni ve uygunluk incelemesi tamamlandığında paylaşılır.',
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
