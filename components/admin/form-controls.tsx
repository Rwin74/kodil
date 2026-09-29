'use client'

export const inputClassName =
  'mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-base text-navy shadow-sm outline-none transition focus:border-orange focus:ring-4 focus:ring-orange/10 disabled:cursor-not-allowed disabled:opacity-60'

export const primaryButtonClassName =
  'inline-flex w-full items-center justify-center rounded-xl bg-navy px-4 py-3 font-semibold text-white transition hover:bg-navy/90 focus:outline-none focus:ring-4 focus:ring-navy/20 disabled:cursor-not-allowed disabled:opacity-60'

export function FormMessage({ message, success = false }: { message: string; success?: boolean }) {
  return (
    <p
      role={success ? 'status' : 'alert'}
      className={`rounded-xl px-4 py-3 text-sm ${
        success ? 'bg-leaf/15 text-navy' : 'bg-red-50 text-red-800'
      }`}
    >
      {message}
    </p>
  )
}
