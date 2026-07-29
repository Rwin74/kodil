'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Reveal, Magnetic } from './motion-primitives'

interface NextStepProps {
  title: string
  href: string
  label?: string
}

export function NextStep({ title, href, label = 'Sonraki Adım' }: NextStepProps) {
  return (
    <section className="relative overflow-hidden bg-secondary px-4 py-16 text-center lg:py-32">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          width="800"
          height="800"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {label}
          </p>
          <h2 className="mb-10 font-serif text-3xl font-semibold leading-tight text-cream sm:text-5xl lg:text-6xl">
            {title}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Magnetic strength={0.4}>
            <Link
              href={href}
              className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-cream px-8 py-4 font-semibold text-secondary transition-all hover:scale-105"
            >
              İncelemeye Devam Et
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}
