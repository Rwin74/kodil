'use server'

import { headers } from 'next/headers'
import { revalidatePath, updateTag } from 'next/cache'
import type { AdminActionState } from '@/lib/admin/action-state'
import { actionError } from '@/lib/admin/action-state'
import {
  createAdminMedia,
  getAdminSiteSettings,
  saveAdminSiteSettings,
  saveAdminTeamMember,
} from '@/lib/admin/admin-service'
import {
  normalizeSlug,
  parseCredentials,
  parseSources,
  type PostStatus,
} from '@/lib/admin/content-policy'
import {
  createAdminPost,
  restorePostRevision,
  reviewPost,
  saveAdminPost,
  submitPostForReview,
  transitionPost,
} from '@/lib/admin/content-service'
import { PUBLIC_CONTENT_TAGS } from '@/lib/content/public-cache'
import { requirePermission } from '@/lib/auth/dal'
import type { AdminPermission } from '@/lib/auth/permissions'
import { assertTrustedMutationRequest } from '@/lib/auth/request-security'

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function optionalValue(formData: FormData, key: string) {
  return value(formData, key) || null
}

async function authorize(permission: AdminPermission) {
  assertTrustedMutationRequest(await headers())
  return requirePermission(permission)
}

function invalidatePublishedPost(previousSlug: string, slug: string) {
  updateTag(PUBLIC_CONTENT_TAGS.articles)
  for (const path of [
    '/',
    '/blog',
    `/blog/${previousSlug}`,
    `/blog/${slug}`,
    `/blog/${previousSlug}/social-image`,
    `/blog/${slug}/social-image`,
    '/sitemap.xml',
  ]) {
    revalidatePath(path)
  }
  revalidatePath('/ekibimiz/[slug]', 'page')
}

function invalidatePublishedTeam(previousSlug: string | null, slug: string) {
  updateTag(PUBLIC_CONTENT_TAGS.team)
  updateTag(PUBLIC_CONTENT_TAGS.articles)
  for (const path of [
    '/',
    '/blog',
    '/ekibimiz',
    '/hakkimizda',
    '/basari-hikayeleri',
    `/ekibimiz/${slug}`,
    ...(previousSlug ? [`/ekibimiz/${previousSlug}`] : []),
    '/sitemap.xml',
  ]) {
    revalidatePath(path)
  }
  revalidatePath('/blog/[slug]', 'page')
}

function postInput(formData: FormData) {
  return {
    slug: normalizeSlug(value(formData, 'slug')),
    title: value(formData, 'title'),
    seoTitle: optionalValue(formData, 'seoTitle'),
    excerpt: value(formData, 'excerpt'),
    content: value(formData, 'content'),
    categoryId: value(formData, 'categoryId'),
    keywords: value(formData, 'keywords').split(',').map((item) => item.trim()).filter(Boolean),
    authorId: optionalValue(formData, 'authorId'),
    reviewerId: optionalValue(formData, 'reviewerId'),
    reviewedAt: null,
    featuredMediaId: optionalValue(formData, 'featuredMediaId'),
    sources: parseSources(value(formData, 'sources')),
    indexable: formData.get('indexable') === 'on',
    canonicalOverride: optionalValue(formData, 'canonicalOverride'),
    canonicalOverrideReason: optionalValue(formData, 'canonicalOverrideReason'),
    expectedContentHash: optionalValue(formData, 'expectedContentHash'),
    slugChangeAcknowledged: formData.get('slugChangeAcknowledged') === 'on',
    slugChangeReason: optionalValue(formData, 'slugChangeReason'),
    changeNote: optionalValue(formData, 'changeNote'),
  }
}

export async function savePostAction(
  postId: string | null,
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const session = await authorize(postId ? 'content:update' : 'content:create')
    const input = postInput(formData)
    if (session.user.role !== 'admin' && input.canonicalOverride) {
      throw new Error('Canonical override yalnız yönetici rolüyle kaydedilebilir.')
    }
    const id = postId
      ? (await saveAdminPost(postId, input, session.user.id), postId)
      : await createAdminPost(input, session.user.id)
    revalidatePath('/yonetim/yazilar')
    revalidatePath(`/yonetim/yazilar/${id}`)
    return { status: 'success', message: 'Çalışma kopyası güvenle kaydedildi.', redirectTo: `/yonetim/yazilar/${id}` }
  } catch (error) {
    return actionError(error)
  }
}

export async function submitPostAction(
  postId: string,
  _previous: AdminActionState,
  _formData: FormData,
): Promise<AdminActionState> {
  void _previous
  void _formData
  try {
    const session = await authorize('content:submit_review')
    await submitPostForReview(postId, session.user.id)
    revalidatePath(`/yonetim/yazilar/${postId}`)
    return { status: 'success', message: 'Yazı klinik incelemeye gönderildi.' }
  } catch (error) {
    return actionError(error)
  }
}

export async function reviewPostAction(
  postId: string,
  decision: 'approved' | 'rejected',
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const session = await authorize(
      decision === 'approved' ? 'clinical_review:approve' : 'clinical_review:reject',
    )
    await reviewPost(
      postId,
      decision,
      value(formData, 'expertiseSourceUrl'),
      value(formData, 'evidenceReference'),
      session.user.id,
    )
    revalidatePath(`/yonetim/yazilar/${postId}`)
    return { status: 'success', message: decision === 'approved' ? 'İnceleme onaylandı.' : 'İnceleme reddedildi ve taslağa döndü.' }
  } catch (error) {
    return actionError(error)
  }
}

