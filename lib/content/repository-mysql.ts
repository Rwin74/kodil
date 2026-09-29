import { and, asc, eq, inArray, lte } from 'drizzle-orm'
import { getDatabase } from '@/db/client'
import {
  categories,
  pages,
  posts,
  redirects,
  teamMembers as teamMemberRows,
} from '@/db/schema'
import type { Article } from '@/lib/articles'
import { resolveStoredRedirectRule } from '@/lib/content/legacy-redirects'
import type {
  ContentRepository,
  PublicArticle,
  PublicRedirect,
  PublicTeamMember,
} from '@/lib/content/repository'
import { absoluteUrl, SITE } from '@/lib/site'
import type { TeamMember } from '@/lib/team'

type PostRow = typeof posts.$inferSelect & { categoryName: string }
type TeamMemberRow = typeof teamMemberRows.$inferSelect

export function articleFromDatabaseRow(row: PostRow): Article {
  if (!row.publishedAt || !row.publishedLabel) {
    throw new Error(`${row.slug}: yayınlanmış içerikte yayın tarihi eksik.`)
  }
  if (Boolean(row.contentUpdatedAt) !== Boolean(row.contentUpdatedLabel)) {
    throw new Error(`${row.slug}: görünür ve ISO güncelleme tarihi birlikte bulunmalı.`)
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    ...(row.seoTitle ? { seoTitle: row.seoTitle } : {}),
    excerpt: row.excerpt,
    content: row.content,
    date: row.publishedLabel,
    isoDate: row.publishedAt,
    ...(row.contentUpdatedAt && row.contentUpdatedLabel
      ? {
          modifiedDate: row.contentUpdatedLabel,
          modifiedIsoDate: row.contentUpdatedAt,
        }
      : {}),
    ...(row.image ? { image: row.image } : {}),
    ...(row.experience ? { experience: row.experience } : {}),
    category: row.categoryName,
    keywords: row.keywords,
  }
}

export function teamMemberFromDatabaseRow(row: TeamMemberRow): TeamMember {
  return {
    slug: row.slug,
    name: row.name,
    role: row.role,
    image: row.imagePath,
    bio: row.bio,
    profileText: row.bio,
    accent: row.accent,
    verifiedEducation: row.verifiedEducation,
    verifiedExpertise: row.verifiedExpertise,
    verifiedExternalProfiles: row.verifiedExternalProfiles,
  }
}

function canonicalUrl(row: PostRow) {
  const fallback = absoluteUrl(`/blog/${row.slug}`)
  if (!row.canonicalOverride) return fallback
  const canonical = new URL(row.canonicalOverride)
  if (canonical.protocol !== 'https:' || canonical.origin !== SITE.url || canonical.search || canonical.hash) {
    throw new Error(`${row.slug}: canonical override canlı HTTPS alanında sorgusuz bir URL olmalı.`)
  }
  return canonical.toString()
}

async function publicArticles() {
  const today = new Date().toISOString().slice(0, 10)
  const [rows, memberRows] = await Promise.all([
    getDatabase()
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        seoTitle: posts.seoTitle,
        excerpt: posts.excerpt,
        content: posts.content,
        status: posts.status,
        publishedAt: posts.publishedAt,
        publishedLabel: posts.publishedLabel,
        scheduledAt: posts.scheduledAt,
        contentUpdatedAt: posts.contentUpdatedAt,
        contentUpdatedLabel: posts.contentUpdatedLabel,
        authorId: posts.authorId,
        reviewerId: posts.reviewerId,
        reviewedAt: posts.reviewedAt,
        categoryId: posts.categoryId,
        featuredMediaId: posts.featuredMediaId,
        indexable: posts.indexable,
        canonicalOverride: posts.canonicalOverride,
        keywords: posts.keywords,
        image: posts.image,
        experience: posts.experience,
        sortOrder: posts.sortOrder,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        categoryName: categories.name,
      })
      .from(posts)
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(and(eq(posts.status, 'published'), lte(posts.publishedAt, today)))
      .orderBy(asc(posts.sortOrder)),
    getDatabase()
      .select()
      .from(teamMemberRows)
      .where(eq(teamMemberRows.status, 'published'))
      .orderBy(asc(teamMemberRows.sortOrder)),
  ])
  const membersById = new Map(
    memberRows.map((row) => [row.id, teamMemberFromDatabaseRow(row)]),
  )

  return rows.map((row): PublicArticle => {
    const author = row.authorId ? membersById.get(row.authorId) : undefined
    const reviewer = row.reviewerId ? membersById.get(row.reviewerId) : undefined
    return {
      ...articleFromDatabaseRow(row),
      canonicalUrl: canonicalUrl(row),
      indexable: row.indexable,
      editorialCredit: {
        ...(author ? { author } : {}),
        ...(reviewer && row.reviewedAt
          ? { review: { reviewer, completedIsoDate: row.reviewedAt } }
          : {}),
      },
    }
  })
}

