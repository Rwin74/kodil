import { FileCheck2, KeyRound, ShieldCheck, Users } from 'lucide-react'
import { requirePermission } from '@/lib/auth/dal'
import { hasPermission, ROLE_LABELS } from '@/lib/auth/permissions'

export default async function AdminDashboardPage() {
  const session = await requirePermission('dashboard:view')
  const role = session.user.role

  const cards = [
    {
      title: 'İçerik yönetimi',
      description: hasPermission(role, 'content:update')
        ? 'Taslak, inceleme, revizyon ve güvenli yayın iş akışını kullanabilirsiniz.'
        : 'İçerikleri salt okunur görebilirsiniz. Düzenleme yetkiniz yok.',
      icon: FileCheck2,
    },
    {
      title: 'Klinik inceleme',
      description: hasPermission(role, 'clinical_review:approve')
        ? 'İnceleme onaylama ve reddetme yetkiniz var.'
        : 'Klinik onay verme yetkiniz yok.',
      icon: ShieldCheck,
    },
    {
      title: 'Kullanıcılar',
      description: hasPermission(role, 'users:manage')
        ? 'Kullanıcı ve rol yönetimi yalnız yönetici hesabına açık.'
        : 'Kullanıcı ve rol yönetimine erişiminiz yok.',
      icon: Users,
    },
    {
      title: 'Hesap güvenliği',
      description: 'MFA etkin. Güvenlik sayfasından yedek kodlarınızı yenileyebilirsiniz.',
      icon: KeyRound,
    },
  ]

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
        {ROLE_LABELS[role]}
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-navy">Genel bakış</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Bu kabuk yalnız yetkili ve MFA doğrulaması tamamlanmış oturumlara açıktır. Gösterilen yetkiler sunucu tarafındaki
        rol matrisiyle belirlenir.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map(({ title, description, icon: Icon }) => (
          <section key={title} className="rounded-2xl border border-navy/10 bg-cream/45 p-5">
            <Icon aria-hidden="true" className="size-5 text-orange" />
            <h2 className="mt-4 font-semibold text-navy">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
