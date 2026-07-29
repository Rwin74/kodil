'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Reveal, SplitText } from './motion-primitives'

const rows = [
  {
    id: '01',
    title: 'Ergoterapi',
    desc: 'Gelişim odaklı özel tasarlanan merkezimizde tecrübeli terapistlerimiz ile süreci birlikte yönetin.',
    tone: 'var(--orange)',
    href: '/blog/kocaeli-ergoterapi',
  },
  {
    id: '02',
    title: 'Psikoterapi',
    desc: 'Tecrübeli psikoloğumuz birebir danışmanlık hizmeti ile sizin yanınızda.',
    tone: 'var(--turquoise)',
    href: '/blog/psikoterapi-yontemleri-ve-uygulama-asamalari-nedir',
  },
  {
    id: '03',
    title: 'Dil ve Konuşma Terapisi',
    desc: 'Terapi alanlarına göre özelleşmiş terapistlerimiz ile güçlüklerinizi beraber aşalım.',
    tone: 'var(--leaf)',
    href: '/blog/kocaeli-dil-ve-konusma-terapisti-neden-erken-mudahale',
  },
  {
    id: '04',
    title: 'ICDL Floortime',
    desc: 'Floortime terapisi, çocukların duygusal, sosyal ve iletişim becerilerini geliştirmeyi amaçlayan, oyun temelli ve ilişki odaklı bir yaklaşımdır.',
    tone: 'var(--orange)',
    href: '/blog/etkilesim-temelli-uygulamalar',
  },
  {
    id: '05',
    title: 'Prompt Tekniği',
    desc: 'Konuşma terapisinde prompt tekniği, bireyin doğru sesi, kelimeyi ya da cümleyi üretmesini desteklemek için terapist tarafından verilen ipuçları (yardımlar) bütünüdür.',
    tone: 'var(--turquoise)',
    href: '/blog/apraksi-nedir-belirtileri-ve-tedavisi',
  },
  {
    id: '06',
    title: 'Oyun Terapisi',
    desc: 'Oyun terapisi, çocukların duygularını, düşüncelerini ve yaşadıkları sorunları oyun yoluyla ifade etmelerini sağlayan terapötik bir yaklaşımdır.',
    tone: 'var(--leaf)',
    href: '/blog/psikoterapi-yontemleri-ve-uygulama-asamalari-nedir',
  },
]

export function WhoWeHelp() {
  const [active, setActive] = useState<string | null>('01')

  return (
    <section id="kimlere" className="relative px-4 py-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Uyguladığımız Terapiler
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-secondary sm:text-5xl">
              <SplitText text="Birlikte aşacağımız" />
              <span className="block italic text-primary">
                <SplitText text="her zorluğa yer var" delay={0.15} />
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground lg:ml-auto">
              Kocaeli dil ve konuşma terapisti arayışınızda; merkezimizde uzman ekibimizle ihtiyacınıza en uygun kanıta dayalı yöntemleri kullanarak bilimsel ve sıcak bir yol haritası çiziyoruz.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 divide-y divide-border border-y border-border">
          {rows.map((row) => {
            const open = active === row.id
            return (
              <div key={row.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(row.id)}
                  onClick={() => setActive(open ? null : row.id)}
                  className="group flex w-full items-center gap-5 py-6 text-left sm:gap-8 sm:py-8"
                >
                  <span className="font-mono text-sm text-muted-foreground">{row.id}</span>
                  <span
                    className="h-3 w-3 flex-none rounded-full transition-transform duration-500 group-hover:scale-150"
                    style={{ background: row.tone }}
                  />
                  <span
                    className="flex-1 font-serif text-xl font-medium text-secondary transition-colors group-hover:text-primary sm:text-4xl"
                    dangerouslySetInnerHTML={{ __html: row.title }}
                  />
                  <span
                    className={`grid h-10 w-10 flex-none place-items-center rounded-full border border-border text-secondary transition-all duration-500 ${
                      open ? 'rotate-45 bg-secondary text-secondary-foreground' : ''
                    }`}
                  >
                    <Plus className="h-5 w-5" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="max-w-xl pb-8 pl-14 sm:pl-[4.5rem]">
                        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                          {row.desc}
                        </p>
                        <a 
                          href={row.href} 
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          Daha Fazla Öğren <span className="text-lg">→</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
