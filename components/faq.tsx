"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { Reveal } from "@/components/motion-primitives"

const faqs = [
  {
    q: "Çocuğum geç konuşuyor, ne yapmalıyım? Beklemeli miyim?",
    a: "Geç konuşma ihtmal edilmemesi gereken bir durumdur. 'Bekleyelim geçer' yaklaşımı yerine Kocaeli dil ve konuşma terapisti uzmanlarımız tarafından yapılacak erken bir değerlendirme ile çocuğun dil gelişimi hızla desteklenebilir.",
  },
  {
    q: "Konuşma terapisine kaç yaşında başlanır?",
    a: "Dil ve konuşma terapisine her yaşta başlanabilir. Kocaeli'de hizmet veren merkezimizde genellikle 2 yaşından itibaren değerlendirme yapılmaktadır. Erken müdahale, kalıcı sonuçlar almanın en etkili yoludur.",
  },
  {
    q: "Çocuğum söylenenleri anlıyor ama konuşmuyor, nedeni nedir?",
    a: "Bu durum, alıcı dil (anlama) gelişiminin iyi, ancak ifade edici dilin (konuşma) zayıf olmasından kaynaklanabilir. Kocaeli dil ve konuşma terapisi seanslarımızda bu alanlar ayrı ayrı değerlendirilerek iletişimi güçlendirecek özel bir yol haritası çizilir.",
  },
  {
    q: "Kekemelik geçer mi? Terapisi nasıl uygulanır?",
    a: "Kekemelik, çocuklarda doğru terapi ile çok büyük oranda kontrol altına alınabilir. Kocaeli kekemelik terapisi alan bireylerde akıcılık artarken konuşma kaygısı azalır. Erken yaşta başlanan doğru terapi planı ile günlük yaşama etki en aza indirilir.",
  },
  {
    q: "Duyu bütünleme bozukluğu belirtileri nelerdir?",
    a: "Aşırı hareketlilik, sese/dokunmaya hassasiyet, dikkat sorunları ve sakarlıklar başlıca belirtilerdir. Kocaeli ergoterapi merkezimizde uyguladığımız duyu bütünleme terapisi ile bu belirtiler azaltılarak çocuğun okul ve yaşam uyumu artırılır.",
  },
  {
    q: "Konuşma terapisi oyunla mı yapılır?",
    a: "Evet, özellikle çocuklarda dil ve konuşma terapisi tamamen oyun temelli uygulanır. Kocaeli'deki merkezimizde çocukların ilgisini çeken, onların dünyasına inen oyunlarla öğrenme süreci çok daha keyifli ve etkili hale getirilir.",
  },
  {
    q: "Çocuğum bazı harfleri (R, S, K vb.) söyleyemiyor, ne yapmalıyım?",
    a: "Artikülasyon bozukluğu olarak adlandırılan bu durum, seslerin yanlış veya eksik üretilmesidir. Kocaeli dil terapisti uzmanlarımızın uyguladığı bireysel terapi programlarıyla anlaşılamayan konuşma becerisi hızla düzeltilir.",
  },
  {
    q: "Terapi seansları ne kadar sürer ve ne sıklıkla gelinmelidir?",
    a: "Süreç tamamen bireyin ihtiyacına ve terapiye verdiği yanıta göre değişir. Kocaeli'deki merkezimizde yapılan ön değerlendirme sonrası genellikle haftada 1 veya 2 seans önerilir. Düzenli takip, kalıcı gelişim sağlamak için kritiktir.",
  },
  {
    q: "Kocaeli dil ve konuşma terapisi veya ergoterapi randevusu nasıl alınır?",
    a: "Sitemizdeki iletişim formu, WhatsApp veya telefon numaramız üzerinden bizimle iletişime geçerek ön değerlendirme randevusu oluşturabilirsiniz. Uzman değerlendirmesiyle çocuğunuza en uygun planı hemen hazırlıyoruz.",
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="sss" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="mb-14 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Sık Sorulan Sorular</span>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-secondary text-balance md:text-5xl">
            Merak ettikleriniz için buradayız.
          </h2>
        </Reveal>

        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-xl text-secondary md:text-2xl">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Plus className="h-5 w-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 leading-relaxed text-muted-foreground">{f.a}</p>
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
