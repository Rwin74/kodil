'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth/auth-client'
import { FormMessage, inputClassName, primaryButtonClassName } from './form-controls'

export function PasswordResetForm({ token }: { token: string }) {
  const [pending, setPending] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password') ?? '')
    const confirmation = String(form.get('confirmation') ?? '')

    if (password !== confirmation) {
      setError('Parolalar eşleşmiyor.')
      setPending(false)
      return
    }

    const result = await authClient.resetPassword({ newPassword: password, token })
    if (result.error) {
      setError('Bağlantı geçersiz veya süresi dolmuş. Yeni bir sıfırlama bağlantısı isteyin.')
      setPending(false)
      return
    }

    setComplete(true)
    setPending(false)
  }

  if (!token) {
    return <FormMessage message="Parola sıfırlama bağlantısı eksik veya geçersiz." />
  }

  if (complete) {
    return (
      <div className="space-y-4">
        <FormMessage success message="Parolanız güncellendi ve önceki oturumlar kapatıldı." />
        <Link className={primaryButtonClassName} href="/yonetim/giris">
          Giriş sayfasına dön
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error ? <FormMessage message={error} /> : null}
      <label className="block text-sm font-medium text-navy">
        Yeni parola
        <input
          className={inputClassName}
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          disabled={pending}
        />
      </label>
      <label className="block text-sm font-medium text-navy">
        Yeni parola tekrar
        <input
          className={inputClassName}
          type="password"
          name="confirmation"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          disabled={pending}
        />
      </label>
      <button className={primaryButtonClassName} type="submit" disabled={pending}>
        {pending ? 'Güncelleniyor…' : 'Parolayı güncelle'}
      </button>
    </form>
  )
}
