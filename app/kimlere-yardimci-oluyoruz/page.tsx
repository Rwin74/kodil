import { Metadata } from 'next'
import { WhoWeHelp } from '@/components/who-we-help'
import { NextStep } from '@/components/next-step'

export const metadata: Metadata = {
  title: 'Kimlere Yardımcı Oluyoruz',
  description: 'Çocuklar ve yetişkinler için sunduğumuz dil ve konuşma terapisi, ergoterapi ve gelişim destek alanları hakkında detaylı bilgi.',
  alternates: {
    canonical: '/kimlere-yardimci-oluyoruz',
  },
}

export default function KimlereYardimciOluyoruzPage() {
  return (
    <main>
      <div className="pt-24 lg:pt-32 pb-16">
        <WhoWeHelp />
      </div>
      <NextStep title="Terapi Yolculuğu" href="/terapi-yolculugu" />
    </main>
  )
}
