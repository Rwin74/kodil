'use client'

import Image from 'next/image'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import { authClient } from '@/lib/auth/auth-client'
import { FormMessage, inputClassName, primaryButtonClassName } from './form-controls'

type Enrollment = {
  qrCode: string
  totpUri: string
  backupCodes: string[]
}

export function MfaEnrollmentForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)

  async function startEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)

    const result = await authClient.twoFactor.enable({
      password: String(form.get('password') ?? ''),
      method: 'totp',
      issuer: 'KODİL Yönetim',
    })

    if (result.error || !result.data || result.data.method !== 'totp') {
      setError('Kurulum başlatılamadı. Parolanızı kontrol edip yeniden deneyin.')
      setPending(false)
      return
    }

    const qrCode = await QRCode.toDataURL(result.data.totpURI, {
      width: 240,
      margin: 1,
      errorCorrectionLevel: 'M',
    })

    setEnrollment({
      qrCode,
      totpUri: result.data.totpURI,
      backupCodes: result.data.backupCodes,
    })
    setPending(false)
  }

  async function verifyEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const code = String(form.get('code') ?? '').replace(/\s/g, '')
    const result = await authClient.twoFactor.verifyTotp({ code, trustDevice: false })

    if (result.error) {
      setError('Kod doğrulanamadı. Uygulamanızdaki güncel kodu kullanın.')
      setPending(false)
      return
    }

    const revocation = await authClient.revokeOtherSessions()
    if (revocation.error) {
      setError('MFA etkinleşti ancak eski oturumlar kapatılamadı. Çıkış yapıp yeniden giriş yapın.')
      setPending(false)
      return
    }

    router.replace('/yonetim')
    router.refresh()
  }

  if (!enrollment) {
    return (
      <form onSubmit={startEnrollment} className="space-y-5">
        {error ? <FormMessage message={error} /> : null}
        <label className="block text-sm font-medium text-navy">
          Mevcut parola
          <input
            className={inputClassName}
            type="password"
            name="password"
            autoComplete="current-password"
            minLength={12}
            maxLength={128}
            required
            disabled={pending}
          />
        </label>
        <button className={primaryButtonClassName} type="submit" disabled={pending}>
          {pending ? 'Hazırlanıyor…' : 'Authenticator kurulumunu başlat'}
        </button>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      {error ? <FormMessage message={error} /> : null}
      <div className="rounded-2xl border border-navy/10 bg-white p-4 text-center">
        <Image
          src={enrollment.qrCode}
          alt="KODİL Yönetim TOTP kurulum QR kodu"
          width={240}
          height={240}
          unoptimized
          className="mx-auto"
        />
        <details className="mt-3 text-left text-xs text-muted-foreground">
          <summary className="cursor-pointer font-semibold text-navy">Elle kurulum adresi</summary>
          <code className="mt-2 block break-all rounded-lg bg-sand/60 p-3">{enrollment.totpUri}</code>
        </details>
      </div>

      <section className="rounded-2xl border border-orange/30 bg-orange/5 p-4">
        <h2 className="font-semibold text-navy">Yedek kodları şimdi kaydedin</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Her kod yalnız bir kez kullanılabilir. Parola yöneticinizde çevrimdışı ve güvenli saklayın.
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-2 font-mono text-sm" aria-label="Yedek kodlar">
          {enrollment.backupCodes.map((code) => (
            <li key={code} className="rounded-lg bg-white px-3 py-2 text-center text-navy">
              {code}
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={verifyEnrollment} className="space-y-5">
        <label className="block text-sm font-medium text-navy">
          Uygulamadaki 6 haneli kod
          <input
            className={inputClassName}
            type="text"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            minLength={6}
            maxLength={6}
            required
            autoFocus
            disabled={pending}
          />
        </label>
        <button className={primaryButtonClassName} type="submit" disabled={pending}>
          {pending ? 'Doğrulanıyor…' : 'MFA kurulumunu tamamla'}
        </button>
      </form>
    </div>
  )
}
