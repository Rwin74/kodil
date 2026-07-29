'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Magnetic } from './motion-primitives'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Kimlere Yardımcı Oluyoruz', href: '/kimlere-yardimci-oluyoruz' },
  { label: 'Terapi Yolculuğu', href: '/terapi-yolculugu' },
  { label: 'Ekibimiz', href: '/ekibimiz' },
  { label: 'Hikâyeler', href: '/basari-hikayeleri' },
  { label: 'Blog', href: '/blog' },
  { label: 'İletişim', href: '/iletisim' },
]

function Logo() {
  return (
    <Link href="/" className="group flex items-center">
      <Image
        src="/images/son-logo.webp"
        alt="KODİL"
        width={160}
        height={60}
        priority
        className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
      />
    </Link>
  )
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
      >
        <div
          className={cn(
            'mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500',
            scrolled
              ? 'bg-cream/95 shadow-[0_10px_40px_-15px_rgba(30,41,90,0.25)] md:bg-cream/80 md:backdrop-blur-md ring-1 ring-border'
              : 'bg-transparent',
          )}
        >
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-secondary/70 transition-colors hover:bg-secondary/5 hover:text-secondary"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/kocaelidilkonusmamerkezi/"
              target="_blank"
              rel="noreferrer"
              className="flex relative items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-md transition-all hover:scale-110 hover:shadow-[0_8px_24px_-8px_#d946ef] animate-in fade-in zoom-in duration-500"
              aria-label="Instagram'da bizi takip edin"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
              </span>
            </a>
            <Magnetic className="hidden sm:inline-flex" strength={0.3}>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_var(--orange)] transition-transform"
              >
                <Phone className="h-4 w-4" />
                Randevu Al
              </Link>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary/5 text-secondary lg:hidden"
              aria-label="Menüyü aç"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-secondary lg:hidden"
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <Image
                src="/images/son-logo.webp"
                alt="KODİL"
                width={120}
                height={40}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream"
                aria-label="Menüyü kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-6 pt-12">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-cream/10 py-4 font-serif text-2xl text-cream"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/iletisim"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground"
              >
                <Phone className="h-4 w-4" />
                Randevu Al
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
