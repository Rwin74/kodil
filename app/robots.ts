import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/private/' },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: '/private/' },
      { userAgent: 'Google-Extended', allow: '/', disallow: '/private/' },
    ],
    sitemap: 'https://kocaelidilvekonusma.com/sitemap.xml',
  }
}
