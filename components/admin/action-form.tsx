'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { INITIAL_ADMIN_ACTION_STATE, type AdminActionState } from '@/lib/admin/action-state'
import { FormMessage, primaryButtonClassName } from '@/components/admin/form-controls'

type Action = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>

export function AdminActionForm({
  action,
  label,
  children,
  tone = 'primary',
}: {
  action: Action
  label: string
  children?: React.ReactNode
  tone?: 'primary' | 'danger' | 'secondary'
}) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action, INITIAL_ADMIN_ACTION_STATE)
  useEffect(() => {
    if (state.status !== 'success') return
    if (state.redirectTo) router.push(state.redirectTo)
    router.refresh()
  }, [router, state])

  const buttonClass = tone === 'primary'
    ? primaryButtonClassName
    : `inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold transition disabled:opacity-60 ${tone === 'danger' ? 'bg-red-700 text-white hover:bg-red-800' : 'border border-navy/15 bg-white text-navy hover:bg-sand/40'}`

  return (
    <form action={formAction} className="space-y-3">
      {children}
      {state.status !== 'idle' ? <FormMessage message={state.message} success={state.status === 'success'} /> : null}
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? 'İşleniyor…' : label}
      </button>
    </form>
  )
}
