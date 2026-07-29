"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Reveal } from "@/components/motion-primitives"

const milestones = [
  {
    year: "Yaklaşım",
    title: "Ebeveyn ve çocuk odaklı",
    text: "Merkezimiz, her ailenin sürecin bir parçası olduğu bir anlayışla tasarlandı. Terapi odalarımız güvenli, sıcak ve oyunla öğrenmeye açık.",
  },
  {
    year: "Yöntem",
    title: "Kanıta dayalı, oyunla harmanlanmış",
    text: "Güncel bilimsel yöntemleri, çocuğun doğal öğrenme yolu olan oyunla birleştiriyoruz. Her plan kişiye özel, ölçülebilir ve esnek.",
  },
  {
    year: "Ekip",
    title: "Deneyimli, tutkulu terapistler",
    text: "Dil ve konuşma terapistleri, ergoterapistler ve çocuk gelişim uzmanlarından oluşan ekibimiz sürekli eğitimlerle kendini yeniliyor.",
  },
  {
    year: "Söz",
    title: "Anlatabilmek bir haktır",
    text: "Kendini ifade edebilmenin herkesin hakkı olduğuna inanıyoruz. Amacımız her danışanımızın kendi sesini özgürce bulmasına eşlik etmek.",
  },
]

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="kurumsal" className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-20">
          <div>
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Kurumsal</span>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-secondary text-balance md:text-6xl">
                Bizi <span className="italic text-primary">biz</span> yapan değerler.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                KODİL, dil ve konuşma terapisi ile ergoterapiyi bir arada sunan, çocuk ve ebeveyn odaklı bir gelişim
                merkezidir. Kocaeli&apos;nin kalbinde, sıcak bir yolculuk için buradayız.
              </p>
            </Reveal>

            <div ref={ref} className="relative mt-14 pl-8">
              <div className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-border" aria-hidden />
              <motion.div
                className="absolute left-[5px] top-2 w-px origin-top bg-primary"
                style={{ scaleY, height: "calc(100% - 1rem)" }}
                aria-hidden
              />

              <div className="flex flex-col gap-12">
                {milestones.map((m) => (
                  <Reveal key={m.title}>
                    <div className="relative">
                      <span
                        className="absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background"
                        aria-hidden
                      />
                      <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary">{m.year}</span>
                      <h3 className="mt-2 font-serif text-2xl text-secondary">{m.title}</h3>
                      <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">{m.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <Reveal className="relative">
            <div className="sticky top-24">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] rounded-tr-[6rem]">
                <Image
                  src="/images/play-nook.webp"
                  alt="KODİL merkezinde sıcak bir oyun ve dinlenme köşesi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 flex items-center gap-4 rounded-2xl bg-secondary px-6 py-4 text-secondary-foreground shadow-xl">
                <span className="font-serif text-4xl text-primary">Kocaeli</span>
                <span className="max-w-[7rem] text-xs leading-tight text-secondary-foreground/70">
                  merkezinde, kolay ulaşılabilir konumda
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
