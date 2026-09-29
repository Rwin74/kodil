import { MessageSquareQuote } from 'lucide-react'

export function SuccessStories() {
  return (
    <section
      id="geri-bildirimler"
      className="relative overflow-hidden bg-secondary py-24 text-secondary-foreground md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          Deneyim ve geri bildirim
        </p>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
          Kanıt, izin ve mahremiyet olmadan yorum yayımlamıyoruz.
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-secondary-foreground/75">
          Bu alanda yalnız kaynağı doğrulanmış, site yayınına açık izni kayıtlı ve
          hukuki uygunluk incelemesi tamamlanmış gerçek kullanıcı geri bildirimleri
          gösterilebilir.
        </p>

        <div
          data-feedback-status="awaiting-verified-data"
          className="mt-12 grid gap-6 rounded-[2rem] border border-secondary-foreground/20 bg-secondary-foreground/5 p-7 sm:grid-cols-[auto_1fr] sm:p-9"
        >
          <MessageSquareQuote className="h-9 w-9 text-primary" aria-hidden="true" />
          <div>
            <h3 className="font-serif text-2xl font-semibold">
              Yayına uygun doğrulanmış geri bildirim henüz yok
            </h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-secondary-foreground/70">
              Bu nedenle yayın sayfasında örnek yorum, danışan adı, puan, başarı
              oranı veya tedavi sonucu gösterilmiyor. Sağlık hizmetine yönelik
              teşekkür ve memnuniyet ifadelerinin reklam niteliğinde kullanımı
              ayrıca mevzuat incelemesine tabidir.
            </p>
            <a
              className="mt-5 inline-flex font-semibold text-primary underline decoration-2 underline-offset-4"
              href="/hakkimizda#editoryal-yaklasim"
            >
              Yayın ilkelerini inceleyin
            </a>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-secondary-foreground/60">
          Kullanıcı geri bildirimleri kişisel deneyim aktarımıdır; her bireyin
          süreci farklıdır ve hiçbir yorum sağlık sonucu garantisi oluşturmaz.
        </p>
      </div>
    </section>
  )
}
