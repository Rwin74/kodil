import { createHash } from 'node:crypto'
import {
  categories,
  credentials,
  editorialReviews,
  pages,
  posts,
  redirects,
  siteSettings,
  teamMembers as teamMemberRows,
} from '@/db/schema'
import { articles } from '@/lib/articles'
import { storedLegacyRedirectRules } from '@/lib/content/legacy-redirects'
import { editorialCredits } from '@/lib/editorial'
import { organizationProfile } from '@/lib/organization'
import { PAGES, SITE } from '@/lib/site'
import { teamMembers } from '@/lib/team'

export interface Phase2MigrationSnapshot {
  categories: (typeof categories.$inferInsert)[]
  credentials: (typeof credentials.$inferInsert)[]
  editorialReviews: (typeof editorialReviews.$inferInsert)[]
  pages: (typeof pages.$inferInsert)[]
  posts: (typeof posts.$inferInsert)[]
  redirects: (typeof redirects.$inferInsert)[]
  siteSettings: (typeof siteSettings.$inferInsert)[]
  teamMembers: (typeof teamMemberRows.$inferInsert)[]
}

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function teamId(slug: string) {
  return `team:${slug}`
}

function redirectReason(sourcePath: string) {
  if (sourcePath === '/:path+/') return 'Sondaki slash normalizasyonu'
  if (/^\/(?:category|tag|author)(?:\/|$)/.test(sourcePath)) {
    return 'WordPress arşiv URL göçü'
  }
  return 'Doğrulanmış eski URL göçü'
}

