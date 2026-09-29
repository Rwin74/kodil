import 'server-only'

import { createHash, randomUUID } from 'node:crypto'
import { and, asc, desc, eq, isNotNull, lte } from 'drizzle-orm'
import { getDatabase } from '@/db/client'
import {
  auditLogs,
  categories,
  credentials,
  editorialReviews,
  media,
  postRevisions,
  posts,
  postWorkingCopies,
  redirects,
  sources,
  teamMembers,
} from '@/db/schema'
import { writeValidatedRedirect } from '@/lib/admin/redirect-service'
import {
  assertPostTransition,
  ContentPolicyError,
  type PostPolicyInput,
  type PostStatus,
  type SourceInput,
  validateForPublication,
  validatePostDraft,
} from '@/lib/admin/content-policy'
import type { ArticleExperience, ArticleImage } from '@/lib/articles'
import { PAGES, SITE } from '@/lib/site'

export type PostSnapshot = PostPolicyInput & {
  version: 1
  image: ArticleImage | null
  experience: ArticleExperience | null
  indexable: boolean
  canonicalOverride: string | null
  canonicalOverrideReason: string | null
  sortOrder: number
  slugChangeReason: string | null
}

export type SavePostInput = Omit<PostSnapshot, 'version' | 'image' | 'experience' | 'sortOrder'> & {
  expectedContentHash: string | null
  slugChangeAcknowledged: boolean
  slugChangeReason: string | null
  changeNote: string | null
}

function nowDateTime() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function turkishDate(isoDate: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Istanbul',
  })
    .format(new Date(`${isoDate}T12:00:00+03:00`))
    .replaceAll('.', '')
}

function sourceValues(postId: string, sourceList: readonly SourceInput[]) {
  return sourceList.map((source, sortOrder) => ({
    postId,
    title: source.title,
    url: source.url,
    urlHash: createHash('sha256').update(source.url).digest('hex'),
    publisher: source.publisher,
    verifiedAt: source.verifiedAt,
    evidenceReference: source.evidenceReference,
    usageNote: source.usageNote,
    sortOrder,
  }))
}

export function hashPostSnapshot(snapshot: PostSnapshot) {
  const reviewable = {
    ...snapshot,
    reviewedAt: null,
    slugChangeReason: null,
  }
  return createHash('sha256').update(JSON.stringify(reviewable)).digest('hex')
}

function assertSnapshot(value: unknown): asserts value is PostSnapshot {
  if (!value || typeof value !== 'object') throw new Error('Çalışma kopyası okunamadı.')
  const snapshot = value as Partial<PostSnapshot>
  if (
    snapshot.version !== 1 ||
    typeof snapshot.slug !== 'string' ||
    typeof snapshot.title !== 'string' ||
    typeof snapshot.content !== 'string' ||
    !Array.isArray(snapshot.sources) ||
    !Array.isArray(snapshot.keywords)
  ) {
    throw new Error('Çalışma kopyası şeması geçersiz.')
  }
}

async function snapshotFromPublishedPost(post: typeof posts.$inferSelect): Promise<PostSnapshot> {
  const sourceRows = await getDatabase()
    .select()
    .from(sources)
    .where(eq(sources.postId, post.id))
    .orderBy(asc(sources.sortOrder))
  return {
    version: 1,
    slug: post.slug,
    title: post.title,
    seoTitle: post.seoTitle,
    excerpt: post.excerpt,
    content: post.content,
    categoryId: post.categoryId,
    keywords: post.keywords,
    authorId: post.authorId,
    reviewerId: post.reviewerId,
    reviewedAt: post.reviewedAt,
    featuredMediaId: post.featuredMediaId,
    image: post.image ?? null,
    experience: post.experience ?? null,
    indexable: post.indexable,
    canonicalOverride: post.canonicalOverride,
    canonicalOverrideReason: null,
    sortOrder: post.sortOrder,
    slugChangeReason: null,
    sources: sourceRows.map((source) => ({
      title: source.title,
      url: source.url,
      publisher: source.publisher,
      verifiedAt: source.verifiedAt,
      evidenceReference: source.evidenceReference,
      usageNote: source.usageNote,
    })),
  }
}

