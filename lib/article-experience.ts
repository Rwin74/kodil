import type { Article, ArticleExperience } from '@/lib/articles'
import { getPublishableCaseStudy, type CaseStudy } from '@/lib/case-studies'
import { resolveEditorialCredit, type ResolvedEditorialCredit } from '@/lib/editorial'
import type { TeamMember } from '@/lib/team'

export interface ResolvedArticleExperience {
  author: TeamMember
  providedIsoDate: string
  sections: Omit<ArticleExperience, 'authorSlug' | 'providedIsoDate' | 'evidenceReference' | 'realCaseStudyId'>
  caseStudy?: CaseStudy
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const PLACEHOLDER_VALUE = /(?:example|örnek metin|lorem|todo|xxx)/i
const OUTCOME_GUARANTEE =
  /(?:%\s*\d+(?:[.,]\d+)?\s*(?:memnuniyet|başarı)|kesin (?:sonuç|çözüm)|(?:sonuç|başarı) garantisi|garanti(?:li|si)?|mucize|herkeste işe yarar|kalıcı (?:sonuç|çözüm)|hızla düzel(?:ir|tilir))/i

function assertExperienceText(value: string | undefined, label: string) {
  if (!value) return
  if (value.trim().length < 20 || PLACEHOLDER_VALUE.test(value)) {
    throw new Error(`${label} gerçek yazar tarafından sağlanan tamamlanmış metin olmalı.`)
  }
  if (OUTCOME_GUARANTEE.test(value)) {
    throw new Error(`${label} sağlık sonucu garantisi içeremez.`)
  }
}

/**
 * Deneyim notu ancak aynı içeriğin doğrulanmış bireysel yazarı tarafından
 * sağlandıysa çözülür. Kurumsal metinden otomatik birinci şahıs üretimi yoktur.
 */
export function resolveArticleExperience(
  article: Article,
  editorialCredit: ResolvedEditorialCredit = resolveEditorialCredit(article.slug),
): ResolvedArticleExperience | undefined {
  const experience = article.experience
  if (!experience) return undefined

  if (!editorialCredit.author || editorialCredit.author.slug !== experience.authorSlug) {
    throw new Error(
      `${article.slug}: deneyim notu yalnız içeriğin doğrulanmış gerçek yazarı tarafından sağlanabilir.`,
    )
  }
  if (!ISO_DATE.test(experience.providedIsoDate)) {
    throw new Error(`${article.slug}: deneyim sağlama tarihi YYYY-MM-DD biçiminde olmalı.`)
  }
  if (experience.evidenceReference.trim().length < 3 || PLACEHOLDER_VALUE.test(experience.evidenceReference)) {
    throw new Error(`${article.slug}: deneyim için yazar onayı/kanıt referansı gerekli.`)
  }

  assertExperienceText(experience.expertObservation, `${article.slug}: uzman gözlemi`)
  assertExperienceText(experience.practiceApproach, `${article.slug}: uygulamadaki yaklaşım`)
  assertExperienceText(experience.commonSituations, `${article.slug}: sık karşılaşılan durumlar`)
  assertExperienceText(experience.importantLimitations, `${article.slug}: önemli sınırlamalar`)

  const hasTextSection = Boolean(
    experience.expertObservation ||
      experience.practiceApproach ||
      experience.commonSituations ||
      experience.importantLimitations,
  )
  if (!hasTextSection && !experience.realCaseStudyId) {
    throw new Error(`${article.slug}: boş deneyim kaydı yayımlanamaz.`)
  }

  const caseStudy = experience.realCaseStudyId
    ? getPublishableCaseStudy(experience.realCaseStudyId)
    : undefined
  if (experience.realCaseStudyId && !caseStudy) {
    throw new Error(
      `${article.slug}: gerçek vaka alanı yalnız anonimlik, izin ve hukuk kontrollerinden geçmiş bir kayda bağlanabilir.`,
    )
  }

  return {
    author: editorialCredit.author,
    providedIsoDate: experience.providedIsoDate,
    sections: {
      expertObservation: experience.expertObservation,
      practiceApproach: experience.practiceApproach,
      commonSituations: experience.commonSituations,
      importantLimitations: experience.importantLimitations,
    },
    caseStudy,
  }
}
