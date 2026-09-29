import { Metadata } from 'next'
import { Experts } from '@/components/experts'
import { NextStep } from '@/components/next-step'

export const metadata: Metadata = {
  title: 'Ekibimiz',
  description: 'KODİL ekibini, görevlerini ve ayrı kişi profillerini tanıyın. Eğitim ve uzmanlık bilgileri yalnızca doğrulanmış kaynaklarla yayımlanır.',
  alternates: {
    canonical: '/ekibimiz',
  },
}

export default function EkibimizPage() {
  return (
    <main>
      <div className="pt-24 lg:pt-32 pb-16">
        <Experts />
      </div>
      <NextStep title="Başarı Hikayeleri" href="/basari-hikayeleri" />
    </main>
  )
}
