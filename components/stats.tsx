"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, animate } from "framer-motion"
import { Reveal } from "@/components/motion-primitives"

const stats = [
  { value: 1200, suffix: "+", label: "Tamamlanan terapi seansı" },
  { value: 350, suffix: "+", label: "Eşlik ettiğimiz aile" },
  { value: 8, suffix: "", label: "Uzman terapist" },
  { value: 98, suffix: "%", label: "Aile memnuniyeti" },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const unsub = count.on("change", (v) => setDisplay(Math.round(v)))
    return () => unsub()
  }, [count])

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: 1.8, ease: [0.22, 1, 0.36, 1] })
      return controls.stop
    }
  }, [inView, value, count])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-14 max-w-xl">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Rakamlarla KODİL</span>
          <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-secondary text-balance md:text-5xl">
            Güven, zamanla ve emekle inşa edilir.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="border-t-2 border-primary pt-5"
            >
              <div className="font-serif text-5xl leading-none tracking-tight text-secondary md:text-6xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-sm leading-snug text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
