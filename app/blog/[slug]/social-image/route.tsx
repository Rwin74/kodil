import { ImageResponse } from 'next/og'
import { ARTICLE_SOCIAL_IMAGE_SIZE } from '@/lib/articles'
import { getContentRepository } from '@/lib/content/repository'
import { getPublicArticleBySlug, getPublicArticles } from '@/lib/content/public-cache'
import { SITE } from '@/lib/site'

type Context = {
  params: Promise<{ slug: string }>
}

export const revalidate = false

export async function generateStaticParams() {
  const articles = await getPublicArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params
  const article = await getPublicArticleBySlug(slug)

  if (!article) {
    const match = await (await getContentRepository()).getRedirectBySourcePath(`/blog/${slug}`)
    if (match) {
      const target = new URL(`${match.targetPath}/social-image`, SITE.url)
      return Response.redirect(target, match.httpCode)
    }
    return new Response('Bulunamadı', { status: 404 })
  }

  const titleSize = article.title.length > 72 ? 50 : article.title.length > 54 ? 56 : 64

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#f6efe0',
          color: '#1e295a',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              borderRadius: 999,
              background: '#1e295a',
              color: '#f6efe0',
              padding: '12px 24px',
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {article.category}
          </div>
          <div style={{ display: 'flex', color: '#e7763d', fontSize: 38, fontWeight: 800 }}>
            {SITE.shortName}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            maxWidth: 1040,
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-1.5px',
          }}
        >
          {article.title}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid rgba(30, 41, 90, 0.18)',
            paddingTop: 24,
            color: '#586079',
            fontSize: 22,
          }}
        >
          <div style={{ display: 'flex' }}>Bilgi &amp; Kaynaklar</div>
          <div style={{ display: 'flex' }}>kocaelidilvekonusma.com</div>
        </div>
      </div>
    ),
    ARTICLE_SOCIAL_IMAGE_SIZE,
  )
}
