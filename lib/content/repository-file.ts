import { articles } from '@/lib/articles'
import { resolveEditorialCredit } from '@/lib/editorial'
import { resolveFileRedirect } from '@/lib/content/legacy-redirects'
import type { ContentRepository } from '@/lib/content/repository'
import { absoluteUrl, PAGES } from '@/lib/site'
import { teamMembers } from '@/lib/team'

export const fileContentRepository: ContentRepository = {
  async listArticles() {
    return articles.map((article) => ({
      ...article,
      canonicalUrl: absoluteUrl(`/blog/${article.slug}`),
      indexable: true,
      editorialCredit: resolveEditorialCredit(article.slug),
    }))
  },
  async getArticleBySlug(slug) {
    const article = articles.find((item) => item.slug === slug)
    return article
      ? {
          ...article,
          canonicalUrl: absoluteUrl(`/blog/${article.slug}`),
          indexable: true,
          editorialCredit: resolveEditorialCredit(article.slug),
        }
      : undefined
  },
  async listTeamMembers() {
    return teamMembers
  },
  async getTeamMemberBySlug(slug) {
    return teamMembers.find((member) => member.slug === slug)
  },
  async listPages() {
    return Object.values(PAGES).map((page) => ({
      ...page,
      canonicalUrl: absoluteUrl(page.path),
      indexable: true,
    }))
  },
  async getRedirectBySourcePath(sourcePath) {
    return resolveFileRedirect(sourcePath)
  },
}
