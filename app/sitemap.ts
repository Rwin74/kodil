import { MetadataRoute } from 'next'
import { articles } from '@/lib/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kocaelidilvekonusma.com'

  const staticRoutes = [
    '',
    '/kimlere-yardimci-oluyoruz',
    '/terapi-yolculugu',
    '/ekibimiz',
    '/basari-hikayeleri',
    '/blog',
    '/iletisim',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly' as any,
    priority: route === '' ? 1 : 0.8,
  }))

  const dynamicRoutes = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as any,
    priority: 0.9, // High priority for SEO articles
  }))

  return [...staticRoutes, ...dynamicRoutes]
}
