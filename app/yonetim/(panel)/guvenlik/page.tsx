import { BackupCodeForm } from '@/components/admin/backup-code-form'
import { requireAdminSession } from '@/lib/auth/dal'

export default async function SecurityPage() {
  await requireAdminSession()

  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">Hesap</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-navy">Güvenlik</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        MFA yönetim hesaplarında kapatılamaz. Yedek kodlarınız kaybolduysa mevcut parolanızla yeni bir takım üretin.
      </p>
      <section className="mt-8 rounded-2xl border border-navy/10 bg-cream/45 p-5 sm:p-6">
        <h2 className="font-serif text-xl font-semibold text-navy">Yedek kodları yenile</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          İşlem yeni kodları yalnız bir kez gösterir ve önceki kodların tamamını geçersiz kılar.
        </p>
        <div className="mt-5">
          <BackupCodeForm />
        </div>
      </section>
    </div>
  )
}
