import Link from 'next/link'
import { Plus } from 'lucide-react'
import { listAdminTeamMembers } from '@/lib/admin/admin-service'
import { requirePermission } from '@/lib/auth/dal'
import { hasPermission } from '@/lib/auth/permissions'

export default async function TeamPage() {
  const session = await requirePermission('content:view')
  const rows = await listAdminTeamMembers()
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">Kişiler</p><h1 className="mt-2 font-serif text-3xl font-semibold text-navy">Ekip profilleri</h1><p className="mt-2 text-sm text-muted-foreground">Eğitim, uzmanlık ve dış profil iddiaları kaynak ve kanıt olmadan yayımlanamaz.</p></div>{hasPermission(session.user.role, 'content:create') ? <Link href="/yonetim/ekip/yeni" className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white"><Plus className="size-4" />Yeni profil</Link> : null}</div><div className="mt-8 grid gap-4 sm:grid-cols-2">{rows.map((row) => <article key={row.id} className="rounded-xl border border-navy/10 p-5"><span className="text-xs font-semibold uppercase text-orange">{row.status}</span><h2 className="mt-2 font-semibold text-navy">{row.name}</h2><p className="text-sm text-muted-foreground">{row.role}</p><Link className="mt-4 inline-block text-sm font-semibold text-orange" href={`/yonetim/ekip/${row.id}`}>Profili aç</Link></article>)}</div></div>
}