async function publicTeamMembers(): Promise<PublicTeamMember[]> {
  const rows = await getDatabase()
    .select()
    .from(teamMemberRows)
    .where(eq(teamMemberRows.status, 'published'))
    .orderBy(asc(teamMemberRows.sortOrder))
  return rows.map((row) => ({
    ...teamMemberFromDatabaseRow(row),
    ...(row.contentUpdatedAt ? { contentUpdatedIsoDate: row.contentUpdatedAt } : {}),
  }))
}

async function publicPages() {
  const rows = await getDatabase()
    .select()
    .from(pages)
    .where(eq(pages.status, 'published'))
    .orderBy(asc(pages.sortOrder))
  return rows.map((row) => ({
    path: row.path,
    name: row.name,
    title: row.title,
    description: row.description,
    schemaType: row.schemaType as 'WebPage' | 'CollectionPage' | 'ContactPage' | 'AboutPage' | 'ProfilePage' | undefined,
    canonicalUrl: row.canonicalOverride ?? absoluteUrl(row.path),
    ...(row.contentUpdatedAt ? { contentUpdatedIsoDate: row.contentUpdatedAt } : {}),
    indexable: row.indexable,
  }))
}

function publicRedirect(
  sourcePath: string,
  row: Pick<typeof redirects.$inferSelect, 'sourcePath' | 'targetPath' | 'httpCode'>,
): PublicRedirect | undefined {
  if (row.httpCode !== 307 && row.httpCode !== 308) return undefined
  const targetPath = resolveStoredRedirectRule(
    { source: row.sourcePath, destination: row.targetPath },
    sourcePath,
  )
  if (!targetPath || targetPath === sourcePath) return undefined
  return { sourcePath, targetPath, httpCode: row.httpCode }
}

async function redirectBySourcePath(sourcePath: string) {
  const withoutTrailingSlash =
    sourcePath.length > 1 && sourcePath.endsWith('/') ? sourcePath.slice(0, -1) : sourcePath
  const candidates = [...new Set([sourcePath, withoutTrailingSlash])]
  const exactRows = await getDatabase()
    .select({
      sourcePath: redirects.sourcePath,
      targetPath: redirects.targetPath,
      httpCode: redirects.httpCode,
    })
    .from(redirects)
    .where(
      and(
        eq(redirects.active, true),
        eq(redirects.validationStatus, 'valid'),
        inArray(redirects.sourcePath, candidates),
      ),
    )
    .orderBy(asc(redirects.sortOrder))
  for (const row of exactRows) {
    const resolved = publicRedirect(sourcePath, row)
    if (resolved) return resolved
    if (row.sourcePath === withoutTrailingSlash && row.targetPath !== sourcePath) {
      return { sourcePath, targetPath: row.targetPath, httpCode: row.httpCode as 307 | 308 }
    }
  }

  const mayMatchStoredPattern =
    sourcePath.endsWith('/') || /^\/(?:category|tag|author)(?:\/|$)/.test(sourcePath)
  if (!mayMatchStoredPattern) return undefined

  const patternRows = await getDatabase()
    .select({
      sourcePath: redirects.sourcePath,
      targetPath: redirects.targetPath,
      httpCode: redirects.httpCode,
    })
    .from(redirects)
    .where(and(eq(redirects.active, true), eq(redirects.validationStatus, 'valid')))
    .orderBy(asc(redirects.sortOrder))
  for (const row of patternRows) {
    const resolved = publicRedirect(sourcePath, row)
    if (resolved) return resolved
  }
  return undefined
}

export const mysqlContentRepository: ContentRepository = {
  listArticles: publicArticles,
  async getArticleBySlug(slug) {
    return (await publicArticles()).find((article) => article.slug === slug)
  },
  listTeamMembers: publicTeamMembers,
  async getTeamMemberBySlug(slug) {
    return (await publicTeamMembers()).find((member) => member.slug === slug)
  },
  listPages: publicPages,
  getRedirectBySourcePath: redirectBySourcePath,
}
