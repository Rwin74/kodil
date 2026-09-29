import 'server-only'

import { unstable_cache } from 'next/cache'
import { getContentRepository } from '@/lib/content/repository'

export const PUBLIC_CONTENT_TAGS = {
  articles: 'public:articles',
  team: 'public:team',
  pages: 'public:pages',
} as const

const contentSourceCacheKey = process.env.CONTENT_SOURCE?.trim() || 'file'

const cachedArticles = unstable_cache(
  async () => (await getContentRepository()).listArticles(),
  ['public-articles-v1', contentSourceCacheKey],
  { tags: [PUBLIC_CONTENT_TAGS.articles] },
)

const cachedTeamMembers = unstable_cache(
  async () => (await getContentRepository()).listTeamMembers(),
  ['public-team-members-v1', contentSourceCacheKey],
  { tags: [PUBLIC_CONTENT_TAGS.team] },
)

const cachedPages = unstable_cache(
  async () => (await getContentRepository()).listPages(),
  ['public-pages-v1', contentSourceCacheKey],
  { tags: [PUBLIC_CONTENT_TAGS.pages] },
)

export function getPublicArticles() {
  return cachedArticles()
}

export async function getPublicArticleBySlug(slug: string) {
  return (await cachedArticles()).find((article) => article.slug === slug)
}

export function getPublicTeamMembers() {
  return cachedTeamMembers()
}

export async function getPublicTeamMemberBySlug(slug: string) {
  return (await cachedTeamMembers()).find((member) => member.slug === slug)
}

export function getPublicPages() {
  return cachedPages()
}
