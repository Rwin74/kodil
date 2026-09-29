'use client'

import { useState, type FormEvent } from 'react'
import { authClient } from '@/lib/auth/auth-client'
import { FormMessage, inputClassName, primaryButtonClassName } from './form-controls'

export function PasswordResetRequestForm() {
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)

    const result = await authClient.requestPasswordReset({
      email: String(form.get('email') ?? '').trim(),
      redirectTo: '/yonetim/sifre-sifirla',
    })

    if (result.error) {
      setError(
        result.error.status === 429
          ? 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.'
          : 'İstek işlenemedi. Lütfen daha sonra yeniden deneyin.',
      )
      setPending(false)
      return
    }

    setSent(true)
    setPending(false)
  }

  if (sent) {
    return (
      <FormMessage
        success
        message="Hesap mevcutsa parola sıfırlama bağlantısı kayıtlı e-posta adresine gönderildi."
      />
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error ? <FormMessage message={error} /> : null}
      <label className="block text-sm font-medium text-navy">
        E-posta
        <input
          className={inputClassName}
          type="email"
          name="email"
          autoComplete="email"
          required
          disabled={pending}
        />
      </label>
      <button className={primaryButtonClassName} type="submit" disabled={pending}>
        {pending ? 'Gönderiliyor…' : 'Sıfırlama bağlantısı gönder'}
      </button>
    </form>
  )
}
