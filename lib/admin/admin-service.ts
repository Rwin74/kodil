import 'server-only'

import { createHash, randomUUID } from 'node:crypto'
import { and, asc, desc, eq, or } from 'drizzle-orm'
import { getDatabase } from '@/db/client'
import { auditLogs, credentials, media, posts, siteSettings, teamMembers, users } from '@/db/schema'
import {
  assertTeamPublishable,
  ContentPolicyError,
  type CredentialInput,
} from '@/lib/admin/content-policy'
import { prepareMediaUpload } from '@/lib/admin/media-storage'
import { writeValidatedRedirect } from '@/lib/admin/redirect-service'
import { SITE } from '@/lib/site'
import type {
  VerifiedEducation,
  VerifiedExpertise,
  VerifiedExternalProfile,
} from '@/lib/team'

const EXTERNAL_PROFILE_KINDS = new Set<VerifiedExternalProfile['kind']>([
  'linkedin',
  'professional-association',
  'institutional-directory',
  'wikidata',
])

function nowDateTime() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

export async function listAdminTeamMembers() {
  return getDatabase()
    .select({
      id: teamMembers.id,
      slug: teamMembers.slug,
      name: teamMembers.name,
      role: teamMembers.role,
      status: teamMembers.status,
      updatedAt: teamMembers.updatedAt,
    })
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.name))
}

export async function getAdminTeamMember(id: string, includeReviewerUsers = false) {
  const [member] = await getDatabase().select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1)
  if (!member) throw new Error('Ekip profili bulunamadı.')
  const [credentialRows, mediaRows, reviewerUsers] = await Promise.all([
    getDatabase().select().from(credentials).where(eq(credentials.teamMemberId, id)).orderBy(asc(credentials.createdAt)),
    getDatabase()
      .select({ id: media.id, altText: media.altText, rightsStatus: media.rightsStatus, permissionStatus: media.permissionStatus })
      .from(media)
      .orderBy(desc(media.createdAt)),
    includeReviewerUsers
      ? getDatabase()
          .select({ id: users.id, displayName: users.displayName, email: users.email, role: users.role })
          .from(users)
          .where(eq(users.status, 'active'))
          .orderBy(asc(users.displayName))
      : Promise.resolve([]),
  ])
  return { member, credentials: credentialRows, media: mediaRows, reviewerUsers }
}

export type SaveTeamMemberInput = {
  slug: string
  name: string
  role: string
  bio: string
  accent: string
  status: 'draft' | 'published' | 'archived'
  featuredMediaId: string | null
  reviewerUserId: string | null
  credentials: CredentialInput[]
  slugChangeAcknowledged: boolean
  slugChangeReason: string | null
}

function verifiedArrays(credentialRows: readonly CredentialInput[]) {
  const verifiedEducation: VerifiedEducation[] = []
  const verifiedExpertise: VerifiedExpertise[] = []
  const verifiedExternalProfiles: VerifiedExternalProfile[] = []
  for (const credential of credentialRows) {
    if (credential.kind === 'education') {
      if (!credential.institution) throw new ContentPolicyError(['Eğitim kaydında kurum zorunludur.'])
      verifiedEducation.push({
        credential: credential.name,
        institution: credential.institution,
        ...(credential.field ? { field: credential.field } : {}),
        sourceUrl: credential.sourceUrl,
        verifiedIsoDate: credential.verifiedAt,
      })
    } else if (credential.kind === 'expertise') {
      verifiedExpertise.push({
        name: credential.name,
        sourceUrl: credential.sourceUrl,
        verifiedIsoDate: credential.verifiedAt,
      })
    } else {
      if (!credential.field || !EXTERNAL_PROFILE_KINDS.has(credential.field as VerifiedExternalProfile['kind'])) {
        throw new ContentPolicyError([
          'Dış profil alanı linkedin, professional-association, institutional-directory veya wikidata olmalı.',
        ])
      }
      verifiedExternalProfiles.push({
        kind: credential.field as VerifiedExternalProfile['kind'],
        label: credential.name,
        url: credential.sourceUrl,
        verifiedIsoDate: credential.verifiedAt,
        verificationReference: credential.evidenceReference,
      })
    }
  }
  return { verifiedEducation, verifiedExpertise, verifiedExternalProfiles }
}