async function findPost(postId: string) {
  const [post] = await getDatabase().select().from(posts).where(eq(posts.id, postId)).limit(1)
  if (!post) throw new Error('Yazı bulunamadı.')
  return post
}

export async function listAdminPosts() {
  return getDatabase()
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      liveStatus: posts.status,
      updatedAt: posts.updatedAt,
      workingStatus: postWorkingCopies.status,
      scheduledAt: postWorkingCopies.scheduledAt,
    })
    .from(posts)
    .leftJoin(postWorkingCopies, eq(posts.id, postWorkingCopies.postId))
    .orderBy(desc(posts.updatedAt), asc(posts.title))
}

export async function getAdminPost(postId: string) {
  const post = await findPost(postId)
  const [workingCopy, categoryRows, memberRows, mediaRows, revisionRows, reviewRows] =
    await Promise.all([
      getDatabase().select().from(postWorkingCopies).where(eq(postWorkingCopies.postId, postId)).limit(1),
      getDatabase().select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)),
      getDatabase()
        .select({ id: teamMembers.id, name: teamMembers.name, role: teamMembers.role, status: teamMembers.status })
        .from(teamMembers)
        .where(eq(teamMembers.status, 'published'))
        .orderBy(asc(teamMembers.sortOrder)),
      getDatabase()
        .select({
          id: media.id,
          altText: media.altText,
          width: media.width,
          height: media.height,
          rightsStatus: media.rightsStatus,
          permissionStatus: media.permissionStatus,
          storageKey: media.storageKey,
        })
        .from(media)
        .orderBy(desc(media.createdAt)),
      getDatabase()
        .select({ id: postRevisions.id, snapshot: postRevisions.snapshot, changeNote: postRevisions.changeNote, createdAt: postRevisions.createdAt })
        .from(postRevisions)
        .where(eq(postRevisions.postId, postId))
        .orderBy(desc(postRevisions.id))
        .limit(30),
      getDatabase()
        .select({
          id: editorialReviews.id,
          status: editorialReviews.status,
          contentHash: editorialReviews.contentHash,
          completedAt: editorialReviews.completedAt,
          evidenceReference: editorialReviews.evidenceReference,
          reviewerId: editorialReviews.reviewerId,
        })
        .from(editorialReviews)
        .where(eq(editorialReviews.postId, postId))
        .orderBy(desc(editorialReviews.createdAt)),
    ])

  let snapshot: PostSnapshot
  const working: typeof postWorkingCopies.$inferSelect | null =
    workingCopy.length > 0 ? workingCopy[0] : null
  if (working) {
    assertSnapshot(working.snapshot)
    snapshot = working.snapshot
  } else {
    snapshot = await snapshotFromPublishedPost(post)
  }

  return {
    post,
    snapshot,
    workingCopy: working ?? null,
    contentHash: hashPostSnapshot(snapshot),
    categories: categoryRows,
    teamMembers: memberRows,
    media: mediaRows,
    revisions: revisionRows,
    reviews: reviewRows,
  }
}

function baseSnapshot(input: SavePostInput, current?: typeof posts.$inferSelect): PostSnapshot {
  return {
    version: 1,
    slug: input.slug,
    title: input.title,
    seoTitle: input.seoTitle,
    excerpt: input.excerpt,
    content: input.content,
    categoryId: input.categoryId,
    keywords: input.keywords,
    authorId: input.authorId,
    reviewerId: input.reviewerId,
    reviewedAt: null,
    featuredMediaId: input.featuredMediaId,
    image: current?.image ?? null,
    experience: current?.experience ?? null,
    indexable: input.indexable,
    canonicalOverride: input.canonicalOverride,
    canonicalOverrideReason: input.canonicalOverrideReason,
    sortOrder: current?.sortOrder ?? 0,
    slugChangeReason: input.slugChangeReason,
    sources: input.sources,
  }
}

