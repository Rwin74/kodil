import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { articles } from '@/lib/articles'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const article = articles.find((a) => a.slug === resolvedParams.slug)
  
  if (!article) {
    return { title: 'Bulunamadı' }
  }

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.keywords,
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: ['KODİL Uzmanları'],
    }
  }
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params
  const article = articles.find((a) => a.slug === resolvedParams.slug)

  if (!article) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date, // In production, this should be ISO 8601 (e.g. 2026-07-15)
    author: {
      '@type': 'Organization',
      name: 'KODİL Uzmanları',
      url: 'https://kocaelidilvekonusma.com/ekibimiz',
    },
    publisher: {
      '@type': 'MedicalClinic',
      name: 'KODİL',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kocaelidilvekonusma.com/images/logo.webp',
      },
    },
  }

  return (
    <main className="min-h-screen bg-background pt-32 lg:pt-40 pb-16 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Blog'a Dön
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground mb-6">
            <span className="rounded-full bg-secondary/5 px-3 py-1 text-secondary">
              {article.category}
            </span>
            <span>{article.date}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-secondary leading-tight">
            {article.title}
          </h1>
        </header>

        <div className="prose prose-lg prose-headings:font-serif prose-headings:text-secondary prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
