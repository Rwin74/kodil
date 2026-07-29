'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import { Ear, MessageCircleHeart, Puzzle, Hand, Baby } from 'lucide-react'
import { Reveal, SplitText } from './motion-primitives'

const steps = [
  {
    icon: MessageCircleHeart,
    tag: 'Dil ve Konuşma Terapisi',
    title: 'Kelimeleri birlikte keşfediyoruz',
    desc: 'Oyun temelli seanslarla telaffuz, kelime dağarcığı ve cümle kurma becerilerini geliştiriyoruz.',
  },
  {
    icon: Hand,
    tag: 'Ergoterapi',
    title: 'Günlük hayatı kolaylaştırıyoruz',
    desc: 'İnce motor, kaba motor ve duyusal bütünleme çalışmalarıyla bağımsızlığı destekliyoruz.',
  },
  {
    icon: Ear,
    tag: 'Ayrıntılı Değerlendirme',
    title: 'Önce dinliyor, sonra planlıyoruz',
    desc: 'Standart testler ve gözlemle güçlü yönleri ve ihtiyaçları netleştirir, hedefleri birlikte belirleriz.',
  },
  {
    icon: Puzzle,
    tag: 'Özel Öğrenme Desteği',
    title: 'Her zihne özel bir yol',
    desc: 'Disleksi ve öğrenme güçlüklerinde bireyselleştirilmiş, adım adım ilerleyen programlar.',
  },
  {
    icon: Baby,
    tag: 'Erken Müdahale',
    title: 'Zamanında atılan küçük adımlar',
    desc: '0-6 yaş döneminde erken destek ile gelişimin en verimli penceresinden yararlanıyoruz.',
  },
]

function Step({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-45% 0px -45% 0px' })
  const Icon = step.icon
  return (
    <div ref={ref} className="relative pl-16 sm:pl-24">
      <motion.span
        className="absolute left-[13px] top-2 grid h-9 w-9 place-items-center rounded-full ring-4 ring-background sm:left-[21px]"
        animate={{
          backgroundColor: inView ? 'var(--orange)' : 'var(--sand)',
          scale: inView ? 1.05 : 1,
        }}
        transition={{ duration: 0.4 }}
      >
        <Icon
          className="h-4 w-4"
          style={{ color: inView ? 'var(--cream)' : 'var(--navy)' }}
        />
      </motion.span>
      <motion.div
        animate={{ opacity: inView ? 1 : 0.4 }}
        transition={{ duration: 0.4 }}
        className="pb-16 sm:pb-24"
      >
        <span className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
          {step.tag}
        </span>
        <h3 className="mt-2 font-serif text-3xl font-medium text-cream sm:text-4xl">
          {step.title}
        </h3>
        <p className="mt-3 max-w-lg text-lg leading-relaxed text-cream/70">
          {step.desc}
        </p>
      </motion.div>
    </div>
  )
}

export function TherapyJourney() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 60%', 'end 60%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="yolculuk" className="relative bg-secondary px-4 py-24 text-secondary-foreground lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Terapi yolculuğu
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-cream sm:text-6xl">
              <SplitText text="Bir yol, beş" />
              <span className="block italic text-primary">
                <SplitText text="anlamlı durak" delay={0.15} />
              </span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream/70">
              Her çocuğun ve her ailenin ritmi farklıdır. Aşağı kaydırdıkça
              yolculuğumuzun her durağı hayat buluyor.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-16">
          {/* connector track */}
          <div className="absolute left-[30px] top-0 h-full w-0.5 bg-cream/15 sm:left-[38px]" />
          <motion.div
            style={{ scaleY }}
            className="absolute left-[30px] top-0 h-full w-0.5 origin-top bg-primary sm:left-[38px]"
          />
          <div className="relative">
            {steps.map((step, i) => (
              <Step key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