function assertValidDraft(snapshot: PostSnapshot) {
  const issues = validatePostDraft(snapshot)
  if (snapshot.canonicalOverride) {
    try {
      const canonical = new URL(snapshot.canonicalOverride)
      if (canonical.protocol !== 'https:' || canonical.hostname !== 'kocaelidilvekonusma.com') {
        issues.push('Canonical override yalnız canlı HTTPS alan adını kullanabilir.')
      }
    } catch {
      issues.push('Canonical override geçerli mutlak URL olmalı.')
    }
    if (!snapshot.canonicalOverrideReason || snapshot.canonicalOverrideReason.length < 10) {
      issues.push('Canonical override için en az 10 karakterlik gerekçe zorunludur.')
    }
  } else {
    snapshot.canonicalOverrideReason = null
  }
  if (issues.length) throw new ContentPolicyError(issues)
}

export async function createAdminPost(input: SavePostInput, actorId: string) {
  const snapshot = baseSnapshot(input)
  assertValidDraft(snapshot)
  const id = randomUUID()
  const contentHash = hashPostSnapshot(snapshot)
  const timestamp = nowDateTime()

  await getDatabase().transaction(async (transaction) => {
    await transaction.insert(posts).values({
      id,
      slug: snapshot.slug,
      title: snapshot.title,
      seoTitle: snapshot.seoTitle,
      excerpt: snapshot.excerpt,
      content: snapshot.content,
      status: 'draft',
      scheduledAt: null,
      publishedAt: null,
      publishedLabel: null,
      contentUpdatedAt: null,
      contentUpdatedLabel: null,
      authorId: snapshot.authorId,
      reviewerId: snapshot.reviewerId,
      reviewedAt: null,
      categoryId: snapshot.categoryId,
      featuredMediaId: snapshot.featuredMediaId,
      indexable: false,
      canonicalOverride: snapshot.canonicalOverride,
      keywords: snapshot.keywords,
      image: snapshot.image,
      experience: snapshot.experience,
      sortOrder: snapshot.sortOrder,
      updatedAt: timestamp,
    })
    await transaction.insert(postWorkingCopies).values({
      postId: id,
      editorId: actorId,
      status: 'draft',
      snapshot,
      contentHash,
      scheduledAt: null,
      updatedAt: timestamp,
    })
    await transaction.insert(postRevisions).values({
      postId: id,
      editorId: actorId,
      snapshot,
      changeNote: input.changeNote ?? 'İlk taslak',
    })
    await transaction.insert(auditLogs).values({
      actorId,
      action: 'post.created',
      entityType: 'post',
      entityId: id,
      context: { status: 'draft' },
    })
  })
  return id
}

