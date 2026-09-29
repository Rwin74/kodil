import { articles, type Article } from '@/lib/articles'
import {
  getTeamMember,
  type TeamMember,
} from '@/lib/team'

export interface AuthorshipRecord {
  authorSlug: string
  confirmedIsoDate: string
  evidenceReference: string
}

export interface ExpertReviewRecord {
  reviewerSlug: string
  completedIsoDate: string
  evidenceReference: string
  expertiseSourceUrl: string
}

export interface EditorialCredit {
  authorship: AuthorshipRecord
  review?: ExpertReviewRecord
}

export interface ResolvedEditorialCredit {
  author?: TeamMember
  review?: {
    reviewer: TeamMember
    completedIsoDate: string
  }
}

/**
 * Doğrulanmış yazarlık ve uzman incelemesi kayıtları bu tabloda tutulur.
 *
 * Bir kişiyi konu başlığına bakarak yazara/inceleyene dönüştürmek yasaktır.
 * Kayıt eklenmeden önce gerçek yazarlık veya inceleme süreci yazılı olarak
 * doğrulanmalı; kanıt referansı ile doğrulama/tamamlama tarihi saklanmalıdır.
 */
export const editorialCredits: Readonly<Partial<Record<string, EditorialCredit>>> = {}

function assertIsoDate(value: string, label: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${label} ISO 8601 (YYYY-MM-DD) biçiminde olmalı.`)
  }
  const parsed = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${label} gerçek bir takvim tarihi olmalı.`)
  }
  if (parsed > new Date()) {
    throw new Error(`${label} gelecekte olamaz.`)
  }
}

function assertEvidence(value: string, label: string) {
  if (value.trim().length < 3 || /(?:example|örnek|lorem|todo|xxx|placeholder)/i.test(value)) {
    throw new Error(`${label} için doğrulama kanıtı referansı gerekli.`)
  }
}

export function resolveEditorialCredit(articleSlug: string): ResolvedEditorialCredit {
  const credit = editorialCredits[articleSlug]
  if (!credit) return {}

  const author = getTeamMember(credit.authorship.authorSlug)
  if (!author) {
    throw new Error(`${articleSlug}: yazarlık kaydı var olmayan kişi profiline bağlı.`)
  }

  assertIsoDate(credit.authorship.confirmedIsoDate, `${articleSlug}: yazarlık doğrulama tarihi`)
  assertEvidence(credit.authorship.evidenceReference, `${articleSlug}: yazarlık`)

  if (!credit.review) return { author }

  const reviewer = getTeamMember(credit.review.reviewerSlug)
  if (!reviewer) {
    throw new Error(`${articleSlug}: inceleme kaydı var olmayan kişi profiline bağlı.`)
  }
  const reviewExpertise = (reviewer.verifiedExpertise ?? []).find(
    (expertise) => expertise.sourceUrl === credit.review?.expertiseSourceUrl,
  )
  if (!reviewExpertise) {
    throw new Error(
      `${articleSlug}: uzman inceleme kaydı ${reviewer.name} profilindeki ilgili doğrulanmış uzmanlık kaynağına bağlanmalı.`,
    )
  }

  assertIsoDate(credit.review.completedIsoDate, `${articleSlug}: inceleme tarihi`)
  assertEvidence(credit.review.evidenceReference, `${articleSlug}: uzman incelemesi`)

  return {
    author,
    review: {
      reviewer,
      completedIsoDate: credit.review.completedIsoDate,
    },
  }
}

const articleSlugs = new Set(articles.map((article) => article.slug))
for (const articleSlug of Object.keys(editorialCredits)) {
  if (!articleSlugs.has(articleSlug)) {
    throw new Error(`${articleSlug}: var olmayan içerik için editoryal kayıt bırakılamaz.`)
  }
  resolveEditorialCredit(articleSlug)
}

export function articlesAuthoredBy(
  personSlug: string,
  articleCatalog: readonly Article[] = articles,
) {
  return articleCatalog.filter(
    (article) => resolveEditorialCredit(article.slug).author?.slug === personSlug,
  )
}

export function articlesReviewedBy(
  personSlug: string,
  articleCatalog: readonly Article[] = articles,
) {
  return articleCatalog.filter(
    (article) => resolveEditorialCredit(article.slug).review?.reviewer.slug === personSlug,
  )
}
