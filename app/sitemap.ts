import { MetadataRoute } from 'next'
import { articles } from '@/lib/articles'
import { teamMembers } from '@/lib/team'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kocaelidilvekonusma.com'

  const staticRoutes = [
    '',
    '/kocaeli-dil-ve-konusma-terapisi',
    '/kimlere-yardimci-oluyoruz',
    '/terapi-yolculugu',
    '/ekibimiz',
    '/hakkimizda',
    '/basari-hikayeleri',
    '/blog',
    '/iletisim',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
  }))

  const dynamicRoutes = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.modifiedIsoDate ?? article.isoDate),
  }))

  const teamRoutes = teamMembers.map((member) => ({
    url: `${baseUrl}/ekibimiz/${member.slug}`,
  }))

  return [...staticRoutes, ...dynamicRoutes, ...teamRoutes]
}
