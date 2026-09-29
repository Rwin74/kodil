'use client'

import { useActionState } from 'react'
import { uploadMediaAction } from '@/app/yonetim/(panel)/actions'
import { INITIAL_ADMIN_ACTION_STATE } from '@/lib/admin/action-state'
import { FormMessage, inputClassName, primaryButtonClassName } from '@/components/admin/form-controls'

export function MediaUploadForm() {
  const [state, action, pending] = useActionState(uploadMediaAction, INITIAL_ADMIN_ACTION_STATE)
  return (
    <form action={action} className="space-y-5">
      <label className="block text-sm font-semibold text-navy">Görsel dosyası<input className={inputClassName} type="file" name="file" accept="image/jpeg,image/png,image/webp,image/avif" required /></label>
      <label className="block text-sm font-semibold text-navy">Alt metin<input className={inputClassName} name="altText" minLength={8} maxLength={500} required /></label>
      <label className="block text-sm font-semibold text-navy">Görünür açıklama<input className={inputClassName} name="caption" minLength={8} maxLength={1000} required /></label>
      <label className="block text-sm font-semibold text-navy">Bağlam<textarea className={inputClassName} name="context" rows={3} minLength={12} required /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-navy">Hak sahipliği<select className={inputClassName} name="rightsStatus" defaultValue="pending"><option value="pending">Bekliyor</option><option value="verified">Doğrulandı</option><option value="restricted">Kısıtlı</option></select></label>
        <label className="text-sm font-semibold text-navy">Hak kanıt referansı<input className={inputClassName} name="rightsEvidenceReference" /></label>
        <label className="text-sm font-semibold text-navy">Kişi yayın izni<select className={inputClassName} name="permissionStatus" defaultValue="pending"><option value="pending">Bekliyor</option><option value="verified">Doğrulandı</option><option value="not_applicable">Kişi görünmüyor / uygulanamaz</option><option value="restricted">Kısıtlı</option></select></label>
        <label className="text-sm font-semibold text-navy">İzin kanıt referansı<input className={inputClassName} name="permissionEvidenceReference" /></label>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">En fazla 10 MB ve 40 MP. Dosya imzası okunur, EXIF/meta veri atılır, uzun kenar 2400 px ile sınırlandırılır ve WebP/AVIF türevleri üretilir.</p>
      {state.status !== 'idle' ? <FormMessage message={state.message} success={state.status === 'success'} /> : null}
      <button className={primaryButtonClassName} disabled={pending} type="submit">{pending ? 'İşleniyor…' : 'Görseli güvenli biçimde yükle'}</button>
    </form>
  )
}