export async function saveAdminPost(postId: string, input: SavePostInput, actorId: string) {
  const current = await findPost(postId)
  const snapshot = baseSnapshot(input, current)
  assertValidDraft(snapshot)

  if (snapshot.slug !== current.slug) {
    if (!input.slugChangeAcknowledged || !input.slugChangeReason || input.slugChangeReason.length < 10) {
      throw new ContentPolicyError([
        'Slug değişikliği için yönlendirme uyarısını onaylayın ve en az 10 karakterlik gerekçe yazın.',
      ])
    }
  } else {
    snapshot.slugChangeReason = null
  }

  const existing = await getDatabase()
    .select()
    .from(postWorkingCopies)
    .where(eq(postWorkingCopies.postId, postId))
    .limit(1)
  let previousSnapshot: PostSnapshot
  if (existing[0]) {
    assertSnapshot(existing[0].snapshot)
    previousSnapshot = existing[0].snapshot
  } else {
    previousSnapshot = await snapshotFromPublishedPost(current)
  }
  if (input.expectedContentHash !== hashPostSnapshot(previousSnapshot)) {
    throw new Error('Bu çalışma kopyası başka bir oturumda değişti. Sayfayı yenileyip farkları tekrar uygulayın.')
  }
  const timestamp = nowDateTime()

  await getDatabase().transaction(async (transaction) => {
    const [lockedWorking] = await transaction
      .select({ contentHash: postWorkingCopies.contentHash })
      .from(postWorkingCopies)
      .where(eq(postWorkingCopies.postId, postId))
      .limit(1)
      .for('update')
    const lockedHash = lockedWorking?.contentHash ?? hashPostSnapshot(previousSnapshot)
    if (lockedHash !== input.expectedContentHash) {
      throw new Error('Eş zamanlı düzenleme algılandı; hiçbir değişiklik kaydedilmedi.')
    }
    await transaction.insert(postRevisions).values({
      postId,
      editorId: actorId,
      snapshot: previousSnapshot,
      changeNote: input.changeNote ?? 'Taslak güncellendi',
    })
    await transaction
      .insert(postWorkingCopies)
      .values({
        postId,
        editorId: actorId,
        status: 'draft',
        snapshot,
        contentHash: hashPostSnapshot(snapshot),
        scheduledAt: null,
        updatedAt: timestamp,
      })
      .onDuplicateKeyUpdate({
        set: {
          editorId: actorId,
          status: 'draft',
          snapshot,
          contentHash: hashPostSnapshot(snapshot),
          scheduledAt: null,
          updatedAt: timestamp,
        },
      })
    if (current.status !== 'published') {
      await transaction.update(posts).set({
        ...(current.publishedAt
          ? {}
          : {
              slug: snapshot.slug,
              title: snapshot.title,
              seoTitle: snapshot.seoTitle,
              excerpt: snapshot.excerpt,
              content: snapshot.content,
              authorId: snapshot.authorId,
              reviewerId: snapshot.reviewerId,
              categoryId: snapshot.categoryId,
              featuredMediaId: snapshot.featuredMediaId,
              canonicalOverride: snapshot.canonicalOverride,
              keywords: snapshot.keywords,
            }),
        status: 'draft',
        updatedAt: timestamp,
      }).where(eq(posts.id, postId))
    }
    await transaction.insert(auditLogs).values({
      actorId,
      action: 'post.draft_saved',
      entityType: 'post',
      entityId: postId,
      context: { liveStatus: current.status, slugChanged: snapshot.slug !== current.slug },
    })
  })
}

export async function submitPostForReview(postId: string, actorId: string) {
  const current = await findPost(postId)
  const [working] = await getDatabase()
    .select()
    .from(postWorkingCopies)
    .where(eq(postWorkingCopies.postId, postId))
    .limit(1)
  if (!working) throw new Error('Önce çalışma kopyasını kaydedin.')
  assertSnapshot(working.snapshot)
  assertPostTransition(working.status, 'in_review')
  assertValidDraft(working.snapshot)
  const timestamp = nowDateTime()
  await getDatabase().transaction(async (transaction) => {
    await transaction
      .update(postWorkingCopies)
      .set({ status: 'in_review', scheduledAt: null, updatedAt: timestamp })
      .where(eq(postWorkingCopies.postId, postId))
    if (current.status !== 'published') {
      await transaction.update(posts).set({ status: 'in_review', updatedAt: timestamp }).where(eq(posts.id, postId))
    }
    await transaction.insert(auditLogs).values({
      actorId,
      action: 'post.review_requested',
      entityType: 'post',
      entityId: postId,
      context: { contentHash: working.contentHash },
    })
  })
}

