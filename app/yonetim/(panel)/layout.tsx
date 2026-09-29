import Link from 'next/link'
import { FileText, ImageIcon, LayoutDashboard, Settings, ShieldCheck, Users } from 'lucide-react'
import { LogoutButton } from '@/components/admin/logout-button'
import { requireAdminSession } from '@/lib/auth/dal'
import { hasPermission, ROLE_LABELS } from '@/lib/auth/permissions'

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession()
  const navigation = [
    { href: '/yonetim', label: 'Genel bakış', icon: LayoutDashboard, visible: true },
    { href: '/yonetim/yazilar', label: 'Yazılar', icon: FileText, visible: hasPermission(session.user.role, 'content:view') },
    { href: '/yonetim/ekip', label: 'Ekip', icon: Users, visible: hasPermission(session.user.role, 'content:view') },
    { href: '/yonetim/medya', label: 'Medya', icon: ImageIcon, visible: hasPermission(session.user.role, 'media:view') },
    { href: '/yonetim/ayarlar', label: 'Site ayarları', icon: Settings, visible: hasPermission(session.user.role, 'site_settings:view') },
    { href: '/yonetim/guvenlik', label: 'Güvenlik', icon: ShieldCheck, visible: true },
  ] as const

  return (
    <main className="relative z-10 mx-auto min-h-[75vh] w-full max-w-7xl px-5 py-10 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-navy/10 bg-white/90 shadow-xl shadow-navy/5 backdrop-blur">
        <header className="flex flex-col gap-4 border-b border-navy/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/yonetim" className="font-serif text-2xl font-semibold text-navy">
              KODİL Yönetim
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {session.user.displayName} · {ROLE_LABELS[session.user.role]}
            </p>
          </div>
          <LogoutButton />
        </header>
        <div className="grid lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="border-b border-navy/10 bg-sand/30 p-4 lg:border-r lg:border-b-0">
            <nav aria-label="Yönetim menüsü" className="flex gap-2 lg:flex-col">
              {navigation.filter((item) => item.visible).map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-navy hover:bg-white"
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="min-w-0 p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </main>
  )
}
