import { isDeepStrictEqual } from 'node:util'
import { asc, eq } from 'drizzle-orm'
import type { MySql2Database } from 'drizzle-orm/mysql2'
import type * as schema from '@/db/schema'
import {
  categories,
  credentials,
  editorialReviews,
  pages,
  posts,
  redirects,
  siteSettings,
  teamMembers,
} from '@/db/schema'
import type { Article } from '@/lib/articles'
import type { Phase2MigrationSnapshot } from '@/lib/content/migration-source'
import {
  articleFromDatabaseRow,
  teamMemberFromDatabaseRow,
} from '@/lib/content/repository-mysql'
import { resolveEditorialCredit } from '@/lib/editorial'
import { absoluteUrl, SITE, type PageSeo } from '@/lib/site'
import { articleModifiedIsoDate, buildStructuredData } from '@/lib/structured-data'
import { teamProfilePath, type TeamMember } from '@/lib/team'

type Database = MySql2Database<typeof schema>

function assertEqual(label: string, expected: unknown, actual: unknown) {
  if (isDeepStrictEqual(expected, actual)) return
  throw new Error(
    `${label} eşleşmiyor.\nBeklenen: ${JSON.stringify(expected, null, 2)}\nGerçek: ${JSON.stringify(actual, null, 2)}`,
  )
}

function internalLinks(content: string) {
  return [...content.matchAll(/\]\((\/[^\s)]+)\)/g)].map((match) => match[1])
}

function articleContract(article: Article) {
  const page: PageSeo = {
    path: `/blog/${article.slug}`,
    name: article.title,
    title: article.seoTitle ?? article.title,
    description: article.excerpt,
    schemaType: 'WebPage',
  }
  const credit = resolveEditorialCredit(article.slug)
  return {
    route: page.path,
    canonical: absoluteUrl(page.path),
    title: page.title,
    description: page.description,
    publishedAt: article.isoDate,
    modifiedAt: articleModifiedIsoDate(article),
    internalLinks: internalLinks(article.content),
    structuredData: buildStructuredData({
      page,
      breadcrumbs: [
        { name: 'Anasayfa', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: article.title, path: page.path },
      ],
      article,
      articleAuthor: credit.author,
      articleReviewer: credit.review?.reviewer,
    }),
  }
}

function teamContract(member: TeamMember) {
  const path = teamProfilePath(member)
  const page: PageSeo = {
    path,
    name: member.name,
    title: `${member.name} | Ekip Profili`,
    description: `${member.name} için görev, özgeçmiş, mesleki bilgiler ve içerik kayıtlarını inceleyin.`,
    schemaType: 'ProfilePage',
  }
  return {
    route: path,
    canonical: absoluteUrl(path),
    title: page.title,
    description: page.description,
    structuredData: buildStructuredData({
      page,
      breadcrumbs: [
        { name: 'Anasayfa', path: '/' },
        { name: 'Ekibimiz', path: '/ekibimiz' },
        { name: member.name, path },
      ],
      people: [member],
    }),
  }
}

export async function comparePhase2Database(
  db: Database,
  snapshot: Phase2MigrationSnapshot,
) {
  const [categoryRows, postRows, teamRows, pageRows, settingRows, redirectRows, credentialRows, reviewRows] =
    await Promise.all([
      db.select().from(categories).orderBy(asc(categories.sortOrder)),
      db
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
        .orderBy(asc(posts.sortOrder)),
      db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder)),
      db.select().from(pages).orderBy(asc(pages.sortOrder)),
      db.select().from(siteSettings).orderBy(asc(siteSettings.key)),
      db.select().from(redirects).orderBy(asc(redirects.sortOrder)),
      db.select().from(credentials).orderBy(asc(credentials.id)),
      db.select().from(editorialReviews).orderBy(asc(editorialReviews.id)),
    ])

  const databaseArticles = postRows.map(articleFromDatabaseRow)
  const databaseTeamMembers = teamRows.map(teamMemberFromDatabaseRow)
  const expectedArticles = snapshot.posts.map((post) => {
    const categoryName = snapshot.categories.find((category) => category.id === post.categoryId)?.name
    if (!categoryName) throw new Error(`${post.slug}: snapshot kategori adı bulunamadı.`)
    return articleFromDatabaseRow({
      ...post,
      categoryName,
      createdAt: '',
      updatedAt: '',
    } as typeof postRows[number])
  })
  const expectedTeamMembers = snapshot.teamMembers.map((member) =>
    teamMemberFromDatabaseRow({
      ...member,
      createdAt: '',
      updatedAt: '',
    } as typeof teamRows[number]),
  )

  assertEqual('31 yazının tüm alanları', expectedArticles, databaseArticles)
  assertEqual('8 ekip profilinin tüm alanları', expectedTeamMembers, databaseTeamMembers)
  assertEqual(
    'Yazı route/metadata/canonical/JSON-LD/tarih/iç link sözleşmesi',
    expectedArticles.map(articleContract),
    databaseArticles.map(articleContract),
  )
  assertEqual(
    'Ekip route/metadata/canonical/JSON-LD sözleşmesi',
    expectedTeamMembers.map(teamContract),
    databaseTeamMembers.map(teamContract),
  )
  assertEqual(
    'Kategori kayıtları',
    snapshot.categories.map(({ id, name, slug, description, sortOrder }) => ({
      id,
      name,
      slug,
      description: description ?? null,
      sortOrder: sortOrder ?? 0,
    })),
    categoryRows.map(({ id, name, slug, description, sortOrder }) => ({
      id,
      name,
      slug,
      description,
      sortOrder,
    })),
  )
  assertEqual(
    'Statik sayfa SEO kayıtları',
    snapshot.pages.map(({ id, path, name, title, description, schemaType, sortOrder }) => ({
      id,
      path,
      name,
      title,
      description,
      schemaType: schemaType ?? null,
      sortOrder: sortOrder ?? 0,
    })),
    pageRows.map(({ id, path, name, title, description, schemaType, sortOrder }) => ({
      id,
      path,
      name,
      title,
      description,
      schemaType,
      sortOrder,
    })),
  )
  assertEqual(
    'Site ayarları',
    [...snapshot.siteSettings]
      .sort((a, b) => a.key.localeCompare(b.key))
      .map(({ key, value, description }) => ({ key, value, description: description ?? null })),
    settingRows.map(({ key, value, description }) => ({ key, value, description })),
  )
  assertEqual(
    'Redirect envanteri',
    snapshot.redirects.map(
      ({ id, sourcePath, targetPath, httpCode, active, reason, validationStatus, sortOrder }) => ({
        id,
        sourcePath,
        targetPath,
        httpCode: httpCode ?? 308,
        active: active ?? true,
        reason,
        validationStatus: validationStatus ?? 'pending',
        sortOrder: sortOrder ?? 0,
      }),
    ),
    redirectRows.map(
      ({ id, sourcePath, targetPath, httpCode, active, reason, validationStatus, sortOrder }) => ({
        id,
        sourcePath,
        targetPath,
        httpCode,
        active,
        reason,
        validationStatus,
        sortOrder,
      }),
    ),
  )
  assertEqual('Doğrulanmış kişi kanıt kayıtları', snapshot.credentials.length, credentialRows.length)
  assertEqual('Doğrulanmış uzman inceleme kayıtları', snapshot.editorialReviews.length, reviewRows.length)

  return {
    articles: databaseArticles.length,
    teamMembers: databaseTeamMembers.length,
    pages: pageRows.length,
    redirects: redirectRows.length,
    siteSettings: settingRows.length,
    canonicalHost: SITE.url,
  }
}