export async function saveAdminTeamMember(
  id: string | null,
  input: SaveTeamMemberInput,
  actorId: string,
  canManageReviewerIdentity: boolean,
) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
    throw new ContentPolicyError(['Profil slug alanı küçük harf, rakam ve tirelerden oluşmalı.'])
  }
  if (!['draft', 'published', 'archived'].includes(input.status)) {
    throw new ContentPolicyError(['Geçersiz ekip profili durumu.'])
  }
  if (input.name.trim().length < 3 || input.role.trim().length < 3 || input.bio.trim().length < 30) {
    throw new ContentPolicyError(['Ad, görev ve en az 30 karakterlik doğrulanabilir biyografi zorunludur.'])
  }
  if (input.status === 'published') assertTeamPublishable(input.credentials)
  const arrays = verifiedArrays(input.credentials)
  const current = id
    ? (await getDatabase().select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1))[0]
    : null
  if (id && !current) throw new Error('Ekip profili bulunamadı.')
  if (current && current.slug !== input.slug) {
    if (!input.slugChangeAcknowledged || !input.slugChangeReason || input.slugChangeReason.length < 10) {
      throw new ContentPolicyError(['Profil slug değişikliği için uyarı onayı ve gerekçe zorunludur.'])
    }
  }
  if (current?.status === 'published' && input.status !== 'published') {
    const linkedPosts = await getDatabase()
      .select({ id: posts.id })
      .from(posts)
      .where(
        and(
          eq(posts.status, 'published'),
          or(eq(posts.authorId, current.id), eq(posts.reviewerId, current.id)),
        ),
      )
      .limit(1)
    if (linkedPosts.length > 0) {
      throw new ContentPolicyError([
        'Yayımdaki yazılara bağlı yazar/reviewer profili taslak veya arşiv yapılamaz; önce ilişkileri güvenle yeniden atayın.',
      ])
    }
  }

  let imagePath = current?.imagePath ?? '/placeholder-user.jpg'
  if (input.featuredMediaId) {
    const [selectedMedia] = await getDatabase().select().from(media).where(eq(media.id, input.featuredMediaId)).limit(1)
    if (!selectedMedia) throw new Error('Seçilen medya bulunamadı.')
    if (
      input.status === 'published' &&
      (selectedMedia.rightsStatus !== 'verified' ||
        !['verified', 'not_applicable'].includes(selectedMedia.permissionStatus))
    ) {
      throw new ContentPolicyError(['Yayınlanan ekip görselinin hak ve kişi izinleri doğrulanmış olmalı.'])
    }
    imagePath = `/media/${selectedMedia.avifStorageKey ?? selectedMedia.storageKey}`
  }

  const memberId = id ?? randomUUID()
  const timestamp = nowDateTime()
  await getDatabase().transaction(async (transaction) => {
    const values = {
      slug: input.slug,
      name: input.name.trim(),
      role: input.role.trim(),
      bio: input.bio.trim(),
      imagePath,
      accent: input.accent,
      verifiedEducation: arrays.verifiedEducation,
      verifiedExpertise: arrays.verifiedExpertise,
      verifiedExternalProfiles: arrays.verifiedExternalProfiles,
      status: input.status,
      featuredMediaId: input.featuredMediaId,
      reviewerUserId: canManageReviewerIdentity ? input.reviewerUserId : current?.reviewerUserId ?? null,
      contentUpdatedAt: input.status === 'published' ? new Date().toISOString().slice(0, 10) : current?.contentUpdatedAt ?? null,
      updatedAt: timestamp,
    }
    if (current) await transaction.update(teamMembers).set(values).where(eq(teamMembers.id, memberId))
    else await transaction.insert(teamMembers).values({ id: memberId, sortOrder: 999, ...values })

    await transaction.delete(credentials).where(eq(credentials.teamMemberId, memberId))
    if (input.credentials.length) {
      await transaction.insert(credentials).values(
        input.credentials.map((credential) => ({
          id: randomUUID(),
          teamMemberId: memberId,
          kind: credential.kind,
          name: credential.name,
          institution: credential.institution,
          field: credential.field,
          sourceUrl: credential.sourceUrl,
          sourceUrlHash: createHash('sha256').update(credential.sourceUrl).digest('hex'),
          verifiedAt: credential.verifiedAt,
          evidenceReference: credential.evidenceReference,
          updatedAt: timestamp,
        })),
      )
    }
    if (current && current.slug !== input.slug) {
      await writeValidatedRedirect(transaction, {
        sourcePath: `/ekibimiz/${current.slug}`,
        targetPath: `/ekibimiz/${input.slug}`,
        reason: input.slugChangeReason!,
        checkedAt: timestamp,
      })
    }
    await transaction.insert(auditLogs).values({
      actorId,
      action: current ? 'team_member.updated' : 'team_member.created',
      entityType: 'team_member',
      entityId: memberId,
      context: { status: input.status, slug: input.slug },
    })
  })
  return {
    id: memberId,
    slug: input.slug,
    previousSlug: current?.slug ?? null,
    publicContentChanged: current?.status === 'published' || input.status === 'published',
  }
}

