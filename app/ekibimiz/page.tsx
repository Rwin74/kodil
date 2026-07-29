import { Metadata } from 'next'
import { Experts } from '@/components/experts'
import { NextStep } from '@/components/next-step'

export const metadata: Metadata = {
  title: 'Uzman Kadromuz | Ekibimiz',
  description: 'Alanında uzman dil ve konuşma terapistleri ile ergoterapistlerden oluşan KODİL kadrosuyla tanışın.',
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
