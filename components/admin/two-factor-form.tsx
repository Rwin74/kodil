'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/auth-client'
import { FormMessage, inputClassName, primaryButtonClassName } from './form-controls'

export function TwoFactorForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'totp' | 'backup'>('totp')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const code = String(form.get('code') ?? '').replace(/\s/g, '')

    const result =
      mode === 'totp'
        ? await authClient.twoFactor.verifyTotp({ code, trustDevice: false })
        : await authClient.twoFactor.verifyBackupCode({
            code,
            trustDevice: false,
            disableSession: false,
          })

    if (result.error) {
      setError(
        result.error.status === 429
          ? 'Çok fazla doğrulama denemesi yapıldı. Lütfen daha sonra tekrar deneyin.'
          : 'Kod doğrulanamadı. Kodu kontrol edip yeniden deneyin.',
      )
      setPending(false)
      return
    }

    router.replace('/yonetim')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error ? <FormMessage message={error} /> : null}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-sand/60 p-1" role="group" aria-label="Kod türü">
        <button
          type="button"
          onClick={() => setMode('totp')}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'totp' ? 'bg-white text-navy shadow-sm' : 'text-muted-foreground'}`}
        >
          Uygulama kodu
        </button>
        <button
          type="button"
          onClick={() => setMode('backup')}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'backup' ? 'bg-white text-navy shadow-sm' : 'text-muted-foreground'}`}
        >
          Yedek kod
        </button>
      </div>
      <label className="block text-sm font-medium text-navy">
        {mode === 'totp' ? '6 haneli doğrulama kodu' : 'Tek kullanımlık yedek kod'}
        <input
          className={inputClassName}
          type="text"
          name="code"
          inputMode={mode === 'totp' ? 'numeric' : 'text'}
          autoComplete="one-time-code"
          minLength={mode === 'totp' ? 6 : 8}
          maxLength={32}
          required
          autoFocus
          disabled={pending}
        />
      </label>
      <button className={primaryButtonClassName} type="submit" disabled={pending}>
        {pending ? 'Doğrulanıyor…' : 'Doğrula'}
      </button>
    </form>
  )
}
