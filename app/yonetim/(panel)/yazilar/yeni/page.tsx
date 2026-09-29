import { PostEditorForm } from '@/components/admin/post-editor-form'
import { getDatabase } from '@/db/client'
import { categories, media, teamMembers } from '@/db/schema'
import { asc, desc, eq } from 'drizzle-orm'
import { requirePermission } from '@/lib/auth/dal'
import { hasPermission } from '@/lib/auth/permissions'
import type { PostSnapshot } from '@/lib/admin/content-service'

export default async function NewPostPage() {
  const session = await requirePermission('content:create')
  const [categoryRows, memberRows, mediaRows] = await Promise.all([
    getDatabase().select().from(categories).orderBy(asc(categories.sortOrder)),
    getDatabase().select({ id: teamMembers.id, name: teamMembers.name, role: teamMembers.role }).from(teamMembers).where(eq(teamMembers.status, 'published')).orderBy(asc(teamMembers.sortOrder)),
    getDatabase().select({ id: media.id, altText: media.altText, status: media.rightsStatus }).from(media).orderBy(desc(media.createdAt)),
  ])
  if (!categoryRows[0]) throw new Error('Yazı oluşturmadan önce en az bir kategori gerekir.')
  const empty: PostSnapshot = { version: 1, slug: '', title: '', seoTitle: null, excerpt: '', content: '', categoryId: categoryRows[0].id, keywords: [], authorId: null, reviewerId: null, reviewedAt: null, featuredMediaId: null, sources: [], image: null, experience: null, indexable: true, canonicalOverride: null, canonicalOverrideReason: null, sortOrder: 999, slugChangeReason: null }
  return <div className="max-w-4xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">Yeni içerik</p><h1 className="mt-2 font-serif text-3xl font-semibold text-navy">Yazı taslağı</h1><p className="mt-2 mb-8 text-sm leading-6 text-muted-foreground">Kaydetme işlemi canlı yayını etkilemez. Yayın için gerçek yazar, kanıtlı reviewer, kaynak ve klinik onay gerekir.</p><PostEditorForm postId={null} currentSlug={null} snapshot={empty} categories={categoryRows} teamMembers={memberRows} media={mediaRows} canManageCanonical={hasPermission(session.user.role, 'site_settings:manage')} contentHash={null} /></div>
}