export async function reviewPost(
  postId: string,
  decision: 'approved' | 'rejected',
  expertiseSourceUrl: string,
  evidenceReference: string,
  actorId: string,
) {
  const current = await findPost(postId)
  const [working] = await getDatabase()
    .select()
    .from(postWorkingCopies)
    .where(eq(postWorkingCopies.postId, postId))
    .limit(1)
  if (!working || working.status !== 'in_review') throw new Error('Yazı inceleme durumunda değil.')
  assertSnapshot(working.snapshot)
  const reviewSnapshot = working.snapshot
  const reviewerId = reviewSnapshot.reviewerId
  if (!reviewerId) throw new Error('Taslakta doğrulanmış reviewer seçilmemiş.')
  if (!/^https:\/\//i.test(expertiseSourceUrl) || evidenceReference.trim().length < 3) {
    throw new Error('Reviewer uzmanlık kaynağı ve kanıt referansı zorunludur.')
  }
  const reviewerCredentials = await getDatabase()
    .select({ id: credentials.id })
    .from(credentials)
    .where(
      and(
        eq(credentials.teamMemberId, reviewerId),
        eq(credentials.kind, 'expertise'),
        isNotNull(credentials.evidenceReference),
      ),
    )
    .limit(1)
  if (reviewerCredentials.length === 0) {
    throw new Error('Reviewer için kanıtlı uzmanlık kaydı bulunamadı.')
  }
  const [reviewerIdentity] = await getDatabase()
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(and(eq(teamMembers.id, reviewerId), eq(teamMembers.reviewerUserId, actorId)))
    .limit(1)
  if (!reviewerIdentity) {
    throw new Error('Oturum hesabı seçilen reviewer profiliyle doğrulanmış biçimde bağlı değil.')
  }

  const timestamp = nowDateTime()
  await getDatabase().transaction(async (transaction) => {
    await transaction.insert(editorialReviews).values({
      id: randomUUID(),
      postId,
      reviewerId,
      completedAt: today(),
      expertiseSourceUrl,
      evidenceReference: evidenceReference.trim(),
      contentHash: working.contentHash,
      decidedByUserId: actorId,
      status: decision,
      updatedAt: timestamp,
    })
    if (decision === 'rejected') {
      await transaction
        .update(postWorkingCopies)
        .set({ status: 'draft', updatedAt: timestamp })
        .where(eq(postWorkingCopies.postId, postId))
      if (current.status !== 'published') {
        await transaction.update(posts).set({ status: 'draft', updatedAt: timestamp }).where(eq(posts.id, postId))
      }
    }
    await transaction.insert(auditLogs).values({
      actorId,
      action: decision === 'approved' ? 'post.review_approved' : 'post.review_rejected',
      entityType: 'post',
      entityId: postId,
      context: { contentHash: working.contentHash },
    })
  })
}

async function publicationContext(postId: string, snapshot: PostSnapshot, contentHash: string) {
  const [reviewRows, mediaRows, authorRows, authorEvidenceRows, reviewerRows, reviewerEvidenceRows] = await Promise.all([
    getDatabase()
      .select({ completedAt: editorialReviews.completedAt })
      .from(editorialReviews)
      .where(
        and(
          eq(editorialReviews.postId, postId),
          eq(editorialReviews.status, 'approved'),
          eq(editorialReviews.contentHash, contentHash),
        ),
      )
      .orderBy(desc(editorialReviews.createdAt))
      .limit(1),
    snapshot.featuredMediaId
      ? getDatabase().select().from(media).where(eq(media.id, snapshot.featuredMediaId)).limit(1)
      : Promise.resolve([]),
    snapshot.authorId
      ? getDatabase().select({ id: teamMembers.id }).from(teamMembers).where(and(eq(teamMembers.id, snapshot.authorId), eq(teamMembers.status, 'published'))).limit(1)
      : Promise.resolve([]),
    snapshot.authorId
      ? getDatabase().select({ id: credentials.id }).from(credentials).where(and(eq(credentials.teamMemberId, snapshot.authorId), isNotNull(credentials.evidenceReference))).limit(1)
      : Promise.resolve([]),
    snapshot.reviewerId
      ? getDatabase().select({ id: teamMembers.id }).from(teamMembers).where(and(eq(teamMembers.id, snapshot.reviewerId), eq(teamMembers.status, 'published'), isNotNull(teamMembers.reviewerUserId))).limit(1)
      : Promise.resolve([]),
    snapshot.reviewerId
      ? getDatabase().select({ id: credentials.id }).from(credentials).where(and(eq(credentials.teamMemberId, snapshot.reviewerId), eq(credentials.kind, 'expertise'), isNotNull(credentials.evidenceReference))).limit(1)
      : Promise.resolve([]),
  ])
  const latestReview = reviewRows[0]
  return {
    approvedReview: Boolean(latestReview),
    authorVerified: authorRows.length > 0 && authorEvidenceRows.length > 0,
    reviewerVerified: reviewerRows.length > 0 && reviewerEvidenceRows.length > 0,
    reviewedAt: latestReview?.completedAt ?? null,
    media: mediaRows[0] ?? null,
  }
}

