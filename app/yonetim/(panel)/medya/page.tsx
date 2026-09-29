import { MediaUploadForm } from '@/components/admin/media-upload-form'
import { listAdminMedia } from '@/lib/admin/admin-service'
import { requirePermission } from '@/lib/auth/dal'
import { hasPermission } from '@/lib/auth/permissions'

export default async function MediaPage() {
  const session = await requirePermission('media:view')
  const rows = await listAdminMedia()
  return <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">Dosyalar</p><h1 className="mt-2 font-serif text-3xl font-semibold text-navy">Medya</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Yalnız doğrulanmış hak ve izin durumundaki türevler kamusal medya rotasından servis edilir.</p>
    {hasPermission(session.user.role, 'media:manage') ? <section className="mt-8 rounded-2xl border border-navy/10 p-6"><h2 className="mb-5 font-serif text-xl font-semibold text-navy">Yeni görsel</h2><MediaUploadForm /></section> : null}
    <section className="mt-8"><h2 className="font-serif text-xl font-semibold text-navy">Kayıtlar</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{rows.map((item) => <article key={item.id} className="rounded-xl border border-navy/10 p-4"><p className="font-semibold text-navy">{item.altText}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{item.width}×{item.height} · {Math.round(item.byteSize / 1024)} KB · {item.mimeType}<br />Hak: {item.rightsStatus} · kişi izni: {item.permissionStatus}<br />{item.caption}</p>{item.rightsStatus === 'verified' && ['verified', 'not_applicable'].includes(item.permissionStatus) ? <a href={`/media/${item.avifStorageKey ?? item.storageKey}`} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-orange">Türevi aç</a> : null}</article>)}</div></section>
  </div>
}
