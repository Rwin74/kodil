import Image from 'next/image'
import Link from 'next/link'
import { teamMembers } from '@/lib/team'

export function Experts() {
  return (
    <section id="ekip" className="relative px-4 py-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Ekibimiz
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-secondary sm:text-5xl lg:text-6xl">
              Güvendiğiniz <span className="block italic text-primary">ellerdesiniz</span>
            </h2>
          </div>
          <p className="max-w-sm text-lg leading-relaxed text-muted-foreground lg:ml-auto">
            Ekip üyelerimizi görevleri ve ayrı kişi profilleriyle tanıyın. Eğitim
            ve uzmanlık bilgileri yalnızca kaynağı doğrulandığında yayınlanır.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.slug}
              id={member.slug}
              className="group relative overflow-hidden rounded-3xl bg-card ring-1 ring-border"
            >
              <Link
                href={`/ekibimiz/${member.slug}`}
                aria-label={`${member.name} profilini görüntüle`}
                className="block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/10 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-cream/95 px-3 py-1.5 md:bg-cream/85 md:backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full" style={{ background: member.accent }} />
                    <span className="text-sm font-semibold text-secondary">Ekip profili</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-serif text-2xl font-semibold text-cream">{member.name}</h3>
                    <p className="text-sm font-medium text-cream/80">{member.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-cream/75">{member.profileText}</p>
                    <p className="mt-3 text-sm font-semibold text-cream underline decoration-primary decoration-2 underline-offset-4">
                      Profili görüntüle
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
