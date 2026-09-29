import { SiteSettingsForm } from '@/components/admin/site-settings-form'
import { getAdminSiteSettings } from '@/lib/admin/admin-service'
import { requirePermission } from '@/lib/auth/dal'
import { hasPermission } from '@/lib/auth/permissions'

export default async function SettingsPage() {
  const session = await requirePermission('site_settings:view')
  const settings = await getAdminSiteSettings()
  return <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">Kamusal bilgiler</p><h1 className="mt-2 font-serif text-3xl font-semibold text-navy">Site ayarları</h1><p className="mt-2 mb-8 text-sm leading-6 text-muted-foreground">Bu kayıt MySQL içerik kaynağı için yönetilir. Public ayar okuması ve cache otomasyonu Faz 5’te tek kaynağa bağlanacaktır.</p>{hasPermission(session.user.role, 'site_settings:manage') ? <SiteSettingsForm value={settings} /> : <p className="rounded-xl bg-sand/40 p-4 text-sm">Bu rol ayarları görüntüleyebilir ancak değiştiremez.</p>}</div>
}
