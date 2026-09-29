'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveTeamMemberAction } from '@/app/yonetim/(panel)/actions'
import { INITIAL_ADMIN_ACTION_STATE } from '@/lib/admin/action-state'
import { FormMessage, inputClassName, primaryButtonClassName } from '@/components/admin/form-controls'

type Member = { slug: string; name: string; role: string; bio: string; accent: string; status: string; featuredMediaId: string | null; reviewerUserId: string | null }
type Credential = { kind: string; name: string; institution: string | null; field: string | null; sourceUrl: string; verifiedAt: string; evidenceReference: string | null }

export function TeamEditorForm({ memberId, member, credentials, media, reviewerUsers, canManageReviewerIdentity }: { memberId: string | null; member: Member; credentials: Credential[]; media: { id: string; altText: string; rightsStatus: string; permissionStatus: string }[]; reviewerUsers: { id: string; displayName: string; email: string; role: string }[]; canManageReviewerIdentity: boolean }) {
  const router = useRouter()
  const action = saveTeamMemberAction.bind(null, memberId)
  const [state, formAction, pending] = useActionState(action, INITIAL_ADMIN_ACTION_STATE)
  useEffect(() => {
    if (state.status !== 'success') return
    if (state.redirectTo) router.push(state.redirectTo)
    router.refresh()
  }, [router, state])
  const serialized = credentials.map((item) => [item.kind, item.name, item.institution ?? '', item.field ?? '', item.sourceUrl, item.verifiedAt, item.evidenceReference ?? ''].join(' | ')).join('\n')
  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-navy">Ad<input className={inputClassName} name="name" defaultValue={member.name} required /></label>
        <label className="text-sm font-semibold text-navy">Görev<input className={inputClassName} name="role" defaultValue={member.role} required /></label>
        <label className="text-sm font-semibold text-navy">Slug<input className={inputClassName} name="slug" defaultValue={member.slug} required /></label>
        <label className="text-sm font-semibold text-navy">Durum<select className={inputClassName} name="status" defaultValue={member.status}><option value="draft">Taslak</option><option value="published">Yayında</option><option value="archived">Arşiv</option></select></label>
      </div>
      {memberId ? <div className="rounded-xl border border-orange/25 bg-orange/5 p-4 text-sm"><label className="flex gap-3"><input type="checkbox" name="slugChangeAcknowledged" />Slug değişirse eski profil URL’si için 308 yönlendirme oluştur.</label><input className={inputClassName} name="slugChangeReason" placeholder="Slug değişikliği gerekçesi" /></div> : null}
      <label className="block text-sm font-semibold text-navy">Doğrulanabilir kısa biyografi<textarea className={inputClassName} name="bio" defaultValue={member.bio} rows={5} minLength={30} required /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-navy">Renk değişkeni<input className={inputClassName} name="accent" defaultValue={member.accent} /></label>
        <label className="text-sm font-semibold text-navy">Profil görseli<select className={inputClassName} name="featuredMediaId" defaultValue={member.featuredMediaId ?? ''}><option value="">Mevcut görseli koru</option>{media.map((item) => <option value={item.id} key={item.id}>{item.altText} · {item.rightsStatus}/{item.permissionStatus}</option>)}</select></label>
      </div>
      {canManageReviewerIdentity ? <label className="block text-sm font-semibold text-navy">Reviewer oturum hesabı<select className={inputClassName} name="reviewerUserId" defaultValue={member.reviewerUserId ?? ''}><option value="">Bağlı hesap yok</option>{reviewerUsers.map((user) => <option key={user.id} value={user.id}>{user.displayName} · {user.email} · {user.role}</option>)}</select><span className="mt-2 block font-normal text-muted-foreground">Klinik karar yalnız burada seçilen oturum ile bu kişi profili eşleştiğinde verilebilir.</span></label> : <input type="hidden" name="reviewerUserId" value="" />}
      <label className="block text-sm font-semibold text-navy">Eğitim, uzmanlık ve dış profil kanıtları<textarea className={`${inputClassName} font-mono text-xs`} name="credentials" defaultValue={serialized} rows={9} /><span className="mt-2 block font-normal leading-5 text-muted-foreground">Her satır: education|expertise|external_profile | ad | kurum | alan/dış profil türü | HTTPS kaynak | YYYY-MM-DD | kanıt referansı</span></label>
      {state.status !== 'idle' ? <FormMessage message={state.message} success={state.status === 'success'} /> : null}
      <button className={primaryButtonClassName} disabled={pending} type="submit">{pending ? 'Kaydediliyor…' : 'Profili ve kanıtları kaydet'}</button>
    </form>
  )
}
