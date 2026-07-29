'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function BackgroundGradients() {
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      // Sadece sayfanın en üstünde (ilk 800px) animasyonu çalıştır
      setIsActive(window.scrollY < 800)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Top Left Turquoise */}
      <motion.div
        animate={isActive ? { y: [-22, 22, -22] } : { y: 0 }}
        transition={isActive ? { duration: 9, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 1 }}
        style={{ willChange: "transform" }}
        className="absolute -left-[20vw] -top-[10vw] h-[60vw] w-[60vw] rounded-full opacity-20 bg-[radial-gradient(circle,var(--color-accent)_0%,transparent_60%)] sm:h-[40vw] sm:w-[40vw] lg:-left-[10vw] lg:-top-[5vw] lg:h-[30vw] lg:w-[30vw]"
      />

      {/* Middle Right Orange/Primary */}
      <motion.div
        animate={isActive ? { y: [-26, 26, -26] } : { y: 0 }}
        transition={isActive ? { duration: 12, delay: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 1 }}
        style={{ willChange: "transform" }}
        className="absolute -right-[30vw] top-[40vh] h-[70vw] w-[70vw] rounded-full opacity-15 bg-[radial-gradient(circle,var(--color-primary)_0%,transparent_60%)] sm:h-[50vw] sm:w-[50vw] lg:-right-[10vw] lg:top-[30vh] lg:h-[40vw] lg:w-[40vw]"
      />

      {/* Bottom Left Leaf/Green */}
      <motion.div
        animate={isActive ? { y: [-18, 18, -18] } : { y: 0 }}
        transition={isActive ? { duration: 10, delay: 1, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 1 }}
        style={{ willChange: "transform" }}
        className="absolute -bottom-[20vh] -left-[20vw] h-[50vw] w-[50vw] rounded-full opacity-20 bg-[radial-gradient(circle,var(--color-leaf)_0%,transparent_60%)] sm:h-[40vw] sm:w-[40vw] lg:-bottom-[10vh] lg:-left-[5vw] lg:h-[35vw] lg:w-[35vw]"
      />
    </div>
  )
}
