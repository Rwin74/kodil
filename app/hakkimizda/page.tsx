import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hakkımızda ve Yayın İlkeleri',
  description: 'KODİL hakkında doğrulanabilir kurumsal bilgiler ve içerik yayın ilkeleri.',
  alternates: { canonical: '/hakkimizda' },
}

export default function AboutPage() {
  return (
    <main className="px-4 pb-20 pt-28 sm:pt-36">
      <article className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">KODİL hakkında</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-secondary sm:text-6xl">Kurumsal bilgiyi açık, kişi bilgisini doğrulanabilir tutuyoruz.</h1>
        <p className="mt-8 text-lg leading-relaxed text-muted-foreground">KODİL, Kocaeli konumunda dil ve konuşma terapisi, ergoterapi ve gelişim odaklı çalışma başlıklarını aynı ekip yapısı içinde sunar. Bu sayfada yalnızca mevcut site verisiyle desteklenen bilgiler yer alır.</p>
        <section id="editoryal-yaklasim" className="mt-12 rounded-3xl bg-card p-7 ring-1 ring-border sm:p-10">
          <h2 className="font-serif text-3xl font-semibold text-secondary">Editoryal yaklaşım</h2>
          <ul className="mt-6 list-disc space-y-4 pl-6 text-base leading-relaxed text-muted-foreground">
            <li>Kişiler içerik yazarı olarak yalnızca yazarlık bilgisi doğrulandığında gösterilir.</li>
            <li>İnceleme etiketi; inceleme tarihi, süreç bilgisi ve doğrulanmış uzmanlık kanıtı olduğunda kullanılır.</li>
            <li>Eğitim ve unvan bilgileri doğrulanabilir kaynak bulunmadığında yayımlanmaz.</li>
            <li>Kullanıcı geri bildirimleri yalnızca kaynağı ve yayın izni doğrulandıktan sonra paylaşılır.</li>
          </ul>
        </section>
        <Link href="/ekibimiz" className="mt-8 inline-flex font-semibold text-secondary underline decoration-primary decoration-2 underline-offset-4">Ekibimizi tanıyın</Link>
      </article>
    </main>
  )
}
