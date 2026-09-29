import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { getAdminPost } from '@/lib/admin/content-service'
import { verifyPreviewToken } from '@/lib/admin/preview-token'

export const metadata: Metadata = { title: 'Yazı önizleme', robots: { index: false, follow: false, nocache: true } }
export const dynamic = 'force-dynamic'

export default async function PreviewPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ hash?: string; expires?: string; signature?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  if (!verifyPreviewToken(id, query.hash, query.expires, query.signature)) notFound()
  let data
  try { data = await getAdminPost(id) } catch { notFound() }
  if (data.contentHash !== query.hash) notFound()
  return <main className="min-h-screen bg-background px-4 py-16"><article className="mx-auto max-w-3xl"><div className="mb-8 rounded-xl border border-orange/25 bg-orange/5 p-4 text-sm text-navy"><strong>İmzalı, indekslenmeyen önizleme.</strong> Bu sayfa canlı yayın değildir ve bağlantı en fazla 24 saat geçerlidir.</div><p className="text-sm font-semibold text-orange">{data.categories.find((item) => item.id === data.snapshot.categoryId)?.name ?? 'Kategori'}</p><h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-navy">{data.snapshot.title}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{data.snapshot.excerpt}</p><div className="prose prose-lg mt-10 max-w-none prose-headings:font-serif prose-headings:text-navy prose-p:text-muted-foreground"><ReactMarkdown allowedElements={['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'code', 'pre', 'hr']}>{data.snapshot.content}</ReactMarkdown></div>{data.snapshot.sources.length ? <aside className="mt-12 border-t border-navy/10 pt-8"><h2 className="font-serif text-2xl font-semibold text-navy">Kaynaklar</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm">{data.snapshot.sources.map((source) => <li key={source.url}><a className="text-orange underline" href={source.url} rel="noreferrer" target="_blank">{source.title}</a>{source.publisher ? ` · ${source.publisher}` : ''}</li>)}</ul></aside> : null}</article></main>
}