export async function buildPhase2MigrationSnapshot(): Promise<Phase2MigrationSnapshot> {
  const categoryNames = [...new Set(articles.map((article) => article.category))]
  const categoryRows = categoryNames.map((name, index) => ({
    id: `category:${hash(name).slice(0, 48)}`,
    name,
    slug: slugify(name),
    description: null,
    sortOrder: index,
  }))
  const categoryIds = new Map(categoryRows.map((category) => [category.name, category.id]))

  const teamRows = teamMembers.map((member, index) => ({
    id: teamId(member.slug),
    slug: member.slug,
    name: member.name,
    role: member.role,
    bio: member.bio ?? member.profileText,
    imagePath: member.image,
    accent: member.accent,
    verifiedEducation: cloneJson([...(member.verifiedEducation ?? [])]),
    verifiedExpertise: cloneJson([...(member.verifiedExpertise ?? [])]),
    verifiedExternalProfiles: cloneJson([...(member.verifiedExternalProfiles ?? [])]),
    status: 'published' as const,
    sortOrder: index,
    featuredMediaId: null,
    contentUpdatedAt: null,
  }))

  const credentialRows: Phase2MigrationSnapshot['credentials'] = []
  for (const member of teamMembers) {
    for (const education of member.verifiedEducation ?? []) {
      const sourceUrlHash = hash(education.sourceUrl)
      credentialRows.push({
        id: `credential:${hash(`${member.slug}:education:${education.sourceUrl}`).slice(0, 48)}`,
        teamMemberId: teamId(member.slug),
        kind: 'education',
        name: education.credential,
        institution: education.institution,
        field: education.field ?? null,
        sourceUrl: education.sourceUrl,
        sourceUrlHash,
        verifiedAt: education.verifiedIsoDate,
        evidenceReference: null,
      })
    }
    for (const expertise of member.verifiedExpertise ?? []) {
      const sourceUrlHash = hash(expertise.sourceUrl)
      credentialRows.push({
        id: `credential:${hash(`${member.slug}:expertise:${expertise.sourceUrl}`).slice(0, 48)}`,
        teamMemberId: teamId(member.slug),
        kind: 'expertise',
        name: expertise.name,
        institution: null,
        field: null,
        sourceUrl: expertise.sourceUrl,
        sourceUrlHash,
        verifiedAt: expertise.verifiedIsoDate,
        evidenceReference: null,
      })
    }
    for (const profile of member.verifiedExternalProfiles ?? []) {
      const sourceUrlHash = hash(profile.url)
      credentialRows.push({
        id: `credential:${hash(`${member.slug}:external:${profile.url}`).slice(0, 48)}`,
        teamMemberId: teamId(member.slug),
        kind: 'external_profile',
        name: profile.label,
        institution: null,
        field: profile.kind,
        sourceUrl: profile.url,
        sourceUrlHash,
        verifiedAt: profile.verifiedIsoDate,
        evidenceReference: profile.verificationReference,
      })
    }
  }

  const postRows = articles.map((article, index) => {
    const categoryId = categoryIds.get(article.category)
    if (!categoryId) throw new Error(`${article.slug}: kategori kimliği üretilemedi.`)
    const credit = editorialCredits[article.slug]

    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      seoTitle: article.seoTitle ?? null,
      excerpt: article.excerpt,
      content: article.content,
      status: 'published' as const,
      publishedAt: article.isoDate,
      publishedLabel: article.date,
      contentUpdatedAt: article.modifiedIsoDate ?? null,
      contentUpdatedLabel: article.modifiedDate ?? null,
      authorId: credit ? teamId(credit.authorship.authorSlug) : null,
      reviewerId: credit?.review ? teamId(credit.review.reviewerSlug) : null,
      reviewedAt: credit?.review?.completedIsoDate ?? null,
      categoryId,
      featuredMediaId: null,
      indexable: true,
      canonicalOverride: null,
      keywords: cloneJson(article.keywords),
      image: article.image ? cloneJson(article.image) : null,
      experience: article.experience ? cloneJson(article.experience) : null,
      sortOrder: index,
    }
  })

  const reviewRows = Object.entries(editorialCredits).flatMap(([articleSlug, credit]) => {
    if (!credit?.review) return []
    const post = articles.find((article) => article.slug === articleSlug)
    if (!post) throw new Error(`${articleSlug}: inceleme kaydı için yazı bulunamadı.`)
    return [
      {
        id: `review:${post.id}`,
        postId: post.id,
        reviewerId: teamId(credit.review.reviewerSlug),
        completedAt: credit.review.completedIsoDate,
        expertiseSourceUrl: credit.review.expertiseSourceUrl,
        evidenceReference: credit.review.evidenceReference,
        status: 'approved' as const,
      },
    ]
  })

  const pageRows = Object.entries(PAGES).map(([key, page], index) => ({
    id: `page:${key}`,
    path: page.path,
    name: page.name,
    title: page.title,
    description: page.description,
    schemaType: page.schemaType,
    content: null,
    status: 'published' as const,
    indexable: true,
    canonicalOverride: null,
    contentUpdatedAt: null,
    sortOrder: index,
  }))

  const redirectRules = storedLegacyRedirectRules()
  const redirectRows = redirectRules.map((rule, index) => ({
    id: `redirect:${hash(`${rule.source}->${rule.destination}`).slice(0, 48)}`,
    sourcePath: rule.source,
    targetPath: rule.destination,
    httpCode: rule.permanent ? 308 : 307,
    active: true,
    reason: redirectReason(rule.source),
    validationStatus: 'valid' as const,
    checkedAt: null,
    sortOrder: index,
  }))

  return {
    categories: categoryRows,
    credentials: credentialRows,
    editorialReviews: reviewRows,
    pages: pageRows,
    posts: postRows,
    redirects: redirectRows,
    siteSettings: [
      {
        key: 'site',
        value: cloneJson(SITE),
        description: 'Kayıpsız göç edilen kamusal kurum ve iletişim ayarları',
        updatedBy: null,
      },
      {
        key: 'organization_profile',
        value: cloneJson(organizationProfile),
        description: 'Doğrulama kapılarıyla birlikte kurumsal profil ayarları',
        updatedBy: null,
      },
      {
        key: 'editorial_credits',
        value: cloneJson(editorialCredits),
        description: 'Doğrulanmış yazarlık ve inceleme kayıtları; tahmini kişi içermez',
        updatedBy: null,
      },
    ],
    teamMembers: teamRows,
  }
}
