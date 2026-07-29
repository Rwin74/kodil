'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Floaty, Magnetic, SplitText, Reveal } from './motion-primitives'

function SpeechBubble({
  children,
  className,
  tone = 'orange',
}: {
  children: React.ReactNode
  className?: string
  tone?: 'orange' | 'turquoise' | 'leaf' | 'cream'
}) {
  const tones: Record<string, string> = {
    orange: 'bg-primary text-primary-foreground',
    turquoise: 'bg-accent text-accent-foreground',
    leaf: 'bg-leaf text-secondary',
    cream: 'bg-card text-secondary ring-1 ring-border',
  }
  return (
    <div
      className={`rounded-[1.4rem] rounded-bl-sm px-4 py-2.5 text-sm font-semibold shadow-[0_18px_40px_-20px_rgba(30,41,90,0.5)] ${tones[tone]} ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 140])
  const yImg2 = useTransform(scrollYProgress, [0, 1], [0, -90])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden px-4 pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-40"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: type */}
        <div className="relative z-10">
          {/* SEO Optimized H1 Tag instead of sr-only */}
          <div className="mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-border bg-white px-7 py-2 shadow-[0_0_1px_rgba(0,0,0,0.1)]">
            <Reveal delay={0.3}>
              <h1 className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-secondary sm:text-sm">
                <Sparkles className="h-4 w-4 text-orange" />
                <span className="font-semibold text-primary">Kocaeli</span>
                <span className="text-border mx-1">•</span>
                Dil ve Konuşma Terapisi Merkezi
              </h1>
            </Reveal>
          </div>

          <Reveal delay={0.4}>
            <h2 className="mt-8 font-serif text-5xl font-semibold leading-[1.1] tracking-tight text-secondary sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              <SplitText text="Anlatabilmek bir" />
              <span className="block mt-2 italic text-primary relative inline-block">
                <SplitText text="yolculuktur." delay={0.2} />
              </span>
            </h2>
          </Reveal>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
            Deneyimli terapistlerimizle; ebeveyn ve çocuk odaklı tasarlanan
            merkezimizde her sesin, her kelimenin ve her ilk cümlenin yanındayız.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
            <Magnetic strength={0.35}>
              <a
                href="/kimlere-yardimci-oluyoruz"
                className="group inline-flex items-center gap-2 rounded-full bg-secondary px-7 py-4 text-base font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90"
              >
                Terapilerimizi Keşfet
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </Magnetic>
            <a
              href="#hikayeler"
              className="text-base font-semibold text-secondary underline decoration-primary decoration-2 underline-offset-8 hover:text-primary"
            >
              Aile hikâyeleri
            </a>
          </div>
        </div>

        {/* Right: layered organic image composition */}
        <div className="relative z-10 h-[20rem] sm:h-[34rem] mt-8 lg:mt-0">
          <motion.div
            style={{ y: yImg, willChange: "transform" }}
            className="absolute right-0 top-0 h-[22rem] w-[78%] overflow-hidden rounded-[40%_60%_58%_42%/48%_42%_58%_52%] shadow-[0_40px_80px_-30px_rgba(30,41,90,0.45)] sm:h-[28rem]"
          >
            <Image
              src="/images/kocaeli-dil-ve-konusma-terapisi-merkezi-oyun-odasi.jpeg"
              alt="Kocaeli dil ve konuşma terapisti merkezimizde sıcak ve güvenli bir terapi odası"
              fill
              priority
              sizes="(max-width: 768px) 80vw, 40vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            style={{ y: yImg2, willChange: "transform" }}
            className="absolute bottom-0 left-0 h-32 w-40 overflow-hidden rounded-[58%_42%_45%_55%/55%_50%_50%_45%] shadow-[0_30px_60px_-25px_rgba(30,41,90,0.5)] ring-4 ring-background sm:h-56 sm:w-64"
          >
            <Image
              src="/images/kocaeli-cocuk-dil-terapisti-seansi.jpeg"
              alt="Kocaeli dil terapisi seansında çocuklarla ebeveyn odaklı yaklaşım"
              fill
              priority
              sizes="(max-width: 768px) 160px, 256px"
              className="object-cover"
            />
          </motion.div>

          {/* floating speech bubbles */}
          <Floaty amplitude={12} duration={5} className="absolute -left-2 top-6 sm:left-4">
            <SpeechBubble tone="orange">İletişim</SpeechBubble>
          </Floaty>
          <Floaty amplitude={14} duration={6.5} delay={0.6} className="absolute right-2 top-1/2">
            <SpeechBubble tone="turquoise">Bağ</SpeechBubble>
          </Floaty>
          <Floaty amplitude={10} duration={5.8} delay={1.1} className="absolute bottom-8 right-8">
            <SpeechBubble tone="cream">Şevkat</SpeechBubble>
          </Floaty>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.a
        href="#kimlere"
        style={{ opacity: fade }}
        className="mx-auto mt-16 flex w-fit flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
      >
        Kaydır
        <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-muted-foreground/40 p-1">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
            className="h-1.5 w-1.5 rounded-full bg-primary"
          />
        </span>
      </motion.a>
    </section>
  )
}