async function assertCanonicalTarget(snapshot: PostSnapshot, postId: string) {
  if (!snapshot.canonicalOverride) return
  const canonical = new URL(snapshot.canonicalOverride)
  const targetPath = canonical.pathname
  const ownPath = `/blog/${snapshot.slug}`
  if (targetPath === ownPath) return

  const staticPaths = new Set<string>(Object.values(PAGES).map((page) => page.path))
  if (staticPaths.has(targetPath)) return

  const redirectTarget = await getDatabase()
    .select({ id: redirects.id })
    .from(redirects)
    .where(
      and(
        eq(redirects.sourcePath, targetPath),
        eq(redirects.active, true),
        eq(redirects.validationStatus, 'valid'),
      ),
    )
    .limit(1)
  if (redirectTarget.length > 0) {
    throw new ContentPolicyError(['Canonical hedef başka bir yönlendirme kaynağı olamaz.'])
  }

  const blogMatch = targetPath.match(/^\/blog\/([a-z0-9]+(?:-[a-z0-9]+)*)$/)
  if (blogMatch) {
    const [target] = await getDatabase()
      .select({ id: posts.id, slug: posts.slug, canonicalOverride: posts.canonicalOverride })
      .from(posts)
      .where(
        and(
          eq(posts.slug, blogMatch[1]),
          eq(posts.status, 'published'),
          lte(posts.publishedAt, today()),
        ),
      )
      .limit(1)
    const selfCanonical = target &&
      (!target.canonicalOverride || target.canonicalOverride === `${SITE.url}${targetPath}`)
    if (target && target.id !== postId && selfCanonical) return
  }

  const teamMatch = targetPath.match(/^\/ekibimiz\/([a-z0-9]+(?:-[a-z0-9]+)*)$/)
  if (teamMatch) {
    const [target] = await getDatabase()
      .select({ id: teamMembers.id })
      .from(teamMembers)
      .where(and(eq(teamMembers.slug, teamMatch[1]), eq(teamMembers.status, 'published')))
      .limit(1)
    if (target) return
  }

  throw new ContentPolicyError([
    'Canonical override yayımdaki, self-canonical ve doğrudan 200 veren bir hedefe bağlanmalı.',
  ])
}

