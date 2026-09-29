import type { Metadata } from 'next'
import Link from 'next/link'

const address = 'Altek Plaza, Dumlupınar, Şht. Turgut Çiçek Cad. D:3. Kat B12, 41250 Kartepe/Kocaeli'

export const metadata: Metadata = {
  title: 'Kocaeli Çocuk Dil ve Konuşma Terapisi | KODİL Kartepe',
  description:
    'Çocuğunuz geç konuşuyor veya iletişiminde zorlanıyorsa hangi uzmana başvurmalı? Kocaeli Kartepe’de KODİL dil ve konuşma terapisi, hizmet ve randevu bilgileri.',
  alternates: { canonical: '/kocaeli-dil-ve-konusma-terapisi' },
  openGraph: {
    title: 'Kocaeli Çocuk Dil ve Konuşma Terapisi | KODİL Kartepe',
    description: 'Çocukların konuşma ve iletişim gelişimiyle ilgili kaygılarda uzman desteği, KODİL Kartepe iletişim ve randevu bilgileri.',
    url: 'https://kocaelidilvekonusma.com/kocaeli-dil-ve-konusma-terapisi',
    type: 'article',
  },
}

const faqs = [
  {
    question: 'Çocuğum geç konuşuyor; Kocaeli’de hangi uzmana başvurmalıyım?',
    answer:
      'Gelişim kaygınızı öncelikle çocuğunuzun doktoruyla paylaşın ve gelişim taraması gerekip gerekmediğini sorun. Dil ve konuşma terapisti, çocuğun iletişim, dili anlama ve dili kullanma becerilerini değerlendirebilir. KODİL, Kartepe/Kocaeli’de dil ve konuşma terapisi hizmeti sunan merkezlerden biridir; bilgi ve randevu için 0501 564 00 41 numarasını arayabilirsiniz.',
  },
  {
    question: 'Çocuğum konuşmuyor ama söylenenleri anlıyor. Ne yapmalıyım?',
    answer:
      'Yalnızca bu gözleme dayanarak nedenini veya tanıyı belirlemek mümkün değildir. Çocuğun doktoruyla konuşun; bir dil ve konuşma terapisti dili anlama ve ifade etme becerilerini değerlendirebilir. KODİL’in Kartepe’deki hizmet ve randevu bilgileri bu sayfada yer alır.',
  },
  {
    question: 'Çocuğumun konuşması anlaşılmıyor veya kekeliyor. Dil ve konuşma terapisti yardımcı olabilir mi?',
    answer:
      'Konuşma sesleri ve konuşma akıcılığı, dil ve konuşma terapistinin değerlendirebileceği alanlardır. Çocuğun ihtiyacı ve izlenecek yol uzman değerlendirmesinde belirlenir; tek bir belirti tanı veya sonuç garantisi anlamına gelmez.',
  },
  {
    question: 'İsme tepki vermeme veya göz teması kurmama otizm tanısı koydurur mu?',
    answer:
      'Hayır. Tek bir davranışla otizm tanısı konulamaz. Bu gözlemlerinizi çocuğunuzun doktoruyla paylaşın ve gelişim taraması ya da ileri değerlendirme gerekip gerekmediğini sorun. KODİL’de tanı konduğu iddia edilmez; merkez dil ve konuşma terapisi hizmeti sunar.',
  },
  {
    question: 'Ses, dokunma veya yemek dokularına hassasiyet varsa hangi uzmana danışmalıyım?',
    answer:
      'Önce bu tepkilerin günlük yaşamı nasıl etkilediğini çocuğunuzun doktoruyla paylaşın. Gerekli görülürse ergoterapist, yemek, giyinme, oyun veya okul gibi etkinliklere katılımla ilgili ihtiyaçları değerlendirebilir. Tek bir hassasiyet tanı koydurmaz; KODİL’de ergoterapi hizmeti hakkında bilgi alabilirsiniz.',
  },
  {
    question: 'Konuşma gecikmesinde işitme değerlendirmesi de düşünülmeli mi?',
    answer:
      'İşitme, konuşma ve dil gelişiminin değerlendirilmesinde dikkate alınabilir. Çocuğunuzun doktoruna danışın ve gerekirse işitme değerlendirmesi için yönlendirme isteyin. ASHA’nın geç dil gelişimi bilgi sayfası işitme taramasını tipik değerlendirme bileşenleri arasında sayar.',
  },
  {
    question: 'KODİL Kocaeli’de nerede, nasıl randevu alabilirim?',
    answer:
      'KODİL, Altek Plaza, Dumlupınar, Şht. Turgut Çiçek Cad. D:3. Kat B12, 41250 Kartepe/Kocaeli adresindedir. Hafta içi 12.00–20.00, hafta sonu 10.00–20.00 saatlerinde randevu ile çalışır. Güncel bilgi için 0501 564 00 41 numarasını arayın.',
  },
]