export type MediaEvidenceInput = {
  altText: string
  caption: string
  context: string
  rightsStatus: 'pending' | 'verified' | 'restricted'
  rightsEvidenceReference: string | null
  permissionStatus: 'not_applicable' | 'pending' | 'verified' | 'restricted'
  permissionEvidenceReference: string | null
}

export async function createAdminMedia(file: File, input: MediaEvidenceInput, actorId: string) {
  if (!['pending', 'verified', 'restricted'].includes(input.rightsStatus)) {
    throw new ContentPolicyError(['Geçersiz hak sahipliği durumu.'])
  }
  if (!['not_applicable', 'pending', 'verified', 'restricted'].includes(input.permissionStatus)) {
    throw new ContentPolicyError(['Geçersiz kişi izin durumu.'])
  }
  if (input.altText.trim().length < 8 || input.caption.trim().length < 8 || input.context.trim().length < 12) {
    throw new ContentPolicyError(['Alt metin, açıklama ve görsel bağlamı eksiksiz yazılmalı.'])
  }
  if (input.rightsStatus === 'verified' && !input.rightsEvidenceReference) {
    throw new ContentPolicyError(['Doğrulanmış hak sahipliği için kanıt referansı zorunludur.'])
  }
  if (input.permissionStatus === 'verified' && !input.permissionEvidenceReference) {
    throw new ContentPolicyError(['Doğrulanmış kişi izni için kanıt referansı zorunludur.'])
  }

  const prepared = await prepareMediaUpload(file)
  try {
    await getDatabase().transaction(async (transaction) => {
      await transaction.insert(media).values({
        id: prepared.id,
        storageKey: prepared.storageKey,
        originalFilename: prepared.originalFilename,
        originalStorageKey: prepared.originalStorageKey,
        webpStorageKey: prepared.webpStorageKey,
        avifStorageKey: prepared.avifStorageKey,
        mimeType: prepared.mimeType,
        byteSize: prepared.byteSize,
        width: prepared.width,
        height: prepared.height,
        altText: input.altText.trim(),
        caption: input.caption.trim(),
        context: input.context.trim(),
        rightsStatus: input.rightsStatus,
        rightsEvidenceReference: input.rightsEvidenceReference,
        permissionStatus: input.permissionStatus,
        permissionEvidenceReference: input.permissionEvidenceReference,
        uploadedBy: actorId,
      })
      await transaction.insert(auditLogs).values({
        actorId,
        action: 'media.created',
        entityType: 'media',
        entityId: prepared.id,
        context: { mimeType: prepared.mimeType, byteSize: prepared.byteSize },
      })
    })
  } catch (error) {
    await prepared.cleanup()
    throw error
  }
  return prepared.id
}

export async function listAdminMedia() {
  return getDatabase().select().from(media).orderBy(desc(media.createdAt))
}

type MutableSite = {
  phone: string
  phoneDisplay: string
  email: string
  address: { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; addressCountry: string }
  openingHours: Array<{ days: string[]; opens: string; closes: string }>
  [key: string]: unknown
}

export async function getAdminSiteSettings(): Promise<MutableSite> {
  const [row] = await getDatabase().select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, 'site')).limit(1)
  return structuredClone((row?.value ?? SITE) as MutableSite)
}

export async function saveAdminSiteSettings(input: MutableSite, actorId: string) {
  if (!/^\+\d{10,15}$/.test(input.phone) || !/^\S+@\S+\.\S+$/.test(input.email)) {
    throw new ContentPolicyError(['Telefon uluslararası +90… biçiminde, e-posta geçerli biçimde olmalı.'])
  }
  const hours = input.openingHours
  if (hours.length !== 2 || hours.some((item) => !/^\d{2}:\d{2}$/.test(item.opens) || !/^\d{2}:\d{2}$/.test(item.closes))) {
    throw new ContentPolicyError(['Hafta içi ve hafta sonu saatleri SS:DD biçiminde olmalı.'])
  }
  await getDatabase().transaction(async (transaction) => {
    await transaction
      .insert(siteSettings)
      .values({ key: 'site', value: input, description: 'Yönetim panelinden doğrulanan kamusal iletişim ve saat ayarları', updatedBy: actorId, updatedAt: nowDateTime() })
      .onDuplicateKeyUpdate({ set: { value: input, updatedBy: actorId, updatedAt: nowDateTime() } })
    await transaction.insert(auditLogs).values({ actorId, action: 'site_settings.updated', entityType: 'site_settings', entityId: 'site', context: { email: input.email, phone: input.phone } })
  })
}
