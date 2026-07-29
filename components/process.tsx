"use client"

import { motion } from "framer-motion"
import { Search, Map, Sparkles, HeartHandshake } from "lucide-react"
import { Reveal } from "@/components/motion-primitives"

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Dinliyoruz",
    text: "Danışanı ve aileyi tanıyor, gelişim öyküsünü ve ihtiyaçları ayrıntılı bir değerlendirmeyle anlıyoruz.",
  },
  {
    icon: Map,
    step: "02",
    title: "Planlıyoruz",
    text: "Kanıta dayalı yöntemlerle, kişiye özel ve ölçülebilir bir terapi yol haritası oluşturuyoruz.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Uyguluyoruz",
    text: "Oyunla harmanlanmış seanslarda, her adımda güven ve keyif içinde ilerliyoruz.",
  },
  {
    icon: HeartHandshake,
    step: "04",
    title: "Birlikte büyüyoruz",
    text: "Ailelerle düzenli geri bildirim paylaşıyor, kazanımları günlük hayata taşıyoruz.",
  },
]

export function Process() {
  return (
    <section id="surec" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-16 max-w-xl">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Süreç</span>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-secondary text-balance md:text-5xl">
            Anlatabilmek, dört adımlı bir yolculuktur.
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col rounded-[1.75rem] border border-border bg-card p-7 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform group-hover:scale-110">
                  <s.icon className="h-6 w-6" />
                </span>
                <span className="font-serif text-4xl text-border transition-colors group-hover:text-primary/40">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-6 font-serif text-2xl text-secondary">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
