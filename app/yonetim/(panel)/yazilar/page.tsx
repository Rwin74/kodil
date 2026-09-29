import Link from 'next/link'
import { Plus } from 'lucide-react'
import { listAdminPosts } from '@/lib/admin/content-service'
import { requirePermission } from '@/lib/auth/dal'
import { hasPermission } from '@/lib/auth/permissions'

const labels: Record<string, string> = { draft: 'Taslak', in_review: 'İncelemede', scheduled: 'Zamanlandı', published: 'Yayında', archived: 'Arşiv' }

export default async function PostsPage() {
  const session = await requirePermission('content:view')
  const rows = await listAdminPosts()
  return <div>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">İçerik</p><h1 className="mt-2 font-serif text-3xl font-semibold text-navy">Yazılar</h1><p className="mt-2 text-sm text-muted-foreground">Canlı yayın ve çalışma kopyası durumları ayrı gösterilir.</p></div>
      {hasPermission(session.user.role, 'content:create') ? <Link href="/yonetim/yazilar/yeni" className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white"><Plus className="size-4" />Yeni yazı</Link> : null}
    </div>
    <div className="mt-8 overflow-x-auto rounded-2xl border border-navy/10"><table className="w-full text-left text-sm"><thead className="bg-sand/40 text-navy"><tr><th className="p-4">Başlık</th><th className="p-4">Canlı</th><th className="p-4">Çalışma</th><th className="p-4">İşlem</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-t border-navy/10"><td className="p-4"><span className="font-semibold text-navy">{row.title}</span><span className="mt-1 block text-xs text-muted-foreground">/blog/{row.slug}</span></td><td className="p-4">{labels[row.liveStatus]}</td><td className="p-4">{row.workingStatus ? labels[row.workingStatus] : '—'}{row.scheduledAt ? <span className="block text-xs">{row.scheduledAt}</span> : null}</td><td className="p-4"><Link className="font-semibold text-orange hover:underline" href={`/yonetim/yazilar/${row.id}`}>Aç</Link></td></tr>)}</tbody></table></div>
  </div>
}
