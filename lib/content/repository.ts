import type { Article } from '@/lib/articles'
import type { ResolvedEditorialCredit } from '@/lib/editorial'
import type { PageSeo } from '@/lib/site'
import type { TeamMember } from '@/lib/team'

export interface PublicArticle extends Article {
  canonicalUrl: string
  indexable: boolean
  editorialCredit: ResolvedEditorialCredit
}

export interface PublicTeamMember extends TeamMember {
  contentUpdatedIsoDate?: string
}

export interface PublicPage extends PageSeo {
  canonicalUrl: string
  contentUpdatedIsoDate?: string
  indexable: boolean
}

export interface PublicRedirect {
  sourcePath: string
  targetPath: string
  httpCode: 307 | 308
}

export interface ContentRepository {
  listArticles(): Promise<readonly PublicArticle[]>
  getArticleBySlug(slug: string): Promise<PublicArticle | undefined>
  listTeamMembers(): Promise<readonly PublicTeamMember[]>
  getTeamMemberBySlug(slug: string): Promise<PublicTeamMember | undefined>
  listPages(): Promise<readonly PublicPage[]>
  getRedirectBySourcePath(sourcePath: string): Promise<PublicRedirect | undefined>
}

let repositoryPromise: Promise<ContentRepository> | undefined

export function getContentRepository(): Promise<ContentRepository> {
  if (repositoryPromise) return repositoryPromise

  const source = process.env.CONTENT_SOURCE?.trim() || 'file'
  if (source === 'file') {
    repositoryPromise = import('@/lib/content/repository-file').then(
      ({ fileContentRepository }) => fileContentRepository,
    )
    return repositoryPromise
  }
  if (source === 'mysql') {
    repositoryPromise = import('@/lib/content/repository-mysql').then(
      ({ mysqlContentRepository }) => mysqlContentRepository,
    )
    return repositoryPromise
  }

  throw new Error(`Desteklenmeyen CONTENT_SOURCE değeri: ${source}`)
}
