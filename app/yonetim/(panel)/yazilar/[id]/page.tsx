import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AdminActionForm } from '@/components/admin/action-form'
import { PostEditorForm } from '@/components/admin/post-editor-form'
import { restoreRevisionAction, reviewPostAction, submitPostAction, transitionPostAction } from '@/app/yonetim/(panel)/actions'
import { getAdminPost, type PostSnapshot } from '@/lib/admin/content-service'
import { createPreviewToken } from '@/lib/admin/preview-token'
import { requirePermission } from '@/lib/auth/dal'
import { hasPermission } from '@/lib/auth/permissions'
import { inputClassName } from '@/components/admin/form-controls'

function changedFields(current: PostSnapshot, revision: unknown) {
  if (!revision || typeof revision !== 'object') return ['Geçersiz eski şema']
  const older = revision as Record<string, unknown>
  const labels: Record<string, string> = { slug: 'Slug', title: 'Başlık', seoTitle: 'SEO başlığı', excerpt: 'Özet', content: 'İçerik', categoryId: 'Kategori', keywords: 'Anahtar kelimeler', authorId: 'Yazar', reviewerId: 'Reviewer', featuredMediaId: 'Medya', sources: 'Kaynaklar', indexable: 'İndeksleme', canonicalOverride: 'Canonical', canonicalOverrideReason: 'Canonical gerekçesi' }
  return Object.keys(labels).filter((key) => JSON.stringify(current[key as keyof PostSnapshot]) !== JSON.stringify(older[key])).map((key) => labels[key])
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission('content:view')
  const { id } = await params
  let data
  try { data = await getAdminPost(id) } catch { notFound() }
  const workflowStatus = data.workingCopy?.status ?? data.post.status
  let previewUrl: string | null = null
  try { const token = createPreviewToken(id, data.contentHash); previewUrl = `/onizleme/yazi/${id}?hash=${data.contentHash}&expires=${token.expires}&signature=${token.signature}` } catch { previewUrl = null }
  const canUpdate = hasPermission(session.user.role, 'content:update')
  const canPublish = hasPermission(session.user.role, 'content:publish')
  const canReview = hasPermission(session.user.role, 'clinical_review:approve')
  return <div className="max-w-5xl">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">Yazı · {workflowStatus}</p><h1 className="mt-2 font-serif text-3xl font-semibold text-navy">{data.snapshot.title}</h1><p className="mt-2 text-sm text-muted-foreground">Canlı durum: {data.post.status} · çalışma hash’i: {data.contentHash.slice(0, 12)}</p></div>{previewUrl ? <Link href={previewUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-navy/15 px-4 py-3 text-sm font-semibold text-navy">İmzalı önizleme</Link> : <span className="text-xs text-red-700">Önizleme secret’ı yapılandırılmadı</span>}</div>
    {canUpdate ? <section className="mt-8 rounded-2xl border border-navy/10 p-6"><PostEditorForm postId={id} currentSlug={data.post.slug} snapshot={data.snapshot} categories={data.categories} teamMembers={data.teamMembers} media={data.media.map((item) => ({ ...item, status: `${item.rightsStatus}/${item.permissionStatus}` }))} canManageCanonical={hasPermission(session.user.role, 'site_settings:manage')} contentHash={data.contentHash} /></section> : <p className="mt-8 rounded-xl bg-sand/40 p-4 text-sm">Bu rol içeriği salt okunur inceleyebilir.</p>}
    <section className="mt-8 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-navy/10 p-5"><h2 className="font-serif text-xl font-semibold text-navy">İş akışı</h2><div className="mt-4 space-y-4">
      {workflowStatus === 'draft' && hasPermission(session.user.role, 'content:submit_review') ? <AdminActionForm action={submitPostAction.bind(null, id)} label="Klinik incelemeye gönder" /> : null}
      {['in_review', 'scheduled', 'published', 'archived'].includes(workflowStatus) && canUpdate ? <AdminActionForm action={transitionPostAction.bind(null, id, 'draft')} label={workflowStatus === 'published' ? 'Yeni çalışma kopyası aç' : 'Taslağa döndür'} tone="secondary" /> : null}
      {workflowStatus === 'in_review' && canPublish ? <><AdminActionForm action={transitionPostAction.bind(null, id, 'published')} label="Şimdi yayımla" /><AdminActionForm action={transitionPostAction.bind(null, id, 'scheduled')} label="Yayını zamanla" tone="secondary"><label className="block text-sm font-semibold text-navy">Tarih ve saat<input className={inputClassName} type="datetime-local" name="scheduledAt" required /></label></AdminActionForm></> : null}
      {workflowStatus === 'scheduled' && canPublish ? <AdminActionForm action={transitionPostAction.bind(null, id, 'published')} label="Zamanlanan sürümü şimdi yayımla" /> : null}
      {workflowStatus !== 'archived' && hasPermission(session.user.role, 'content:archive') ? <AdminActionForm action={transitionPostAction.bind(null, id, 'archived')} label="Arşivle" tone="danger" /> : null}
    </div></div>
    <div className="rounded-2xl border border-navy/10 p-5"><h2 className="font-serif text-xl font-semibold text-navy">Klinik karar</h2><p className="mt-2 text-sm text-muted-foreground">Karar, görünen çalışma hash’ine bağlanır; taslak değişirse onay geçersiz olur.</p>{workflowStatus === 'in_review' && canReview ? <div className="mt-4 space-y-4"><AdminActionForm action={reviewPostAction.bind(null, id, 'approved')} label="İncelemeyi onayla"><label className="block text-sm font-semibold text-navy">Reviewer uzmanlık kaynağı<input className={inputClassName} type="url" name="expertiseSourceUrl" required /></label><label className="block text-sm font-semibold text-navy">Kanıt referansı<input className={inputClassName} name="evidenceReference" required /></label></AdminActionForm><AdminActionForm action={reviewPostAction.bind(null, id, 'rejected')} label="Reddet ve taslağa döndür" tone="danger"><input type="hidden" name="expertiseSourceUrl" value="https://invalid.example/rejection-record" /><input type="hidden" name="evidenceReference" value="rejected-by-clinical-reviewer" /></AdminActionForm></div> : <p className="mt-4 text-sm">İnceleme kararı vermek için yazı incelemede olmalı ve rol yetkili olmalı.</p>}</div></section>
    <section className="mt-8"><h2 className="font-serif text-2xl font-semibold text-navy">Revizyon geçmişi ve karşılaştırma</h2><div className="mt-4 space-y-3">{data.revisions.map((revision) => { const changes = changedFields(data.snapshot, revision.snapshot); const old = revision.snapshot as Partial<PostSnapshot>; return <details key={revision.id} className="rounded-xl border border-navy/10 p-4"><summary className="cursor-pointer font-semibold text-navy">#{revision.id} · {revision.createdAt} · {revision.changeNote ?? 'Not yok'}</summary><p className="mt-3 text-sm text-muted-foreground">Güncel çalışma kopyasına göre değişen alanlar: {changes.length ? changes.join(', ') : 'Fark yok'}</p><div className="mt-3 grid gap-3 md:grid-cols-2"><div className="rounded-lg bg-sand/30 p-3"><strong>Eski başlık/slug</strong><p className="mt-1 text-sm">{old.title}<br />{old.slug}</p></div><div className="rounded-lg bg-sand/30 p-3"><strong>Eski özet</strong><p className="mt-1 whitespace-pre-wrap text-sm">{old.excerpt}</p></div></div>{canUpdate ? <div className="mt-4"><AdminActionForm action={restoreRevisionAction.bind(null, id, revision.id)} label="Bu sürümü çalışma kopyasına al" tone="secondary" /></div> : null}</details>})}</div></section>
  </div>
}
