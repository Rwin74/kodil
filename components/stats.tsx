const stats = [
  { value: 31, label: 'Yayınlanmış bilgilendirici içerik' },
  { value: 8, label: 'Ayrı ekip profili' },
]

export function Stats() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-xl">
          <h2 className="font-serif text-3xl leading-tight tracking-tight text-secondary text-balance md:text-5xl">
            Güven, zamanla ve emekle inşa edilir.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12">
          {stats.map((stat, index) => (
            <div key={stat.label} className="border-t-2 border-primary pt-5">
              <div className="font-serif text-5xl leading-none tracking-tight text-secondary md:text-6xl">
                <span data-stat-key={index === 0 ? 'articles' : 'team'} data-stat-value={stat.value}>
                  {stat.value}
                </span>
              </div>
              <p className="mt-3 text-sm leading-snug text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
