import { notFound } from 'next/navigation'
import { TeamEditorForm } from '@/components/admin/team-editor-form'
import { getAdminTeamMember } from '@/lib/admin/admin-service'
import { requirePermission } from '@/lib/auth/dal'

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission('content:update')
  const { id } = await params
  let data
  try { data = await getAdminTeamMember(id, session.user.role === 'admin') } catch { notFound() }
  return <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">Ekip profili</p><h1 className="mt-2 mb-8 font-serif text-3xl font-semibold text-navy">{data.member.name}</h1><TeamEditorForm memberId={id} member={data.member} credentials={data.credentials} media={data.media} reviewerUsers={data.reviewerUsers} canManageReviewerIdentity={session.user.role === 'admin'} /></div>
}
