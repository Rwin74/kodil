'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { savePostAction } from '@/app/yonetim/(panel)/actions'
import { INITIAL_ADMIN_ACTION_STATE } from '@/lib/admin/action-state'
import { serializeSources } from '@/lib/admin/content-policy'
import type { PostSnapshot } from '@/lib/admin/content-service'
import { FormMessage, inputClassName, primaryButtonClassName } from '@/components/admin/form-controls'

type Option = { id: string; name?: string; title?: string; altText?: string; role?: string; status?: string }

export function PostEditorForm({
  postId,
  currentSlug,
  snapshot,
  categories,
  teamMembers,
  media,
  canManageCanonical,
  contentHash,
}: {
  postId: string | null
  currentSlug: string | null
  snapshot: PostSnapshot
  categories: Option[]
  teamMembers: Option[]
  media: Option[]
  canManageCanonical: boolean
  contentHash: string | null
}) {
  const router = useRouter()
  const action = savePostAction.bind(null, postId)
  const [state, formAction, pending] = useActionState(action, INITIAL_ADMIN_ACTION_STATE)
  useEffect(() => {
    if (state.status !== 'success') return
    if (state.redirectTo) router.push(state.redirectTo)
    router.refresh()
  }, [router, state])

  return (
    <form action={formAction} className="space-y-7">
      <input type="hidden" name="expectedContentHash" value={contentHash ?? ''} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-navy">
          Başlık
          <input className={inputClassName} name="title" defaultValue={snapshot.title} minLength={8} maxLength={320} required />
        </label>
        <label className="text-sm font-semibold text-navy">
          SEO başlığı
          <input className={inputClassName} name="seoTitle" defaultValue={snapshot.seoTitle ?? ''} maxLength={70} />
        </label>
      </div>
      <label className="block text-sm font-semibold text-navy">
        Slug
        <input className={inputClassName} name="slug" defaultValue={snapshot.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required />
        <span className="mt-2 block font-normal text-muted-foreground">Küçük harf, rakam ve tire kullanın. Kaydederken güvenli biçime dönüştürülür.</span>
      </label>
      {currentSlug ? (
        <div className="rounded-xl border border-orange/25 bg-orange/5 p-4 text-sm text-navy">
          <label className="flex gap-3">
            <input type="checkbox" name="slugChangeAcknowledged" className="mt-1" />
            <span>Slug değişirse eski URL için aynı yayın işleminde kalıcı yönlendirme oluşturulacağını anlıyorum.</span>
          </label>
          <label className="mt-3 block font-semibold">
            Slug değişikliği gerekçesi
            <input className={inputClassName} name="slugChangeReason" defaultValue={snapshot.slugChangeReason ?? ''} maxLength={500} />
          </label>
        </div>
      ) : null}
      <label className="block text-sm font-semibold text-navy">
        Özet
        <textarea className={inputClassName} name="excerpt" defaultValue={snapshot.excerpt} rows={3} minLength={30} maxLength={500} required />
      </label>
      <label className="block text-sm font-semibold text-navy">
        Kontrollü Markdown içerik
        <textarea className={`${inputClassName} font-mono text-sm`} name="content" defaultValue={snapshot.content} rows={22} minLength={80} required />
        <span className="mt-2 block font-normal text-muted-foreground">HTML, script, veri URL’si ve Markdown görseli kabul edilmez. Görseller medya alanından seçilir.</span>
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-navy">
          Kategori
          <select className={inputClassName} name="categoryId" defaultValue={snapshot.categoryId} required>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-navy">
          Anahtar kelimeler
          <input className={inputClassName} name="keywords" defaultValue={snapshot.keywords.join(', ')} />
        </label>
        <label className="text-sm font-semibold text-navy">
          Gerçek yazar
          <select className={inputClassName} name="authorId" defaultValue={snapshot.authorId ?? ''}>
            <option value="">Doğrulanmadı / seçilmedi</option>
            {teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.role}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-navy">
          Klinik reviewer profili
          <select className={inputClassName} name="reviewerId" defaultValue={snapshot.reviewerId ?? ''}>
            <option value="">Seçilmedi</option>
            {teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.role}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-navy sm:col-span-2">
          Öne çıkan doğrulanmış medya
          <select className={inputClassName} name="featuredMediaId" defaultValue={snapshot.featuredMediaId ?? ''}>
            <option value="">Mevcut yazı görselini koru / sosyal kart kullan</option>
            {media.map((item) => <option key={item.id} value={item.id}>{item.altText} · {item.status ?? ''}</option>)}
          </select>
        </label>
      </div>
      <label className="block text-sm font-semibold text-navy">
        Kaynaklar
        <textarea className={`${inputClassName} font-mono text-xs`} name="sources" defaultValue={serializeSources(snapshot.sources)} rows={7} />
        <span className="mt-2 block font-normal leading-5 text-muted-foreground">Her satır: Başlık | HTTPS URL | Yayıncı | YYYY-MM-DD | kurum içi kanıt referansı | kullanım notu</span>
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-navy">
          Değişiklik notu
          <input className={inputClassName} name="changeNote" maxLength={500} placeholder="Bu sürümde ne değişti?" />
        </label>
        <label className="flex items-center gap-3 self-end rounded-xl border border-navy/10 p-4 text-sm font-semibold text-navy">
          <input type="checkbox" name="indexable" defaultChecked={snapshot.indexable} />
          Yayınlandığında indekslenebilir
        </label>
      </div>
      {canManageCanonical ? (
        <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold text-navy">
          Canonical override
          <input className={inputClassName} name="canonicalOverride" defaultValue={snapshot.canonicalOverride ?? ''} placeholder="Normalde boş bırakın" />
        </label><label className="block text-sm font-semibold text-navy">Canonical gerekçesi<input className={inputClassName} name="canonicalOverrideReason" defaultValue={snapshot.canonicalOverrideReason ?? ''} /></label></div>
      ) : <><input type="hidden" name="canonicalOverride" value={snapshot.canonicalOverride ?? ''} /><input type="hidden" name="canonicalOverrideReason" value={snapshot.canonicalOverrideReason ?? ''} /></>}
      {state.status !== 'idle' ? <FormMessage message={state.message} success={state.status === 'success'} /> : null}
      <button type="submit" disabled={pending} className={primaryButtonClassName}>{pending ? 'Kaydediliyor…' : 'Çalışma kopyasını kaydet'}</button>
    </form>
  )
}
