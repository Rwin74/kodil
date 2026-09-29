export const POST_STATUSES = [
  'draft',
  'in_review',
  'scheduled',
  'published',
  'archived',
] as const

export type PostStatus = (typeof POST_STATUSES)[number]

export type SourceInput = {
  title: string
  url: string
  publisher: string | null
  verifiedAt: string | null
  evidenceReference: string | null
  usageNote: string | null
}

export type CredentialInput = {
  kind: 'education' | 'expertise' | 'external_profile'
  name: string
  institution: string | null
  field: string | null
  sourceUrl: string
  verifiedAt: string
  evidenceReference: string
}

export type PostPolicyInput = {
  slug: string
  title: string
  seoTitle: string | null
  excerpt: string
  content: string
  categoryId: string
  keywords: string[]
  authorId: string | null
  reviewerId: string | null
  reviewedAt: string | null
  featuredMediaId: string | null
  sources: SourceInput[]
}

export type PublishContext = {
  approvedReview: boolean
  authorVerified?: boolean
  reviewerVerified?: boolean
  media?: {
    rightsStatus: 'pending' | 'verified' | 'restricted'
    rightsEvidenceReference: string | null
    permissionStatus: 'not_applicable' | 'pending' | 'verified' | 'restricted'
    permissionEvidenceReference: string | null
    altText: string
    caption: string | null
    context: string | null
  } | null
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const RAW_HTML = /<\/?[a-z][^>]*>/i
const UNSAFE_URI = /(?:javascript|data|vbscript)\s*:/i
const INLINE_IMAGE = /!\[[^\]]*\]\([^)]*\)/
const GUARANTEE_PATTERNS = [
  /\bgaranti(?:li|si|dir)?\b/i,
  /\bkesin (?:sonuç|çözüm|iyileşme|tedavi)\b/i,
  /\bkalıcı (?:sonuç|çözüm|iyileşme)\b/i,
  /\b(?:tamamen|mutlaka) iyileş(?:ir|tirir|me)\b/i,
  /%\s*\d+(?:[.,]\d+)?\s*(?:başarı|iyileşme|memnuniyet)/i,
  /\b\d+(?:[.,]\d+)?\s*%\s*(?:başarı|iyileşme|memnuniyet)/i,
] as const

