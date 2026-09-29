import {
  ARTICLE_SOCIAL_IMAGE_SIZE,
  articleImageCaption,
  articleImageContext,
  articleImagePath,
  type Article,
} from '@/lib/articles'
import type { FaqItem } from '@/lib/faq'
import { verifiedOrganizationHistory } from '@/lib/organization'
import { absoluteUrl, type PageSeo, SCHEMA_IDS, SITE } from '@/lib/site'
import { personId, teamProfilePath, type TeamMember } from '@/lib/team'
import { organizationReviewSchemaDecision } from '@/lib/user-feedback'

export interface BreadcrumbItem {
  name: string
  path: string
}

export interface StructuredDataOptions {
  page: PageSeo
  breadcrumbs?: readonly BreadcrumbItem[]
  faqItems?: readonly FaqItem[]
  article?: Article
  people?: readonly TeamMember[]
  articleAuthor?: TeamMember
  articleReviewer?: TeamMember
  includeOpeningHours?: boolean
}

type SchemaNode = Record<string, unknown>

function assertNoReviewMarkup(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(assertNoReviewMarkup)
    return
  }
  if (!value || typeof value !== 'object') return

  const node = value as SchemaNode
  for (const property of [
    'review',
    'aggregateRating',
    'reviewRating',
    'reviewCount',
    'ratingValue',
    'ratingCount',
    'bestRating',
    'worstRating',
  ]) {
    if (property in node) {
      throw new Error(
        'Self-serving Organization/LocalBusiness yorum ve puan işaretlemesi bu sitede yayımlanamaz.',
      )
    }
  }

  const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']]
  if (types.includes('Review') || types.includes('AggregateRating')) {
    throw new Error('Review ve AggregateRating düğümleri mevcut yayın politikası gereği devre dışıdır.')
  }

  Object.values(node).forEach(assertNoReviewMarkup)
}

function ref(id: string) {
  return { '@id': id }
}

function articleImageId(article: Article) {
  return `${absoluteUrl(articleImagePath(article))}#image`
}

export function articleModifiedIsoDate(article: Article) {
  return article.modifiedIsoDate ?? article.isoDate
}

export function pageId(path: string) {
  return `${absoluteUrl(path)}#webpage`
}

export function breadcrumbId(path: string) {
  return `${absoluteUrl(path)}#breadcrumb`
}

export function articleId(article: Article, canonicalUrl = absoluteUrl(`/blog/${article.slug}`)) {
  return `${canonicalUrl}#article`
}

/**
 * Her route için tek bir @graph üretir. Kurum, site, sayfa ve sayfaya özel
 * varlıklar yalnız @id referanslarıyla bağlanır; aynı varlık graph içinde
 * ikinci kez tanımlanmaz.
 */
