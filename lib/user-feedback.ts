import type {
  LegalPublicationReview,
  PublicationPermissionStatus,
} from '@/lib/case-studies'

export interface UserFeedbackSource {
  kind: 'direct-message' | 'survey' | 'verified-platform' | 'written-form'
  label: string
  publicUrl?: string
  evidenceReference: string
  verifiedIsoDate: string
}

export interface UserFeedbackPermission {
  status: PublicationPermissionStatus
  scope: 'website-user-feedback'
  legalBasis: 'explicit-consent'
  evidenceReference?: string
  grantedIsoDate?: string
  withdrawalChannelReference?: string
  includesDisplayAttribution: boolean
}

export interface UserFeedback {
  id: string
  source: UserFeedbackSource
  isoDate: string
  text: string
  permission: UserFeedbackPermission
  legalReview: LegalPublicationReview
  /** Kişi açıkça izin verdiyse ad/baş harf; aksi durumda alan boş bırakılır. */
  displayAttribution?: string
  rating?: {
    value: number
    bestRating: number
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const PLACEHOLDER_VALUE = /(?:example|örnek yorum|lorem|todo|xxx|test kullanıcısı)/i
const OUTCOME_GUARANTEE =
  /(?:%\s*\d+(?:[.,]\d+)?\s*(?:memnuniyet|başarı)|kesin (?:sonuç|çözüm)|(?:sonuç|başarı) garantisi|garanti(?:li|si)?|mucize|herkeste işe yarar|kalıcı (?:sonuç|çözüm)|hızla düzel(?:ir|tilir))/i

function assertIsoDate(value: string | undefined, label: string) {
  if (!value || !ISO_DATE.test(value)) throw new Error(`${label} YYYY-MM-DD biçiminde olmalı.`)
}

function assertEvidence(value: string | undefined, label: string) {
  if (!value || value.trim().length < 3 || PLACEHOLDER_VALUE.test(value)) {
    throw new Error(`${label} için gerçek kanıt referansı gerekli.`)
  }
}

/**
 * Yalnız kaynağı doğrulanmış, yayına özgü izni alınmış ve hukuki incelemesi
 * tamamlanmış gerçek geri bildirimler buraya eklenir. Bekleyen ham yorumlar
 * production kaynak kodunda tutulmaz.
 */
export const userFeedbackRecords: readonly UserFeedback[] = []

function validatePublishableFeedback(feedback: UserFeedback) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(feedback.id)) {
    throw new Error(`${feedback.id}: yorum kimliği güvenli slug biçiminde olmalı.`)
  }
  if (feedback.text.trim().length < 10 || PLACEHOLDER_VALUE.test(feedback.text)) {
    throw new Error(`${feedback.id}: gerçek yorum metni gerekli.`)
  }
  if (OUTCOME_GUARANTEE.test(feedback.text)) {
    throw new Error(`${feedback.id}: yorum sağlık sonucu garantisi gibi sunulamaz.`)
  }

  assertIsoDate(feedback.isoDate, `${feedback.id}: yorum tarihi`)
  assertIsoDate(feedback.source.verifiedIsoDate, `${feedback.id}: kaynak doğrulama tarihi`)
  assertEvidence(feedback.source.label, `${feedback.id}: görünür kaynak`)
  assertEvidence(feedback.source.evidenceReference, `${feedback.id}: kaynak doğrulaması`)

  if (feedback.source.publicUrl) {
    const sourceUrl = new URL(feedback.source.publicUrl)
    if (sourceUrl.protocol !== 'https:') {
      throw new Error(`${feedback.id}: herkese açık yorum kaynağı HTTPS olmalı.`)
    }
  }

  if (feedback.permission.status !== 'granted') {
    throw new Error(`${feedback.id}: yayına özgü izin olmadan production'a alınamaz.`)
  }
  if (
    feedback.permission.scope !== 'website-user-feedback' ||
    feedback.permission.legalBasis !== 'explicit-consent'
  ) {
    throw new Error(`${feedback.id}: açık rıza bu geri bildirimin internet yayınına özgü olmalı.`)
  }
  assertIsoDate(feedback.permission.grantedIsoDate, `${feedback.id}: izin tarihi`)
  assertEvidence(feedback.permission.evidenceReference, `${feedback.id}: yayın izni`)
  assertEvidence(
    feedback.permission.withdrawalChannelReference,
    `${feedback.id}: açık rızayı geri alma kanalı`,
  )

  if (feedback.displayAttribution && !feedback.permission.includesDisplayAttribution) {
    throw new Error(`${feedback.id}: görünür kişi bilgisi için ayrıca kayıtlı yayın izni gerekli.`)
  }

  if (feedback.legalReview.status !== 'approved') {
    throw new Error(`${feedback.id}: hukuki yayın incelemesi onaylanmadan production'a alınamaz.`)
  }
  assertIsoDate(feedback.legalReview.reviewedIsoDate, `${feedback.id}: hukuki inceleme tarihi`)
  assertEvidence(feedback.legalReview.reviewerReference, `${feedback.id}: hukuki inceleyen`)
  assertEvidence(feedback.legalReview.legalBasisReference, `${feedback.id}: hukuki dayanak`)

  if (feedback.rating) {
    const { value, bestRating } = feedback.rating
    if (!Number.isFinite(value) || !Number.isFinite(bestRating) || bestRating <= 0 || value < 0 || value > bestRating) {
      throw new Error(`${feedback.id}: puan, 0 ile üst sınır arasında olmalı.`)
    }
  }

  return feedback
}

const feedbackIds = new Set<string>()
export const publishedUserFeedback = userFeedbackRecords.map((feedback) => {
  if (feedbackIds.has(feedback.id)) throw new Error(`${feedback.id}: yinelenen yorum kaydı.`)
  feedbackIds.add(feedback.id)
  return validatePublishableFeedback(feedback)
})

/**
 * Schema.org modeli AggregateRating'i desteklese de bu site kendi kurumu
 * hakkındaki yorumları kontrol eder. Google'ın self-serving review kuralı
 * nedeniyle Organization/LocalBusiness Review ve AggregateRating üretilmez.
 */
export const organizationReviewSchemaDecision = {
  assessedIsoDate: '2026-08-26',
  includeReviewMarkup: false,
  reason:
    'Kurum kendi sitesinde kendisi hakkındaki yorumları kontrol ettiği için Organization/LocalBusiness yıldız işaretlemesi self-serving review kapsamındadır.',
  policySources: [
    'https://developers.google.com/search/docs/appearance/structured-data/review-snippet',
    'https://developers.google.com/search/docs/appearance/structured-data/sd-policies',
    'https://schema.org/AggregateRating',
  ],
} as const