export async function transitionPost(
  postId: string,
  target: PostStatus,
  actorId: string,
  scheduledAt?: string | null,
) {
  const current = await findPost(postId)
  const [working] = await getDatabase()
    .select()
    .from(postWorkingCopies)
    .where(eq(postWorkingCopies.postId, postId))
    .limit(1)
  const workflowStatus = working?.status ?? current.status
  assertPostTransition(workflowStatus, target)
  const timestamp = nowDateTime()

  if (target === 'archived') {
    await getDatabase().transaction(async (transaction) => {
      await transaction.update(posts).set({ status: 'archived', indexable: false, updatedAt: timestamp }).where(eq(posts.id, postId))
      await transaction.delete(postWorkingCopies).where(eq(postWorkingCopies.postId, postId))
      await transaction.insert(auditLogs).values({ actorId, action: 'post.archived', entityType: 'post', entityId: postId })
    })
    return {
      publicContentChanged: current.status === 'published',
      previousSlug: current.slug,
      slug: current.slug,
    }
  }

  if (target === 'draft') {
    const snapshot = working?.snapshot ?? (await snapshotFromPublishedPost(current))
    assertSnapshot(snapshot)
    await getDatabase().transaction(async (transaction) => {
      await transaction
        .insert(postWorkingCopies)
        .values({ postId, editorId: actorId, status: 'draft', snapshot, contentHash: hashPostSnapshot(snapshot), scheduledAt: null, updatedAt: timestamp })
        .onDuplicateKeyUpdate({ set: { editorId: actorId, status: 'draft', scheduledAt: null, updatedAt: timestamp } })
      if (current.status !== 'published') {
        await transaction.update(posts).set({ status: 'draft', updatedAt: timestamp }).where(eq(posts.id, postId))
      }
      await transaction.insert(auditLogs).values({ actorId, action: 'post.returned_to_draft', entityType: 'post', entityId: postId })
    })
    return { publicContentChanged: false as const, previousSlug: current.slug, slug: current.slug }
  }

  if (!working) throw new Error('Yayımlanacak çalışma kopyası bulunamadı.')
  assertSnapshot(working.snapshot)
  const context = await publicationContext(postId, working.snapshot, working.contentHash)
  const publishInput = { ...working.snapshot, reviewedAt: context.reviewedAt }
  const issues = validateForPublication(publishInput, context)
  if (issues.length) throw new ContentPolicyError(issues)
  await assertCanonicalTarget(working.snapshot, postId)

  if (target === 'scheduled') {
    if (!scheduledAt || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(scheduledAt)) {
      throw new Error('Geçerli yayın tarihi ve saati zorunludur.')
    }
    const mysqlSchedule = scheduledAt.replace('T', ' ') + ':00'
    if (new Date(`${scheduledAt}:00+03:00`).getTime() <= Date.now()) {
      throw new Error('Zamanlanmış yayın gelecekte olmalı.')
    }
    await getDatabase().transaction(async (transaction) => {
      await transaction.update(postWorkingCopies).set({ status: 'scheduled', scheduledAt: mysqlSchedule, updatedAt: timestamp }).where(eq(postWorkingCopies.postId, postId))
      if (current.status !== 'published') {
        await transaction.update(posts).set({ status: 'scheduled', scheduledAt: mysqlSchedule, updatedAt: timestamp }).where(eq(posts.id, postId))
      }
      await transaction.insert(auditLogs).values({ actorId, action: 'post.scheduled', entityType: 'post', entityId: postId, context: { scheduledAt: mysqlSchedule } })
    })
    return { publicContentChanged: false as const, previousSlug: current.slug, slug: current.slug }
  }

  if (target !== 'published') throw new Error('Desteklenmeyen durum geçişi.')
  const snapshot = working.snapshot
  const publicationDate = current.publishedAt ?? today()
  const isExistingPublication = Boolean(current.publishedAt)
  const previousSnapshot = await snapshotFromPublishedPost(current)
  const mediaImage: ArticleImage | null = context.media
    ? {
        path: `/media/${context.media.avifStorageKey ?? context.media.storageKey}`,
        alt: context.media.altText,
        caption: context.media.caption!,
        context: context.media.context!,
        width: context.media.width,
        height: context.media.height,
      }
    : snapshot.image

  await getDatabase().transaction(async (transaction) => {
    const [lockedWorking] = await transaction
      .select({ contentHash: postWorkingCopies.contentHash })
      .from(postWorkingCopies)
      .where(eq(postWorkingCopies.postId, postId))
      .limit(1)
      .for('update')
    if (lockedWorking?.contentHash !== working.contentHash) {
      throw new Error('Çalışma kopyası yayın kontrolünden sonra değişti; yayın iptal edildi.')
    }
    await transaction.insert(postRevisions).values({
      postId,
      editorId: actorId,
      snapshot: previousSnapshot,
      changeNote: isExistingPublication ? 'Yayın öncesi canlı sürüm' : 'İlk yayın öncesi taslak',
    })
    const redirectPlan = snapshot.slug !== current.slug
      ? await writeValidatedRedirect(transaction, {
          sourcePath: `/blog/${current.slug}`,
          targetPath: `/blog/${snapshot.slug}`,
          reason: snapshot.slugChangeReason!,
          checkedAt: timestamp,
        })
      : null
    await transaction.update(posts).set({
      slug: snapshot.slug,
      title: snapshot.title,
      seoTitle: snapshot.seoTitle,
      excerpt: snapshot.excerpt,
      content: snapshot.content,
      status: 'published',
      publishedAt: publicationDate,
      publishedLabel: current.publishedLabel ?? turkishDate(publicationDate),
      scheduledAt: null,
      contentUpdatedAt: isExistingPublication ? today() : null,
      contentUpdatedLabel: isExistingPublication ? turkishDate(today()) : null,
      authorId: snapshot.authorId,
      reviewerId: snapshot.reviewerId,
      reviewedAt: context.reviewedAt,
      categoryId: snapshot.categoryId,
      featuredMediaId: snapshot.featuredMediaId,
      indexable: snapshot.indexable,
      canonicalOverride: snapshot.canonicalOverride,
      keywords: snapshot.keywords,
      image: mediaImage,
      experience: snapshot.experience,
      sortOrder: snapshot.sortOrder,
      updatedAt: timestamp,
    }).where(eq(posts.id, postId))
    await transaction.delete(sources).where(eq(sources.postId, postId))
    const newSources = sourceValues(postId, snapshot.sources)
    if (newSources.length) await transaction.insert(sources).values(newSources)
    await transaction.delete(postWorkingCopies).where(eq(postWorkingCopies.postId, postId))
    await transaction.insert(auditLogs).values({
      actorId,
      action: 'post.published',
      entityType: 'post',
      entityId: postId,
      context: { slug: snapshot.slug, previousSlug: current.slug, contentHash: working.contentHash, canonicalOverrideReason: snapshot.canonicalOverrideReason, flattenedRedirects: redirectPlan?.flattenedIds.length ?? 0 },
    })
  })
  return {
    publicContentChanged: true as const,
    previousSlug: current.slug,
    slug: snapshot.slug,
  }
}