export default function KocaeliDilVeKonusmaTerapisiPage() {
  return (
    <main className="px-6 pb-20 pt-28 lg:pt-36">
      <article className="mx-auto max-w-4xl">
        <header className="mb-12 border-b border-border pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Kartepe · Kocaeli</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-secondary sm:text-6xl">
            Çocuğum Geç Konuşuyor: Kocaeli’de Hangi Uzmana Başvurmalıyım?
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Çocuğunuzun konuşma, dili anlama veya iletişim gelişimiyle ilgili kaygınız varsa bunu çocuğunuzun doktoruyla
            paylaşın. Dil ve konuşma terapisti iletişim becerilerini değerlendirebilir. KODİL, Kartepe/Kocaeli’de dil ve
            konuşma terapisi, ergoterapi ve psikoloji hizmetleri sunan bir merkezdir.
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

        <section className="mb-14 rounded-3xl border border-border bg-card p-7 sm:p-9" aria-labelledby="ilk-adimlar">
          <h2 id="ilk-adimlar" className="font-serif text-2xl font-semibold text-secondary sm:text-3xl">Çocuğumun gelişimi için endişeliyim. İlk adım ne?</h2>
          <ol className="mt-5 list-inside list-decimal space-y-3 leading-relaxed text-muted-foreground">
            <li>Gözlemlerinizi not edin ve çocuğunuzun doktoruyla paylaşın; gelişim taraması veya başka bir değerlendirme gerekip gerekmediğini sorun.</li>
            <li>Konuşma ve iletişim becerileri için dil ve konuşma terapisti değerlendirmesi hakkında bilgi alın. İşitme konusunda kaygı varsa bunu da doktora söyleyin.</li>
            <li>Kocaeli’de yüz yüze bilgi almak isterseniz KODİL’in Kartepe’deki ekibine ulaşın. Uygun hizmet ve süreç, çocuğun bireysel ihtiyacı görüşülerek belirlenir.</li>
          </ol>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Gelişim basamakları tanı aracı değildir. CDC, gelişimle ilgili kaygıların çocuğun doktoruyla paylaşılmasını önerir. {' '}
            <a className="underline" href="https://www.cdc.gov/act-early/families/concerned.html" target="_blank" rel="noreferrer">CDC: Gelişiminden endişe duyduğunuzda</a>
            {' '}·{' '}
            <a className="underline" href="https://www.asha.org/Practice-Portal/Clinical-Topics/Late-Language-Emergence/" target="_blank" rel="noreferrer">ASHA: Geç dil gelişimi ve değerlendirme</a>
          </p>
        </section>

        <div className="grid gap-10 md:grid-cols-[1fr_0.8fr]">
          <section aria-labelledby="hizmetler">
            <h2 id="hizmetler" className="font-serif text-3xl font-semibold text-secondary">Kocaeli’de çocuklar için uzman desteği</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              KODİL’de dil ve konuşma terapisi, ergoterapi ve psikoloji hizmetleri sunulmaktadır. Çocuğunuzun hangi
              hizmete ihtiyaç duyduğunu bu sayfa üzerinden teşhis etmek mümkün değildir; başvuru konusu ve izlenecek
              süreç aileyle yapılan görüşme ve uzman değerlendirmesiyle ele alınır.
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
            <h2 className="font-serif text-2xl font-semibold text-secondary">KODİL Kartepe iletişim bilgileri</h2>
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
          <h2 id="sorular" className="font-serif text-3xl font-semibold text-secondary">Ebeveynlerin sık sorduğu sorular</h2>
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
