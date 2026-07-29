import { Metadata } from 'next'
import { BlogSection } from '@/components/blog'
import { NextStep } from '@/components/next-step'

export const metadata: Metadata = {
  title: 'Blog ve Sizden Gelen Sorular',
  description: 'Dil ve konuşma terapisi, ergoterapi ve çocuk gelişimi hakkında uzman makalelerimiz ve sizden gelen sıkça sorulan soruların cevapları.',
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogPage() {
  return (
    <main>
      <div className="pt-32 lg:pt-40 pb-16">
        <BlogSection />
      </div>
      <NextStep title="Bizimle İletişime Geçin" href="/iletisim" label="Son Adım" />
    </main>
  )
}
