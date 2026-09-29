'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/auth-client'
import { FormMessage, inputClassName, primaryButtonClassName } from './form-controls'

export function LoginForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')

    const form = new FormData(event.currentTarget)
    const result = await authClient.signIn.email({
      email: String(form.get('email') ?? '').trim(),
      password: String(form.get('password') ?? ''),
      rememberMe: false,
      callbackURL: '/yonetim',
    })

    if (result.error) {
      setError(
        result.error.status === 429
          ? 'Çok fazla giriş denemesi yapıldı. Lütfen birkaç dakika bekleyin.'
          : 'E-posta veya parola doğrulanamadı.',
      )
      setPending(false)
      return
    }

    const requiresTwoFactor =
      'twoFactorRedirect' in result.data && result.data.twoFactorRedirect === true
    router.replace(requiresTwoFactor ? '/yonetim/iki-adimli-dogrulama' : '/yonetim')
    router.refresh()
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
          autoComplete="username"
          required
          disabled={pending}
        />
      </label>
      <label className="block text-sm font-medium text-navy">
        Parola
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
        {pending ? 'Doğrulanıyor…' : 'Giriş yap'}
      </button>
      <div className="text-center text-sm">
        <Link href="/yonetim/sifremi-unuttum" className="text-navy underline-offset-4 hover:underline">
          Parolamı unuttum
        </Link>
      </div>
    </form>
  )
}
