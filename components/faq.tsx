import Link from 'next/link'

const faqs = [
  {
    q: 'Çocuğum geç konuşuyor veya az kelime kullanıyor. Hangi uzmana başvurmalıyım?',
    a: (
      <>
        Önce çocuğunuzun doktoruyla gelişim kaygınızı paylaşın; doktor gerekli görürse gelişim taraması ve ilgili
        uzman değerlendirmesi planlar. Dil ve konuşma terapisti çocuğun iletişim, dili anlama ve dili kullanma
        becerilerini değerlendirir. Kocaeli’de bu değerlendirme ve hizmet hakkında bilgi almak için Kartepe’deki
        KODİL’e <a href="tel:+905015640041">0501 564 00 41</a> numarasından ulaşabilirsiniz. Gelişim kaygılarında
        beklemek yerine doktorla görüşme önerisini <a href="https://www.cdc.gov/act-early/families/concerned.html" target="_blank" rel="noreferrer">CDC de ailelere iletiyor</a>.
      </>
    ),
  },
  {
    q: 'Çocuğum konuşmuyor ama söylenenleri anlıyor. Bu ne anlama gelir?',
    a: (
      <>
        Tek başına bu bilgi bir tanı koydurmaz. İletişim ve dili anlama ile ifade etme becerilerinin birlikte
        değerlendirilmesi gerekir. Çocuğunuzun doktoruyla görüşün; dil ve konuşma terapisti de iletişim becerilerini
        değerlendirebilir. KODİL’in <Link href="/kocaeli-dil-ve-konusma-terapisi">Kartepe/Kocaeli hizmet ve randevu bilgileri</Link> burada yer alır.
      </>
    ),
  },
  {
    q: 'Konuşma gecikmesinde işitme testi gerekir mi?',
    a: (
      <>
        İşitme, konuşma ve dil gelişiminin değerlendirilmesinde dikkate alınan alanlardan biridir. Çocuğunuzun doktoruna
        danışın; gerekli görürse işitme değerlendirmesi için yönlendirme isteyin. Dil ve konuşma terapisti de iletişim
        becerilerini inceler. ASHA, geç dil gelişimi değerlendirmesinde işitme taramasını tipik bileşenlerden biri olarak açıklar.
      </>
    ),
  },
  {
    q: 'Çocuğum ismine dönmüyor veya göz teması kurmuyor. Otizm olabilir mi?',
    a: (
      <>
        Bu davranışlar tek başına otizm tanısı anlamına gelmez. Çocuğunuzun gelişimiyle ilgili kaygınızı çocuk doktoruyla
        paylaşın ve gelişim taraması ya da ileri değerlendirme gerekip gerekmediğini sorun. İletişim becerileri için dil ve
        konuşma terapisti değerlendirmesi de sürecin parçası olabilir. KODİL’de tanı konduğu iddia edilmez; merkezin
        sunduğu hizmetler hakkında <Link href="/ekibimiz">ekip sayfasından</Link> ve doğrudan iletişimle bilgi alın.
      </>
    ),
  },
  {
    q: 'Çocuğum kekeliyor veya sesleri doğru söyleyemiyor. Ne yapmalıyım?',
    a: (
      <>
        Kekemelik, konuşma akıcılığı ve konuşma seslerinin üretimi dil ve konuşma terapistinin değerlendirebileceği
        alanlardır. Belirtinin nedenini veya nasıl ilerleyeceğini yalnızca kısa bir tariften belirlemek mümkün değildir.
        Kocaeli’de KODİL’in dil ve konuşma terapisi hakkında bilgi almak için <Link href="/iletisim">merkezle iletişime geçin</Link>.
      </>
    ),
  },
  {
    q: 'Çocuğum seslere, kıyafetlere veya yemek dokularına çok hassas. Ergoterapi uygun olur mu?',
    a: (
      <>
        Duyusal tepkiler çocuğun günlük yaşamını etkiliyorsa bunu çocuk doktoruyla paylaşın. Doktor ve ilgili uzmanlar,
        günlük etkinliklerdeki ihtiyacı değerlendirerek ergoterapi görüşmesinin uygun olup olmadığını belirleyebilir.
        KODİL Kartepe’de ergoterapi hizmeti sunar; hizmetin çocuğunuza uygunluğunu merkezle ve çocuğunuzun sağlık ekibiyle görüşün.
      </>
    ),
  },
  {
    q: 'Kocaeli’de çocuk dil ve konuşma terapisti ararken nelere bakmalıyım?',
    a: (
      <>
        Görüşeceğiniz kişinin eğitim ve mesleki unvanını, değerlendirme sürecini, hedeflerin nasıl belirlendiğini,
        aile katılımını ve ücret/randevu koşullarını sorun. KODİL’in Kartepe’deki adresi, telefonu, çalışma saatleri ve
        yayımlanmış ekip bilgileri <Link href="/kocaeli-dil-ve-konusma-terapisi">Kocaeli hizmet sayfasında</Link> yer alır.
      </>
    ),
  },
  {
    q: 'KODİL Kocaeli’de nerede ve nasıl randevu alabilirim?',
    a: (
      <>
        KODİL, Altek Plaza, Dumlupınar, Şht. Turgut Çiçek Cad. D:3. Kat B12, 41250 Kartepe/Kocaeli adresindedir.
        Hafta içi 12.00–20.00, hafta sonu 10.00–20.00 saatlerinde randevu ile çalışır. Randevu ve güncel hizmet
        bilgisi için <a href="tel:+905015640041">0501 564 00 41</a> numarasını arayabilir veya
        <Link href="/iletisim"> iletişim sayfasını</Link> kullanabilirsiniz.
      </>
    ),
  },
]

export function Faq() {
  return (
    <section id="sss" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-14 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Ebeveynlerin Sık Sorduğu Sorular</span>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-secondary text-balance md:text-5xl">
            Çocuk gelişimi ve uzman desteği
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Bu genel bilgiler tanı yerine geçmez. Çocuğunuzun gelişimi hakkında kaygınız varsa çocuk doktoruyla görüşün.
          </p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="font-serif text-xl text-secondary md:text-2xl">{f.q}</span>
                <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-3xl pb-6 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Çocuk gelişimi hakkında aileler için kaynaklar: {' '}
          <a className="underline" href="https://www.cdc.gov/act-early/families/concerned.html" target="_blank" rel="noreferrer">CDC gelişim kaygısı rehberi</a>
          {' '}ve{' '}
          <a className="underline" href="https://www.asha.org/Practice-Portal/Clinical-Topics/Late-Language-Emergence/" target="_blank" rel="noreferrer">ASHA geç dil gelişimi değerlendirme bilgisi</a>.
        </p>
      </div>
    </section>
  )
}