export class ContentPolicyError extends Error {
  constructor(public readonly issues: string[]) {
    super(issues.join(' '))
    this.name = 'ContentPolicyError'
  }
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function requiredLength(value: string, minimum: number, maximum: number, label: string) {
  const length = value.trim().length
  if (length < minimum || length > maximum) {
    return `${label} ${minimum}–${maximum} karakter olmalı.`
  }
  return null
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validateControlledMarkdown(content: string) {
  const issues: string[] = []
  if (RAW_HTML.test(content)) issues.push('İçerikte HTML etiketi kullanılamaz.')
  if (UNSAFE_URI.test(content)) issues.push('İçerikte güvenli olmayan bağlantı protokolü var.')
  if (INLINE_IMAGE.test(content)) {
    issues.push('Markdown içinden görsel eklenemez; doğrulanmış medya alanını kullanın.')
  }
  for (const pattern of GUARANTEE_PATTERNS) {
    if (pattern.test(content)) {
      issues.push('İçerikte sağlık sonucu, başarı veya kesin çözüm garantisi veren dil var.')
      break
    }
  }
  return issues
}

export function validatePostDraft(input: PostPolicyInput) {
  const issues = [
    requiredLength(input.title, 8, 320, 'Başlık'),
    requiredLength(input.excerpt, 30, 500, 'Özet'),
    requiredLength(input.content, 80, 100_000, 'İçerik'),
    requiredLength(input.categoryId, 1, 64, 'Kategori'),
  ].filter((issue): issue is string => Boolean(issue))

  if (!SLUG.test(input.slug)) issues.push('Slug küçük harf, rakam ve tek tirelerden oluşmalı.')
  if (input.seoTitle && input.seoTitle.length > 70) issues.push('SEO başlığı 70 karakteri aşamaz.')
  if (input.keywords.length > 20) issues.push('En fazla 20 anahtar kelime eklenebilir.')
  if (input.keywords.some((keyword) => keyword.length < 2 || keyword.length > 80)) {
    issues.push('Anahtar kelimeler 2–80 karakter olmalı.')
  }
  issues.push(...validateControlledMarkdown(input.content))
  return [...new Set(issues)]
}

export function validateForPublication(input: PostPolicyInput, context: PublishContext) {
  const issues = validatePostDraft(input)
  if (!input.authorId) issues.push('Doğrulanmış gerçek yazar seçilmeden yayınlanamaz.')
  else if (context.authorVerified === false) issues.push('Yazar profilinin yayın ve kanıt kaydı doğrulanamadı.')
  if (!input.reviewerId || !input.reviewedAt || !ISO_DATE.test(input.reviewedAt)) {
    issues.push('Doğrulanmış reviewer ve gerçek inceleme tarihi olmadan yayınlanamaz.')
  }
  else if (context.reviewerVerified === false) issues.push('Reviewer uzmanlık kanıtı doğrulanamadı.')
  if (!context.approvedReview) issues.push('Onaylı klinik inceleme kaydı olmadan yayınlanamaz.')
  if (input.sources.length === 0) issues.push('En az bir doğrulanmış kaynak eklenmeli.')
  if (
    input.sources.some(
      (source) =>
        !source.title ||
        !isHttpsUrl(source.url) ||
        !source.verifiedAt ||
        !ISO_DATE.test(source.verifiedAt) ||
        !source.evidenceReference,
    )
  ) {
    issues.push('Her kaynakta başlık, HTTPS URL, doğrulama tarihi ve kanıt referansı zorunludur.')
  }

  if (input.featuredMediaId) {
    const media = context.media
    if (!media) issues.push('Seçilen medya kaydı bulunamadı.')
    else {
      if (media.rightsStatus !== 'verified' || !media.rightsEvidenceReference) {
        issues.push('Görsel hak sahipliği doğrulanmalı ve kanıt referansı bulunmalı.')
      }
      if (
        media.permissionStatus !== 'not_applicable' &&
        (media.permissionStatus !== 'verified' || !media.permissionEvidenceReference)
      ) {
        issues.push('Kişi yayın izni doğrulanmalı veya görsel için uygulanamaz olarak işaretlenmeli.')
      }
      if (!media.altText.trim() || !media.caption?.trim() || !media.context?.trim()) {
        issues.push('Görsel alt metni, açıklaması ve bağlamı eksiksiz olmalı.')
      }
    }
  }
  return [...new Set(issues)]
}

const TRANSITIONS: Record<PostStatus, readonly PostStatus[]> = {
  draft: ['in_review', 'archived'],
  in_review: ['draft', 'scheduled', 'published', 'archived'],
  scheduled: ['draft', 'published', 'archived'],
  published: ['draft', 'archived'],
  archived: ['draft'],
}

export function canTransitionPost(from: PostStatus, to: PostStatus) {
  return TRANSITIONS[from].includes(to)
}

export function assertPostTransition(from: PostStatus, to: PostStatus) {
  if (!canTransitionPost(from, to)) {
    throw new ContentPolicyError([`${from} durumundan ${to} durumuna geçilemez.`])
  }
}

export function parseSources(value: string): SourceInput[] {
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  return lines.map((line, index) => {
    const [title = '', url = '', publisher = '', verifiedAt = '', evidence = '', usage = ''] =
      line.split('|').map((part) => part.trim())
    if (!title || !url || !isHttpsUrl(url)) {
      throw new ContentPolicyError([`Kaynak ${index + 1}: başlık ve HTTPS URL zorunludur.`])
    }
    return {
      title: title.slice(0, 500),
      url,
      publisher: publisher || null,
      verifiedAt: verifiedAt || null,
      evidenceReference: evidence || null,
      usageNote: usage || null,
    }
  })
}

export function serializeSources(sources: readonly SourceInput[]) {
  return sources
    .map((source) =>
      [
        source.title,
        source.url,
        source.publisher ?? '',
        source.verifiedAt ?? '',
        source.evidenceReference ?? '',
        source.usageNote ?? '',
      ].join(' | '),
    )
    .join('\n')
}

export function parseCredentials(value: string): CredentialInput[] {
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  return lines.map((line, index) => {
    const [kind, name = '', institution = '', field = '', url = '', date = '', evidence = ''] =
      line.split('|').map((part) => part.trim())
    if (kind !== 'education' && kind !== 'expertise' && kind !== 'external_profile') {
      throw new ContentPolicyError([`Yetkinlik ${index + 1}: geçerli tür kullanılmalı.`])
    }
    if (!name || !isHttpsUrl(url) || !ISO_DATE.test(date) || !evidence) {
      throw new ContentPolicyError([
        `Yetkinlik ${index + 1}: ad, HTTPS kaynak, doğrulama tarihi ve kanıt zorunludur.`,
      ])
    }
    return {
      kind,
      name,
      institution: institution || null,
      field: field || null,
      sourceUrl: url,
      verifiedAt: date,
      evidenceReference: evidence,
    }
  })
}

export function assertTeamPublishable(credentials: readonly CredentialInput[]) {
  if (credentials.length === 0) {
    throw new ContentPolicyError(['Yayınlanan ekip profilinde en az bir doğrulanmış mesleki kayıt olmalı.'])
  }
}