export async function transitionPostAction(
  postId: string,
  target: PostStatus,
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const permission: AdminPermission = target === 'archived' ? 'content:archive' : target === 'draft' ? 'content:update' : 'content:publish'
    const session = await authorize(permission)
    const change = await transitionPost(
      postId,
      target,
      session.user.id,
      optionalValue(formData, 'scheduledAt'),
    )
    revalidatePath('/yonetim/yazilar')
    revalidatePath(`/yonetim/yazilar/${postId}`)
    if (change.publicContentChanged) {
      invalidatePublishedPost(change.previousSlug, change.slug)
    }
    return { status: 'success', message: target === 'published' ? 'Yazı yayımlandı.' : `Yazı ${target} durumuna geçirildi.` }
  } catch (error) {
    return actionError(error)
  }
}

export async function restoreRevisionAction(
  postId: string,
  revisionId: number,
  _previous: AdminActionState,
  _formData: FormData,
): Promise<AdminActionState> {
  void _previous
  void _formData
  try {
    const session = await authorize('content:update')
    await restorePostRevision(postId, revisionId, session.user.id)
    revalidatePath(`/yonetim/yazilar/${postId}`)
    return { status: 'success', message: 'Revizyon yeni çalışma kopyasına alındı; canlı yayın değişmedi.' }
  } catch (error) {
    return actionError(error)
  }
}

export async function uploadMediaAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const session = await authorize('media:manage')
    const file = formData.get('file')
    if (!(file instanceof File)) throw new Error('Bir görsel seçin.')
    await createAdminMedia(
      file,
      {
        altText: value(formData, 'altText'),
        caption: value(formData, 'caption'),
        context: value(formData, 'context'),
        rightsStatus: value(formData, 'rightsStatus') as 'pending' | 'verified' | 'restricted',
        rightsEvidenceReference: optionalValue(formData, 'rightsEvidenceReference'),
        permissionStatus: value(formData, 'permissionStatus') as 'not_applicable' | 'pending' | 'verified' | 'restricted',
        permissionEvidenceReference: optionalValue(formData, 'permissionEvidenceReference'),
      },
      session.user.id,
    )
    revalidatePath('/yonetim/medya')
    return { status: 'success', message: 'Görsel meta verileri temizlenerek WebP ve AVIF türevleriyle kaydedildi.' }
  } catch (error) {
    return actionError(error)
  }
}

export async function saveTeamMemberAction(
  memberId: string | null,
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const desiredStatus = value(formData, 'status') as 'draft' | 'published' | 'archived'
    const permission: AdminPermission = desiredStatus === 'published' ? 'content:publish' : desiredStatus === 'archived' ? 'content:archive' : memberId ? 'content:update' : 'content:create'
    const session = await authorize(permission)
    const reviewerUserId = optionalValue(formData, 'reviewerUserId')
    if (session.user.role !== 'admin' && reviewerUserId) {
      throw new Error('Reviewer hesabı eşlemesini yalnız yönetici yapabilir.')
    }
    const change = await saveAdminTeamMember(
      memberId,
      {
        slug: normalizeSlug(value(formData, 'slug')),
        name: value(formData, 'name'),
        role: value(formData, 'role'),
        bio: value(formData, 'bio'),
        accent: value(formData, 'accent') || 'var(--navy)',
        status: desiredStatus,
        featuredMediaId: optionalValue(formData, 'featuredMediaId'),
        reviewerUserId,
        credentials: parseCredentials(value(formData, 'credentials')),
        slugChangeAcknowledged: formData.get('slugChangeAcknowledged') === 'on',
        slugChangeReason: optionalValue(formData, 'slugChangeReason'),
      },
      session.user.id,
      session.user.role === 'admin',
    )
    revalidatePath('/yonetim/ekip')
    revalidatePath(`/yonetim/ekip/${change.id}`)
    if (change.publicContentChanged) {
      invalidatePublishedTeam(change.previousSlug, change.slug)
    }
    return { status: 'success', message: 'Ekip profili ve kanıt kayıtları kaydedildi.', redirectTo: `/yonetim/ekip/${change.id}` }
  } catch (error) {
    return actionError(error)
  }
}

export async function saveSiteSettingsAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const session = await authorize('site_settings:manage')
    const current = await getAdminSiteSettings()
    await saveAdminSiteSettings(
      {
        ...current,
        phone: value(formData, 'phone'),
        phoneDisplay: value(formData, 'phoneDisplay'),
        email: value(formData, 'email'),
        address: {
          ...current.address,
          streetAddress: value(formData, 'streetAddress'),
          addressLocality: value(formData, 'addressLocality'),
          addressRegion: value(formData, 'addressRegion'),
          postalCode: value(formData, 'postalCode'),
        },
        openingHours: [
          { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: value(formData, 'weekdayOpens'), closes: value(formData, 'weekdayCloses') },
          { days: ['Saturday', 'Sunday'], opens: value(formData, 'weekendOpens'), closes: value(formData, 'weekendCloses') },
        ],
      },
      session.user.id,
    )
    revalidatePath('/yonetim/ayarlar')
    return { status: 'success', message: 'İletişim ve çalışma saatleri kaydedildi.' }
  } catch (error) {
    return actionError(error)
  }
}
