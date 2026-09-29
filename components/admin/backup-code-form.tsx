'use client'

import { useState, type FormEvent } from 'react'
import { authClient } from '@/lib/auth/auth-client'
import { FormMessage, inputClassName, primaryButtonClassName } from './form-controls'

export function BackupCodeForm() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [codes, setCodes] = useState<string[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    setCodes([])
    const form = new FormData(event.currentTarget)
    const result = await authClient.twoFactor.generateBackupCodes({
      password: String(form.get('password') ?? ''),
    })

    if (result.error || !result.data) {
      setError('Yeni kodlar üretilemedi. Parolanızı kontrol edip yeniden deneyin.')
      setPending(false)
      return
    }

    setCodes(result.data.backupCodes)
    event.currentTarget.reset()
    setPending(false)
  }

  return (
    <div className="space-y-5">
      {error ? <FormMessage message={error} /> : null}
      {codes.length > 0 ? (
        <section className="rounded-2xl border border-orange/30 bg-orange/5 p-4">
          <h2 className="font-semibold text-navy">Yeni yedek kodlar</h2>
          <p className="mt-1 text-sm text-muted-foreground">Önceki yedek kodların tamamı geçersizdir.</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 font-mono text-sm">
            {codes.map((code) => (
              <li key={code} className="rounded-lg bg-white px-3 py-2 text-center">
                {code}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <form onSubmit={submit} className="space-y-4">
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
          {pending ? 'Üretiliyor…' : 'Yedek kodları yenile'}
        </button>
      </form>
    </div>
  )
}
