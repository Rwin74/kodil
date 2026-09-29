import Link from 'next/link'

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <main className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-lg items-center px-5 py-16">
      <section className="w-full rounded-3xl border border-navy/10 bg-white/90 p-7 shadow-xl shadow-navy/5 backdrop-blur sm:p-9">
        <Link href="/" className="text-sm font-semibold tracking-wide text-orange hover:underline">
          KODİL
        </Link>
        <h1 className="mt-4 font-serif text-3xl font-semibold text-navy">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="mt-7">{children}</div>
        {footer ? <div className="mt-6 border-t border-navy/10 pt-5 text-sm">{footer}</div> : null}
      </section>
    </main>
  )
}
