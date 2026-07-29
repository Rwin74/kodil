import { Metadata } from 'next'
import { Faq } from '@/components/faq'
import { Contact } from '@/components/contact'

export const metadata: Metadata = {
  title: 'İletişim ve Sıkça Sorulan Sorular',
  description: 'KODİL Dil ve Konuşma Terapisi Merkezi iletişim bilgileri, adres, telefon ve randevu oluşturma. Merak ettiğiniz soruların cevapları.',
  alternates: {
    canonical: '/iletisim',
  },
}

export default function IletisimPage() {
  return (
    <main className="pt-24 lg:pt-32 pb-16">
      <Contact />
      <Faq />
    </main>
  )
}
