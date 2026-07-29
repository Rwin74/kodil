'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal } from './motion-primitives'
import { FileText, MessageCircleQuestion, Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { articles } from '@/lib/articles'



const questions = [
  {
    id: 1,
    question: "Çocuğum geç konuşuyor, ne yapmalıyım? Beklemeli miyim?",
    answer: "Geç konuşma ihtmal edilmemesi gereken bir durumdur. 'Bekleyelim geçer' yaklaşımı yerine Kocaeli dil ve konuşma terapisti uzmanlarımız tarafından yapılacak erken bir değerlendirme ile çocuğun dil gelişimi hızla desteklenebilir.",
  },
  {
    id: 2,
    question: "Konuşma terapisine kaç yaşında başlanır?",
    answer: "Dil ve konuşma terapisine her yaşta başlanabilir. Kocaeli'de hizmet veren merkezimizde genellikle 2 yaşından itibaren değerlendirme yapılmaktadır. Erken müdahale, kalıcı sonuçlar almanın en etkili yoludur.",
  },
  {
    id: 3,
    question: "Çocuğum söylenenleri anlıyor ama konuşmuyor, nedeni nedir?",
    answer: "Bu durum, alıcı dil (anlama) gelişiminin iyi, ancak ifade edici dilin (konuşma) zayıf olmasından kaynaklanabilir. Kocaeli dil ve konuşma terapisi seanslarımızda bu alanlar ayrı ayrı değerlendirilerek iletişimi güçlendirecek özel bir yol haritası çizilir.",
  },
  {
    id: 4,
    question: "Kekemelik geçer mi? Terapisi nasıl uygulanır?",
    answer: "Kekemelik, çocuklarda doğru terapi ile çok büyük oranda kontrol altına alınabilir. Kocaeli kekemelik terapisi alan bireylerde akıcılık artarken konuşma kaygısı azalır. Erken yaşta başlanan doğru terapi planı ile günlük yaşama etki en aza indirilir.",
  },
  {
    id: 5,
    question: "Duyu bütünleme bozukluğu belirtileri nelerdir?",
    answer: "Aşırı hareketlilik, sese/dokunmaya hassasiyet, dikkat sorunları ve sakarlıklar başlıca belirtilerdir. Kocaeli ergoterapi merkezimizde uyguladığımız duyu bütünleme terapisi ile bu belirtiler azaltılarak çocuğun okul ve yaşam uyumu artırılır.",
  },
  {
    id: 6,
    question: "Konuşma terapisi oyunla mı yapılır?",
    answer: "Evet, özellikle çocuklarda dil ve konuşma terapisi tamamen oyun temelli uygulanır. Kocaeli'deki merkezimizde çocukların ilgisini çeken, onların dünyasına inen oyunlarla öğrenme süreci çok daha keyifli ve etkili hale getirilir.",
  },
  {
    id: 7,
    question: "Çocuğum bazı harfleri (R, S, K vb.) söyleyemiyor, ne yapmalıyım?",
    answer: "Artikülasyon bozukluğu olarak adlandırılan bu durum, seslerin yanlış veya eksik üretilmesidir. Kocaeli dil terapisti uzmanlarımızın uyguladığı bireysel terapi programlarıyla anlaşılamayan konuşma becerisi hızla düzeltilir.",
  },
  {
    id: 8,
    question: "Terapi seansları ne kadar sürer ve ne sıklıkla gelinmelidir?",
    answer: "Süreç tamamen bireyin ihtiyacına ve terapiye verdiği yanıta göre değişir. Kocaeli'deki merkezimizde yapılan ön değerlendirme sonrası genellikle haftada 1 veya 2 seans önerilir. Düzenli takip, kalıcı gelişim sağlamak için kritiktir.",
  },
  {
    id: 9,
    question: "Kocaeli dil ve konuşma terapisi veya ergoterapi randevusu nasıl alınır?",
    answer: "Sitemizdeki iletişim formu, WhatsApp veya telefon numaramız üzerinden bizimle iletişime geçerek ön değerlendirme randevusu oluşturabilirsiniz. Uzman değerlendirmesiyle çocuğunuza en uygun planı hemen hazırlıyoruz.",
  }
]

export function BlogSection() {
  const [activeTab, setActiveTab] = useState<'articles' | 'questions'>('articles')
  const [openQ, setOpenQ] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const articlesPerPage = 6
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil(articles.length / articlesPerPage)

  return (
    <section className="px-4">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <h1 className="font-serif text-3xl font-semibold text-secondary sm:text-5xl lg:text-6xl">
              Bilgi & Kaynaklar
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Uzmanlarımızdan makaleler ve sizden gelen sıkça sorulan sorular.
            </p>
          </div>
        </Reveal>

        {/* Tabs */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setActiveTab('articles')}
            className={cn(
              'group relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors',
              activeTab === 'articles'
                ? 'bg-secondary text-cream'
                : 'bg-secondary/5 text-secondary hover:bg-secondary/10'
            )}
          >
            <FileText className="h-4 w-4" />
            Yazılarımız
            {activeTab === 'articles' && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-full border-2 border-secondary"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={cn(
              'group relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors',
              activeTab === 'questions'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/5 text-secondary hover:bg-secondary/10'
            )}
          >
            <MessageCircleQuestion className="h-4 w-4" />
            Sizden Gelenler
            {activeTab === 'questions' && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-full border-2 border-primary"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Content */}
        <div id="blog-content" className="mt-16 min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'articles' ? (
              <motion.div
                key="articles"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {currentArticles.map((article) => (
                    <Link href={`/blog/${article.slug}`} key={article.id} className="block group">
                      <article className="cursor-pointer h-full rounded-3xl bg-card p-6 ring-1 ring-border transition-all hover:shadow-xl hover:shadow-secondary/5 hover:ring-secondary/20 flex flex-col">
                        <div className="mb-4 flex items-center gap-3 text-xs font-medium text-muted-foreground">
                          <span className="rounded-full bg-secondary/5 px-3 py-1 text-secondary">
                            {article.category}
                          </span>
                          <span>{article.date}</span>
                        </div>
                        <h3 className="mb-3 font-serif text-2xl font-semibold text-secondary transition-colors group-hover:text-primary">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2 flex-grow">
                          {article.excerpt}
                        </p>
                        <div className="mt-6 font-semibold text-primary">
                          Devamını Oku &rarr;
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-wrap justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentPage(idx + 1)
                          document.getElementById('blog-content')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors',
                          currentPage === idx + 1
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/5 text-secondary hover:bg-secondary/10'
                        )}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-3xl space-y-4"
              >
                {questions.map((q, i) => (
                  <Reveal key={q.id} delay={i * 0.1}>
                    <div className="overflow-hidden rounded-3xl bg-card ring-1 ring-border transition-all hover:shadow-md">
                      <button
                        onClick={() => setOpenQ(openQ === q.id ? null : q.id)}
                        className="flex w-full items-center justify-between p-6 text-left"
                      >
                        <span className="font-serif text-lg font-semibold text-secondary pr-4">
                          {q.question}
                        </span>
                        <span className={cn('flex-shrink-0 rounded-full p-2 transition-colors', openQ === q.id ? 'bg-primary text-white' : 'bg-secondary/5 text-secondary')}>
                          {openQ === q.id ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                        </span>
                      </button>
                      <AnimatePresence>
                        {openQ === q.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                          >
                            <div className="border-t border-border p-6 pt-2 text-muted-foreground leading-relaxed">
                              {q.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
