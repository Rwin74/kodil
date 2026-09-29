import type { Metadata } from 'next'
import Link from 'next/link'

const address = 'Altek Plaza, Dumlupınar, Şht. Turgut Çiçek Cad. D:3. Kat B12, 41250 Kartepe/Kocaeli'

export const metadata: Metadata = {
  title: 'Kocaeli Dil ve Konuşma Terapisi | Kartepe',
  description:
    'KODİL’in Kartepe, Kocaeli’deki dil ve konuşma terapisi, ergoterapi ekibi, randevu süreci, çalışma saatleri ve açık adres bilgileri.',
  alternates: { canonical: '/kocaeli-dil-ve-konusma-terapisi' },
  openGraph: {
    title: 'Kocaeli Dil ve Konuşma Terapisi | Kartepe - KODİL',
    description: 'Kartepe’de KODİL’in hizmet alanları, randevu süreci ve iletişim bilgileri.',
    url: 'https://kocaelidilvekonusma.com/kocaeli-dil-ve-konusma-terapisi',
    type: 'article',
  },
}

const faqs = [
  {
    question: 'KODİL nerede hizmet veriyor?',
    answer: `KODİL, Altek Plaza, Dumlupınar, Şht. Turgut Çiçek Cad. D:3. Kat B12, 41250 Kartepe/Kocaeli adresinde hizmet verir. Merkez ziyareti randevu ile planlanır.`,
  },
  {
    question: 'KODİL hangi alanlarda hizmet sunuyor?',
    answer:
      'Merkezin internet sitesinde dil ve konuşma terapisi, ergoterapi ve psikoloji hizmetleri tanıtılmaktadır. Başvuru ihtiyacınızı telefonla paylaşarak uygun hizmet alanı ve randevu hakkında bilgi alabilirsiniz.',
  },
  {
    question: 'Randevu nasıl alınır?',
    answer:
      '0501 564 00 41 numaralı telefonu arayarak veya WhatsApp üzerinden merkeze ulaşabilirsiniz. Çalışmalar randevu ile yürütülür.',
  },
  {
    question: 'Terapi süreci ve seans sayısı nasıl belirlenir?',
    answer:
      'Süreç kişiye ve başvuru nedenine göre değerlendirilir. Seans planı ve olası hedefler, görüşme ve değerlendirme sonrasında ilgili uzmanla birlikte ele alınır; herkes için aynı süre veya sonuç vaat edilmez.',
  },
]

export default function KocaeliDilVeKonusmaTerapisiPage() {
  return (
    <main className="px-6 pb-20 pt-28 lg:pt-36">
      <article className="mx-auto max-w-4xl">
        <header className="mb-12 border-b border-border pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Kartepe · Kocaeli</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-secondary sm:text-6xl">
            Kocaeli Dil ve Konuşma Terapisi
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            KODİL, Kartepe’de dil ve konuşma terapisi, ergoterapi ve psikoloji alanlarında hizmet veren bir merkezdir.
            Bu sayfada hizmet alanları, randevu ve ulaşım bilgilerini doğrudan bulabilirsiniz.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground" href="tel:+905015640041">
              Ara: 0501 564 00 41
            </a>
            <a className="rounded-full border border-border px-6 py-3 font-semibold text-secondary" href="https://wa.me/905015640041">
              WhatsApp ile ulaşın
            </a>
          </div>
        </header>

        <div className="grid gap-10 md:grid-cols-[1fr_0.8fr]">
          <section aria-labelledby="hizmetler">
            <h2 id="hizmetler" className="font-serif text-3xl font-semibold text-secondary">Hizmet alanları</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Merkezde dil ve konuşma terapisi, ergoterapi ve psikoloji alanları sunulmaktadır. Başvurunun hangi hizmet
              alanına uygun olduğu ve izlenecek yol, kişinin ihtiyacı görüşülerek belirlenir.
            </p>
            <ul className="mt-5 list-inside list-disc space-y-2 text-muted-foreground">
              <li>Dil ve konuşma terapisi</li>
              <li>Ergoterapi</li>
              <li>Psikoloji hizmetleri</li>
            </ul>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Ekibin tanıtımını <Link className="font-semibold text-primary underline" href="/ekibimiz">uzman kadro sayfasında</Link>,
              terapi yolculuğunun adımlarını ise <Link className="font-semibold text-primary underline" href="/terapi-yolculugu">süreç sayfasında</Link> inceleyebilirsiniz.
            </p>
          </section>

          <aside className="h-fit rounded-3xl border border-border bg-card p-7">
            <h2 className="font-serif text-2xl font-semibold text-secondary">Adres ve çalışma saatleri</h2>
            <address className="mt-4 not-italic leading-relaxed text-muted-foreground">{address}</address>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Hafta içi 12.00–20.00<br />Hafta sonu 10.00–20.00<br />Randevu ile çalışılır.
            </p>
            <a
              className="mt-6 inline-flex font-semibold text-primary underline"
              href="https://maps.google.com/?q=Altek+Plaza,+Dumlupınar,+Şht.+Turgut+Çiçek+Cad.+Kartepe/Kocaeli"
              target="_blank"
              rel="noreferrer"
            >
              Haritada yol tarifi
            </a>
          </aside>
        </div>

        <section className="mt-16" aria-labelledby="sorular">
          <h2 id="sorular" className="font-serif text-3xl font-semibold text-secondary">Sık sorulan sorular</h2>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            {faqs.map(({ question, answer }) => (
              <div className="py-6" key={question}>
                <dt className="text-lg font-semibold text-secondary">{question}</dt>
                <dd className="mt-2 leading-relaxed text-muted-foreground">{answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Bu sayfadaki bilgiler merkez ve randevu süreci hakkındadır; tanı veya kişiye özel sağlık önerisi yerine geçmez.
            Güncel bilgi için merkezle doğrudan iletişime geçin.
          </p>
        </section>
      </article>
    </main>
  )
}