export function buildStructuredData({
  page,
  breadcrumbs = [],
  faqItems = [],
  article,
  people = [],
  articleAuthor,
  articleReviewer,
  includeOpeningHours = false,
}: StructuredDataOptions) {
  const canonicalUrl = absoluteUrl(page.path)
  const currentPageId = pageId(page.path)
  const currentBreadcrumbId = breadcrumbs.length > 0 ? breadcrumbId(page.path) : undefined
  const currentArticleId = article ? articleId(article, canonicalUrl) : undefined
  const faqId = faqItems.length > 0 ? `${canonicalUrl}#faq` : undefined
  const graphPeople = [...people, articleAuthor, articleReviewer]
    .filter((person): person is TeamMember => Boolean(person))
    .filter(
      (person, index, allPeople) =>
        allPeople.findIndex((candidate) => candidate.slug === person.slug) === index,
    )
  const personRefs = graphPeople.map((person) => ref(personId(person)))

  const logoNode: SchemaNode = {
    '@type': 'ImageObject',
    '@id': SCHEMA_IDS.logo,
    url: absoluteUrl(SITE.logo.path),
    contentUrl: absoluteUrl(SITE.logo.path),
    width: SITE.logo.width,
    height: SITE.logo.height,
  }

  const addressNode: SchemaNode = {
    '@type': 'PostalAddress',
    '@id': SCHEMA_IDS.address,
    ...SITE.address,
  }

  const whatsappNode: SchemaNode = {
    '@type': 'ContactPoint',
    '@id': SCHEMA_IDS.whatsapp,
    name: 'WhatsApp',
    url: SITE.whatsappUrl,
    telephone: SITE.phone,
  }

  const organizationNode: SchemaNode = {
    '@type': 'Organization',
    '@id': SCHEMA_IDS.organization,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    logo: ref(SCHEMA_IDS.logo),
    telephone: SITE.phone,
    email: SITE.email,
    address: ref(SCHEMA_IDS.address),
    contactPoint: ref(SCHEMA_IDS.whatsapp),
    sameAs: SITE.socialProfiles.map((profile) => profile.url),
    ...(verifiedOrganizationHistory.foundingYear
      ? { foundingDate: String(verifiedOrganizationHistory.foundingYear) }
      : {}),
    ...(includeOpeningHours
      ? {
          openingHoursSpecification: SITE.openingHours.map((hours) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: hours.days,
            opens: hours.opens,
            closes: hours.closes,
          })),
        }
      : {}),
    ...(personRefs.length > 0 ? { member: personRefs } : {}),
  }

  if (organizationReviewSchemaDecision.includeReviewMarkup) {
    throw new Error(
      'Organization yorum işaretlemesi ancak yeni bir politika değerlendirmesi ve görünür doğrulanmış veri uygulamasıyla eklenebilir.',
    )
  }

  const websiteNode: SchemaNode = {
    '@type': 'WebSite',
    '@id': SCHEMA_IDS.website,
    url: SITE.url,
    name: SITE.shortName,
    inLanguage: SITE.locale,
    publisher: ref(SCHEMA_IDS.organization),
  }

  const mainEntityRefs = [
    ...(page.path === '/' || page.schemaType === 'ContactPage' || page.schemaType === 'AboutPage'
      ? [ref(SCHEMA_IDS.organization)]
      : []),
    ...(currentArticleId ? [ref(currentArticleId)] : []),
    ...(faqId ? [ref(faqId)] : []),
    ...personRefs,
  ]

  const webPageNode: SchemaNode = {
    '@type': page.schemaType ?? 'WebPage',
    '@id': currentPageId,
    url: canonicalUrl,
    name: page.name,
    description: page.description,
    inLanguage: SITE.locale,
    isPartOf: ref(SCHEMA_IDS.website),
    about: ref(SCHEMA_IDS.organization),
    ...(currentBreadcrumbId ? { breadcrumb: ref(currentBreadcrumbId) } : {}),
    ...(mainEntityRefs.length === 1
      ? { mainEntity: mainEntityRefs[0] }
      : mainEntityRefs.length > 1
        ? { mainEntity: mainEntityRefs }
        : {}),
    ...(article ? { primaryImageOfPage: ref(articleImageId(article)) } : {}),
  }

  const graph: SchemaNode[] = [
    logoNode,
    addressNode,
    whatsappNode,
    organizationNode,
    websiteNode,
    webPageNode,
  ]

  if (currentBreadcrumbId) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': currentBreadcrumbId,
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    })
  }

  if (faqId) {
    graph.push({
      '@type': 'FAQPage',
      '@id': faqId,
      url: canonicalUrl,
      isPartOf: ref(currentPageId),
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    })
  }

  if (article && currentArticleId) {
    const imageUrl = absoluteUrl(articleImagePath(article))
    const imageId = articleImageId(article)

    graph.push(
      {
        '@type': 'ImageObject',
        '@id': imageId,
        url: imageUrl,
        contentUrl: imageUrl,
        caption: articleImageCaption(article),
        description: articleImageContext(article),
        ...(article.image?.width ? { width: article.image.width } : {}),
        ...(article.image?.height ? { height: article.image.height } : {}),
        ...(!article.image
          ? {
              width: ARTICLE_SOCIAL_IMAGE_SIZE.width,
              height: ARTICLE_SOCIAL_IMAGE_SIZE.height,
            }
          : {}),
      },
      {
        '@type': ['Article', 'BlogPosting'],
        '@id': currentArticleId,
        url: canonicalUrl,
        headline: article.title,
        description: article.excerpt,
        image: ref(imageId),
        datePublished: article.isoDate,
        dateModified: articleModifiedIsoDate(article),
        ...(articleAuthor ? { author: ref(personId(articleAuthor)) } : {}),
        ...(articleReviewer ? { reviewedBy: ref(personId(articleReviewer)) } : {}),
        publisher: ref(SCHEMA_IDS.organization),
        mainEntityOfPage: ref(currentPageId),
        isPartOf: ref(SCHEMA_IDS.website),
        articleSection: article.category,
        inLanguage: SITE.locale,
      },
    )
  }

  for (const person of graphPeople) {
    const profileUrl = absoluteUrl(teamProfilePath(person))
    graph.push({
      '@type': 'Person',
      '@id': personId(person),
      name: person.name,
      jobTitle: person.role,
      description: person.bio ?? person.profileText,
      image: absoluteUrl(person.image),
      url: profileUrl,
      worksFor: ref(SCHEMA_IDS.organization),
      ...((person.verifiedEducation ?? []).length > 0
        ? {
            hasCredential: (person.verifiedEducation ?? []).map((education) => ({
              '@type': 'EducationalOccupationalCredential',
              name: education.credential,
              ...(education.field ? { about: education.field } : {}),
              recognizedBy: {
                '@type': 'EducationalOrganization',
                name: education.institution,
              },
              url: education.sourceUrl,
            })),
          }
        : {}),
      ...((person.verifiedExpertise ?? []).length > 0
        ? { knowsAbout: (person.verifiedExpertise ?? []).map((expertise) => expertise.name) }
        : {}),
      ...((person.verifiedExternalProfiles ?? []).length > 0
        ? { sameAs: (person.verifiedExternalProfiles ?? []).map((profile) => profile.url) }
        : {}),
    })
  }

  assertNoReviewMarkup(graph)

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
