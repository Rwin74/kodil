'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Counter, Reveal, SplitText } from './motion-primitives'

const experts = [
  {
    name: 'Nergis DENİZCİ CEYLAN',
    role: 'Kurucu - Dil ve Konuşma Terapisti',
    image: '/images/team/nergis-denizci-ceylan-dil-ve-konusma-terapisti.webp',
    years: 8,
    tags: ['Dil Terapisi', 'Erken Müdahale'],
    accent: 'var(--orange)',
  },
  {
    name: 'Enes CEYLAN',
    role: 'Uzm. Dil ve Konuşma Terapisti',
    image: '/images/team/enes-ceylan-uzman-dil-ve-konusma-terapisti.webp',
    years: 6,
    tags: ['Kekemelik', 'Artikülasyon Bozuklukları'],
    accent: 'var(--navy)',
  },
  {
    name: 'Nurşah YARDIMCI',
    role: 'Uzm. Dil ve Konuşma Terapisti',
    image: '/images/team/nursah-yardimci-uzman-dil-ve-konusma-terapisti.webp',
    years: 5,
    tags: ['Konuşma Gecikmesi', 'Ses Terapisi'],
    accent: 'var(--turquoise)',
  },
  {
    name: 'Buğra CEYLAN',
    role: 'Dil ve Konuşma Terapisti',
    image: '/images/team/bugra-ceylan-dil-ve-konusma-terapisti.webp',
    years: 4,
    tags: ['Floortime 201 Terapisi', 'Artikülasyon Terapisi'],
    accent: 'var(--navy)',
  },
  {
    name: 'Rüveyda DABAK',
    role: 'Ergoterapist',
    image: '/images/team/ruveyda-dabak-ergoterapist.webp',
    years: 4,
    tags: ['Duyu Bütünleme', 'İnce Motor Beceriler'],
    accent: 'var(--leaf)',
  },
  {
    name: 'Gökşen KARATAŞ',
    role: 'Psikolog',
    image: '/images/team/goksen-karatas-psikolog.webp',
    years: 3,
    tags: ['Floortime 202 Terapisi', 'Deneyimsel Oyun Terapisi'],
    accent: 'var(--orange)',
  },
  {
    name: 'Ahsen Sultan KAYNAK',
    role: 'Psikolog',
    image: '/images/team/ahsen-sultan-kaynak-psikolog.webp',
    years: 5,
    tags: ['Çocuk Psikolojisi', 'Oyun Terapisi'],
    accent: 'var(--orange)',
  },
  {
    name: 'Nilgün GÖRÜM',
    role: 'Asistan',
    image: '/images/team/nilgun-gorum-asistan.webp',
    years: 10,
    tags: ['Hasta İlişkileri', 'Randevu Koordinasyonu'],
    accent: 'var(--turquoise)',
  },
]

export function Experts() {
  return (
    <section id="ekip" className="relative px-4 py-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Ekibimiz
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-secondary sm:text-5xl lg:text-6xl">
              <SplitText text="Güvendiğiniz" />
              <span className="block italic text-primary">
                <SplitText text="ellerdesiniz" delay={0.15} />
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-lg leading-relaxed text-muted-foreground lg:ml-auto">
              Her biri alanında uzmanlaşmış, çocuklarla çalışmayı gerçekten seven
              bir ekip. Sadece terapist değil, ailenin bir parçasıyız.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {experts.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.1}>
              <motion.article
                whileHover="hover"
                className="group relative overflow-hidden rounded-3xl bg-card ring-1 ring-border"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={e.image || '/placeholder.svg'}
                    alt={`${e.name}, ${e.role}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/10 to-transparent" />

                  {/* experience badge */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-cream/95 px-3 py-1.5 md:bg-cream/85 md:backdrop-blur-sm">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: e.accent }}
                    />
                    <span className="text-sm font-semibold text-secondary">
                      <Counter to={e.years} suffix="+ yıl" />
                    </span>
                  </div>

                  {/* info */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-serif text-2xl font-semibold text-cream">
                      {e.name}
                    </h3>
                    <p className="text-sm font-medium text-cream/80">{e.role}</p>
                    <motion.div
                      variants={{
                        hover: { height: 'auto', opacity: 1, marginTop: 12 },
                      }}
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="flex flex-wrap gap-2 overflow-hidden"
                    >
                      {e.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-cream/15 px-3 py-1 text-xs font-medium text-cream ring-1 ring-cream/20"
                        >
                          {t}
                        </span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
