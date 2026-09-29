'use client'

import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/auth-client'

export function LogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        await authClient.signOut()
        router.replace('/yonetim/giris')
        router.refresh()
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-navy/15 px-3 py-2 text-sm font-semibold text-navy hover:bg-sand/60 disabled:opacity-60"
    >
      <LogOut aria-hidden="true" className="size-4" />
      {pending ? 'Çıkılıyor…' : 'Çıkış'}
    </button>
  )
}
