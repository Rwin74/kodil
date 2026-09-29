import { asc, desc, eq } from 'drizzle-orm'
import { TeamEditorForm } from '@/components/admin/team-editor-form'
import { getDatabase } from '@/db/client'
import { media, users } from '@/db/schema'
import { requirePermission } from '@/lib/auth/dal'

export default async function NewTeamMemberPage() {
  const session = await requirePermission('content:create')
  const [mediaRows, reviewerUsers] = await Promise.all([
    getDatabase().select({ id: media.id, altText: media.altText, rightsStatus: media.rightsStatus, permissionStatus: media.permissionStatus }).from(media).orderBy(desc(media.createdAt)),
    session.user.role === 'admin'
      ? getDatabase().select({ id: users.id, displayName: users.displayName, email: users.email, role: users.role }).from(users).where(eq(users.status, 'active')).orderBy(asc(users.displayName))
      : Promise.resolve([]),
  ])
  const member = { slug: '', name: '', role: '', bio: '', accent: 'var(--navy)', status: 'draft', featuredMediaId: null, reviewerUserId: null }
  return <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">Yeni kişi</p><h1 className="mt-2 mb-8 font-serif text-3xl font-semibold text-navy">Ekip profili</h1><TeamEditorForm memberId={null} member={member} credentials={[]} media={mediaRows} reviewerUsers={reviewerUsers} canManageReviewerIdentity={session.user.role === 'admin'} /></div>
}
