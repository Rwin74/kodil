import { Metadata } from 'next'
import { TherapyJourney } from '@/components/therapy-journey'
import { Timeline } from '@/components/timeline'
import { Process } from '@/components/process'
import { NextStep } from '@/components/next-step'

export const metadata: Metadata = {
  title: 'Terapi Yolculuğu ve Süreç',
  description: 'KODİL\'de terapi süreci nasıl ilerler? Değerlendirme, planlama ve uygulama adımları ile çocuğunuzun gelişim yolculuğu.',
  alternates: {
    canonical: '/terapi-yolculugu',
  },
}

export default function TerapiYolculuguPage() {
  return (
    <main>
      <div className="pt-24 lg:pt-32 pb-16">
        <TherapyJourney />
        <Timeline />
        <Process />
      </div>
      <NextStep title="Uzman Kadromuz" href="/ekibimiz" />
    </main>
  )
}