export async function restorePostRevision(postId: string, revisionId: number, actorId: string) {
  const current = await findPost(postId)
  const [revision] = await getDatabase()
    .select()
    .from(postRevisions)
    .where(and(eq(postRevisions.id, revisionId), eq(postRevisions.postId, postId)))
    .limit(1)
  if (!revision) throw new Error('Revizyon bulunamadı.')
  assertSnapshot(revision.snapshot)
  const restoredSnapshot = revision.snapshot
  assertValidDraft(restoredSnapshot)
  const timestamp = nowDateTime()
  await getDatabase().transaction(async (transaction) => {
    await transaction
      .insert(postWorkingCopies)
      .values({
        postId,
        editorId: actorId,
        status: 'draft',
        snapshot: restoredSnapshot,
        contentHash: hashPostSnapshot(restoredSnapshot),
        scheduledAt: null,
        updatedAt: timestamp,
      })
      .onDuplicateKeyUpdate({
        set: {
          editorId: actorId,
          status: 'draft',
          snapshot: restoredSnapshot,
          contentHash: hashPostSnapshot(restoredSnapshot),
          scheduledAt: null,
          updatedAt: timestamp,
        },
      })
    if (current.status !== 'published') {
      await transaction.update(posts).set({ status: 'draft', updatedAt: timestamp }).where(eq(posts.id, postId))
    }
    await transaction.insert(auditLogs).values({
      actorId,
      action: 'post.revision_restored_to_draft',
      entityType: 'post',
      entityId: postId,
      context: { revisionId },
    })
  })
}
