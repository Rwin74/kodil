'use client'

import { useActionState } from 'react'
import { saveSiteSettingsAction } from '@/app/yonetim/(panel)/actions'
import { INITIAL_ADMIN_ACTION_STATE } from '@/lib/admin/action-state'
import { FormMessage, inputClassName, primaryButtonClassName } from '@/components/admin/form-controls'

type SiteValue = { phone: string; phoneDisplay: string; email: string; address: { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string }; openingHours: { opens: string; closes: string }[] }

export function SiteSettingsForm({ value }: { value: SiteValue }) {
  const [state, action, pending] = useActionState(saveSiteSettingsAction, INITIAL_ADMIN_ACTION_STATE)
  return <form action={action} className="space-y-6">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-semibold text-navy">Telefon (makine biçimi)<input className={inputClassName} name="phone" defaultValue={value.phone} required /></label>
      <label className="text-sm font-semibold text-navy">Telefon (görünür)<input className={inputClassName} name="phoneDisplay" defaultValue={value.phoneDisplay} required /></label>
      <label className="text-sm font-semibold text-navy sm:col-span-2">E-posta<input className={inputClassName} type="email" name="email" defaultValue={value.email} required /></label>
      <label className="text-sm font-semibold text-navy sm:col-span-2">Açık adres<input className={inputClassName} name="streetAddress" defaultValue={value.address.streetAddress} required /></label>
      <label className="text-sm font-semibold text-navy">İlçe<input className={inputClassName} name="addressLocality" defaultValue={value.address.addressLocality} required /></label>
      <label className="text-sm font-semibold text-navy">İl<input className={inputClassName} name="addressRegion" defaultValue={value.address.addressRegion} required /></label>
      <label className="text-sm font-semibold text-navy">Posta kodu<input className={inputClassName} name="postalCode" defaultValue={value.address.postalCode} required /></label>
    </div>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-semibold text-navy">Hafta içi açılış<input className={inputClassName} type="time" name="weekdayOpens" defaultValue={value.openingHours[0]?.opens} required /></label>
      <label className="text-sm font-semibold text-navy">Hafta içi kapanış<input className={inputClassName} type="time" name="weekdayCloses" defaultValue={value.openingHours[0]?.closes} required /></label>
      <label className="text-sm font-semibold text-navy">Hafta sonu açılış<input className={inputClassName} type="time" name="weekendOpens" defaultValue={value.openingHours[1]?.opens} required /></label>
      <label className="text-sm font-semibold text-navy">Hafta sonu kapanış<input className={inputClassName} type="time" name="weekendCloses" defaultValue={value.openingHours[1]?.closes} required /></label>
    </div>
    <p className="text-xs leading-5 text-muted-foreground">Bu ekran yalnız kamusal iletişim ve çalışma saatlerini düzenler; secret, hasta verisi veya pazarlama izni saklamaz.</p>
    {state.status !== 'idle' ? <FormMessage message={state.message} success={state.status === 'success'} /> : null}
    <button className={primaryButtonClassName} disabled={pending} type="submit">{pending ? 'Kaydediliyor…' : 'Ayarları kaydet'}</button>
  </form>
}
