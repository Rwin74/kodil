"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Reveal } from "@/components/motion-primitives"

const stories = [
  {
    quote:
      "Oğlum iki yıl önce tek kelime kurmakta zorlanıyordu. Bugün bize hikayeler anlatıyor, sorular soruyor. Bu yolculukta yalnız olmadığımızı hissettirdiler.",
    name: "Elif Y.",
    role: "5 yaşında bir çocuğun annesi",
    tag: "Dil ve Konuşma Terapisi",
  },
  {
    quote:
      "Kekemelik yüzünden sınıfta konuşmaktan kaçınan bir öğrenciydim. Buradaki terapistlerim bana sabırla, yargılamadan yaklaştı. Artık sunum yapmayı seviyorum.",
    name: "Mert K.",
    role: "16 yaşında danışan",
    tag: "Akıcılık Terapisi",
  },
  {
    quote:
      "Kızımızın ince motor becerileri ve günlük yaşam aktiviteleri için aldığımız ergoterapi desteği hayatımızı değiştirdi. Kendi başına giyinebiliyor artık.",
    name: "Zeynep & Ahmet D.",
    role: "7 yaşında bir çocuğun ebeveynleri",
    tag: "Ergoterapi",
  },
  {
    quote:
      "İnme sonrası konuşmamı yeniden kazanmak için buraya geldim. Her seans bana umut verdi. Ekibin inancı benim inancım oldu.",
    name: "Hüseyin A.",
    role: "58 yaşında danışan",
    tag: "Afazi Rehabilitasyonu",
  },
]

export function SuccessStories() {
  const [active, setActive] = useState(0)
  const story = stories[active]

  return (
    <section id="hikayeler" className="relative overflow-hidden bg-secondary py-24 text-secondary-foreground md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Gerçek Hikayeler</span>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl">
            Her sesin arkasında{" "}
            <span className="italic text-primary">bir cesaret hikayesi</span> var.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 md:mt-20 md:grid-cols-[1fr_auto] md:gap-16">
          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="mb-6 block font-serif text-6xl leading-none text-primary md:text-7xl">&ldquo;</span>
                <p className="font-serif text-2xl leading-snug text-balance md:text-4xl md:leading-[1.25]">
                  {story.quote}
                </p>
                <footer className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="text-lg font-medium">{story.name}</span>
                  <span className="h-1 w-1 rounded-full bg-primary" aria-hidden />
                  <span className="text-sm text-secondary-foreground/60">{story.role}</span>
                  <span className="rounded-full border border-primary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                    {story.tag}
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 md:flex-col md:justify-center">
            {stories.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setActive(i)}
                aria-label={`${s.name} hikayesini göster`}
                className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-secondary-foreground/20 transition-colors hover:border-primary md:h-14 md:w-14"
              >
                <span
                  className={`font-mono text-sm transition-colors ${
                    i === active ? "text-primary" : "text-secondary-foreground/50 group-hover:text-secondary-foreground"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i === active && (
                  <motion.span
                    layoutId="story-ring"
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
