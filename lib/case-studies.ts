export const INDIVIDUAL_PROCESS_NOTICE =
  'Bu anlatım tek bir kişinin sürecini açıklar; tanı, uygulama ve gözlenen değişimler her bireyde farklı olabilir. Sağlık sonucu veya tedavi başarısı garantisi değildir.'

export type PublicationPermissionStatus =
  | 'pending'
  | 'granted'
  | 'denied'
  | 'withdrawn'

export type LegalReviewStatus = 'pending' | 'approved' | 'rejected'

export interface PublicationPermission {
  status: PublicationPermissionStatus
  scope: 'website-case-study'
  legalBasis: 'explicit-consent'
  evidenceReference?: string
  grantedIsoDate?: string
  withdrawalChannelReference?: string
}

export interface LegalPublicationReview {
  status: LegalReviewStatus
  reviewedIsoDate?: string
  reviewerReference?: string
  legalBasisReference?: string
}

export interface CaseStudy {
  id: string
  title: string
  /** Ad, rumuz, kesin yaş, konum veya kişiyi belirleyebilecek başka bir alan tutulmaz. */
  anonymousContext: string
  initialSituation: string
  appliedApproach: string
  observedProcess?: string
  importantLimitations: string
  sourceReference: string
  verifiedIsoDate: string
  anonymization: {
    status: 'confirmed' | 'pending'
    checkedIsoDate?: string
    evidenceReference?: string
    removedIdentifierCategories: readonly string[]
  }
  publicationPermission: PublicationPermission
  legalReview: LegalPublicationReview
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const PLACEHOLDER_VALUE = /(?:example|örnek|lorem|todo|xxx|adı soyadı|vaka no)/i
const OUTCOME_GUARANTEE =
  /(?:%\s*\d+(?:[.,]\d+)?\s*(?:memnuniyet|başarı)|kesin (?:sonuç|çözüm)|(?:sonuç|başarı) garantisi|garanti(?:li|si)?|mucize|herkeste işe yarar|kalıcı (?:sonuç|çözüm)|hızla düzel(?:ir|tilir))/i

function assertIsoDate(value: string | undefined, label: string) {
  if (!value || !ISO_DATE.test(value)) {
    throw new Error(`${label} YYYY-MM-DD biçiminde olmalı.`)
  }
}

function assertEvidence(value: string | undefined, label: string) {
  if (!value || value.trim().length < 3 || PLACEHOLDER_VALUE.test(value)) {
    throw new Error(`${label} için gerçek kanıt referansı gerekli.`)
  }
}

function assertContent(value: string, label: string) {
  if (value.trim().length < 20 || PLACEHOLDER_VALUE.test(value)) {
    throw new Error(`${label} gerçek ve tamamlanmış içerik olmalı.`)
  }
  if (OUTCOME_GUARANTEE.test(value)) {
    throw new Error(`${label} sağlık sonucu garantisi içeremez.`)
  }
}

/**
 * Yalnız production'da yayımlanması onaylanmış gerçek vakalar buraya eklenir.
 * Bekleyen/ret/geri çekilmiş kayıtlar ve ham kişisel veriler repoya konmaz.
 */
export const caseStudies: readonly CaseStudy[] = []

function validatePublishableCaseStudy(caseStudy: CaseStudy) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(caseStudy.id)) {
    throw new Error(`${caseStudy.id}: vaka kimliği güvenli slug biçiminde olmalı.`)
  }

  assertContent(caseStudy.title, `${caseStudy.id}: vaka başlığı`)
  assertContent(caseStudy.anonymousContext, `${caseStudy.id}: anonim bağlam`)
  assertContent(caseStudy.initialSituation, `${caseStudy.id}: başlangıç durumu`)
  assertContent(caseStudy.appliedApproach, `${caseStudy.id}: uygulanan yaklaşım`)
  if (caseStudy.observedProcess) {
    assertContent(caseStudy.observedProcess, `${caseStudy.id}: gözlenen süreç`)
  }
  assertContent(caseStudy.importantLimitations, `${caseStudy.id}: önemli sınırlamalar`)
  assertEvidence(caseStudy.sourceReference, `${caseStudy.id}: vaka kaynağı`)
  assertIsoDate(caseStudy.verifiedIsoDate, `${caseStudy.id}: vaka doğrulama tarihi`)

  if (caseStudy.anonymization.status !== 'confirmed') {
    throw new Error(`${caseStudy.id}: anonimleştirme doğrulanmadan production'a alınamaz.`)
  }
  assertIsoDate(caseStudy.anonymization.checkedIsoDate, `${caseStudy.id}: anonimleştirme kontrol tarihi`)
  assertEvidence(caseStudy.anonymization.evidenceReference, `${caseStudy.id}: anonimleştirme`)
  if (caseStudy.anonymization.removedIdentifierCategories.length === 0) {
    throw new Error(`${caseStudy.id}: çıkarılan belirleyici veri kategorileri kaydedilmeli.`)
  }

  if (caseStudy.publicationPermission.status !== 'granted') {
    throw new Error(`${caseStudy.id}: yayına özgü açık izin olmadan production'a alınamaz.`)
  }
  if (
    caseStudy.publicationPermission.scope !== 'website-case-study' ||
    caseStudy.publicationPermission.legalBasis !== 'explicit-consent'
  ) {
    throw new Error(`${caseStudy.id}: açık rıza bu vaka çalışmasının internet yayınına özgü olmalı.`)
  }
  assertIsoDate(caseStudy.publicationPermission.grantedIsoDate, `${caseStudy.id}: izin tarihi`)
  assertEvidence(caseStudy.publicationPermission.evidenceReference, `${caseStudy.id}: yayın izni`)
  assertEvidence(
    caseStudy.publicationPermission.withdrawalChannelReference,
    `${caseStudy.id}: açık rızayı geri alma kanalı`,
  )

  if (caseStudy.legalReview.status !== 'approved') {
    throw new Error(`${caseStudy.id}: hukuki yayın incelemesi onaylanmadan production'a alınamaz.`)
  }
  assertIsoDate(caseStudy.legalReview.reviewedIsoDate, `${caseStudy.id}: hukuki inceleme tarihi`)
  assertEvidence(caseStudy.legalReview.reviewerReference, `${caseStudy.id}: hukuki inceleyen`)
  assertEvidence(caseStudy.legalReview.legalBasisReference, `${caseStudy.id}: hukuki dayanak`)

  return caseStudy
}

const caseStudyIds = new Set<string>()
for (const caseStudy of caseStudies) {
  if (caseStudyIds.has(caseStudy.id)) throw new Error(`${caseStudy.id}: yinelenen vaka kaydı.`)
  caseStudyIds.add(caseStudy.id)
  validatePublishableCaseStudy(caseStudy)
}

export function getPublishableCaseStudy(id: string) {
  return caseStudies.find((caseStudy) => caseStudy.id === id)
}
