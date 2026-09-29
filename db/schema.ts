import {
  bigint,
  boolean,
  char,
  date,
  datetime,
  index,
  int,
  json,
  mediumtext,
  mysqlEnum,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'
import type { ArticleExperience, ArticleImage } from '@/lib/articles'
import type {
  VerifiedEducation,
  VerifiedExpertise,
  VerifiedExternalProfile,
} from '@/lib/team'

function timestamps() {
  return {
    createdAt: datetime('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }
}

export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    email: varchar('email', { length: 320 }).notNull(),
    displayName: varchar('display_name', { length: 160 }).notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: varchar('image', { length: 1024 }),
    role: mysqlEnum('role', ['admin', 'editor', 'clinical_reviewer'])
      .default('editor')
      .notNull(),
    status: mysqlEnum('status', ['invited', 'active', 'suspended']).default('invited').notNull(),
    mfaEnabled: boolean('mfa_enabled').default(false).notNull(),
    createdAt: datetime('created_at', { mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    lastLoginAt: datetime('last_login_at', { mode: 'date' }),
  },
  (table) => [uniqueIndex('users_email_uq').on(table.email), index('users_status_idx').on(table.status)],
)

export const sessions = mysqlTable(
  'sessions',
  {
    id: varchar('id', { length: 128 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token_hash', { length: 128 }).notNull(),
    expiresAt: datetime('expires_at', { mode: 'date' }).notNull(),
    ipAddress: varchar('ip_address', { length: 64 }),
    userAgent: text('user_agent'),
    revokedAt: datetime('revoked_at', { mode: 'date' }),
    createdAt: datetime('created_at', { mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    lastSeenAt: datetime('last_seen_at', { mode: 'date' }),
  },
  (table) => [
    uniqueIndex('sessions_token_uq').on(table.token),
    index('sessions_user_idx').on(table.userId),
    index('sessions_expiry_idx').on(table.expiresAt),
  ],
)

export const accounts = mysqlTable(
  'auth_accounts',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    issuer: varchar('issuer', { length: 255 }).notNull(),
    accountId: varchar('account_id', { length: 255 }).notNull(),
    providerId: varchar('provider_id', { length: 255 }).notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: datetime('access_token_expires_at', { mode: 'date' }),
    refreshTokenExpiresAt: datetime('refresh_token_expires_at', { mode: 'date' }),
    scope: text('scope'),
    password: text('password'),
    createdAt: datetime('created_at', { mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex('auth_accounts_identity_uq').on(table.issuer, table.accountId),
    index('auth_accounts_user_idx').on(table.userId),
  ],
)

export const verifications = mysqlTable(
  'auth_verifications',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    identifier: varchar('identifier', { length: 320 }).notNull(),
    value: text('value').notNull(),
    expiresAt: datetime('expires_at', { mode: 'date' }).notNull(),
    createdAt: datetime('created_at', { mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index('auth_verifications_identifier_idx').on(table.identifier)],
)

export const twoFactors = mysqlTable(
  'auth_two_factors',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    secret: varchar('secret', { length: 512 }).notNull(),
    backupCodes: text('backup_codes').notNull(),
    verified: boolean('verified').default(true).notNull(),
    failedVerificationCount: int('failed_verification_count', { unsigned: true })
      .default(0)
      .notNull(),
    lockedUntil: datetime('locked_until', { mode: 'date' }),
  },
  (table) => [
    uniqueIndex('auth_two_factors_user_uq').on(table.userId),
    index('auth_two_factors_secret_idx').on(table.secret),
  ],
)

export const authRateLimits = mysqlTable(
  'auth_rate_limits',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    key: varchar('rate_key', { length: 255 }).notNull(),
    count: int('count', { unsigned: true }).notNull(),
    lastRequest: bigint('last_request', { mode: 'number', unsigned: true }).notNull(),
  },
  (table) => [uniqueIndex('auth_rate_limits_key_uq').on(table.key)],
)

export const categories = mysqlTable(
  'categories',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    name: varchar('name', { length: 160 }).notNull(),
    slug: varchar('slug', { length: 180 }).notNull(),
    description: text('description'),
    sortOrder: int('sort_order', { unsigned: true }).default(0).notNull(),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex('categories_name_uq').on(table.name),
    uniqueIndex('categories_slug_uq').on(table.slug),
  ],
)

export const media = mysqlTable(
  'media',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    storageKey: varchar('storage_key', { length: 512 }).notNull(),
    originalFilename: varchar('original_filename', { length: 255 }),
    originalStorageKey: varchar('original_storage_key', { length: 512 }),
    webpStorageKey: varchar('webp_storage_key', { length: 512 }),
    avifStorageKey: varchar('avif_storage_key', { length: 512 }),
    mimeType: varchar('mime_type', { length: 128 }).notNull(),
    byteSize: bigint('byte_size', { mode: 'number', unsigned: true }).notNull(),
    width: int('width', { unsigned: true }).notNull(),
    height: int('height', { unsigned: true }).notNull(),
    altText: text('alt_text').notNull(),
    caption: text('caption'),
    context: text('context'),
    rightsStatus: mysqlEnum('rights_status', ['pending', 'verified', 'restricted'])
      .default('pending')
      .notNull(),
    rightsEvidenceReference: varchar('rights_evidence_reference', { length: 255 }),
    permissionStatus: mysqlEnum('permission_status', [
      'not_applicable',
      'pending',
      'verified',
      'restricted',
    ])
      .default('pending')
      .notNull(),
    permissionEvidenceReference: varchar('permission_evidence_reference', { length: 255 }),
    uploadedBy: varchar('uploaded_by', { length: 64 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    ...timestamps(),
  },
  (table) => [uniqueIndex('media_storage_key_uq').on(table.storageKey)],
)

export const teamMembers = mysqlTable(
  'team_members',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    slug: varchar('slug', { length: 180 }).notNull(),
    name: varchar('name', { length: 180 }).notNull(),
    role: varchar('role', { length: 180 }).notNull(),
    bio: text('bio').notNull(),
    imagePath: varchar('image_path', { length: 512 }).notNull(),
    accent: varchar('accent', { length: 64 }).notNull(),
    verifiedEducation: json('verified_education').$type<VerifiedEducation[]>().notNull(),
    verifiedExpertise: json('verified_expertise').$type<VerifiedExpertise[]>().notNull(),
    verifiedExternalProfiles: json('verified_external_profiles')
      .$type<VerifiedExternalProfile[]>()
      .notNull(),
    status: mysqlEnum('status', ['draft', 'published', 'archived']).default('published').notNull(),
    sortOrder: int('sort_order', { unsigned: true }).default(0).notNull(),
    featuredMediaId: varchar('featured_media_id', { length: 64 }).references(() => media.id, {
      onDelete: 'set null',
    }),
    reviewerUserId: varchar('reviewer_user_id', { length: 64 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    contentUpdatedAt: date('content_updated_at', { mode: 'string' }),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex('team_slug_uq').on(table.slug),
    uniqueIndex('team_reviewer_user_uq').on(table.reviewerUserId),
    index('team_public_idx').on(table.status, table.sortOrder),
  ],
)

export const credentials = mysqlTable(
  'credentials',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    teamMemberId: varchar('team_member_id', { length: 64 })
      .notNull()
      .references(() => teamMembers.id, { onDelete: 'cascade' }),
    kind: mysqlEnum('kind', ['education', 'expertise', 'external_profile']).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    institution: varchar('institution', { length: 255 }),
    field: varchar('field', { length: 255 }),
    sourceUrl: varchar('source_url', { length: 1024 }).notNull(),
    sourceUrlHash: char('source_url_hash', { length: 64 }).notNull(),
    verifiedAt: date('verified_at', { mode: 'string' }).notNull(),
    evidenceReference: varchar('evidence_reference', { length: 255 }),
    ...timestamps(),
  },
  (table) => [
    index('credentials_member_idx').on(table.teamMemberId),
    uniqueIndex('credentials_source_uq').on(
      table.teamMemberId,
      table.kind,
      table.sourceUrlHash,
    ),
  ],
)

export const posts = mysqlTable(
  'posts',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    slug: varchar('slug', { length: 220 }).notNull(),
    title: varchar('title', { length: 320 }).notNull(),
    seoTitle: varchar('seo_title', { length: 320 }),
    excerpt: text('excerpt').notNull(),
    content: mediumtext('content').notNull(),
    status: mysqlEnum('status', ['draft', 'in_review', 'scheduled', 'published', 'archived'])
      .default('draft')
      .notNull(),
    publishedAt: date('published_at', { mode: 'string' }),
    publishedLabel: varchar('published_label', { length: 64 }),
    scheduledAt: datetime('scheduled_at', { mode: 'string' }),
    contentUpdatedAt: date('content_updated_at', { mode: 'string' }),
    contentUpdatedLabel: varchar('content_updated_label', { length: 64 }),
    authorId: varchar('author_id', { length: 64 }).references(() => teamMembers.id, {
      onDelete: 'set null',
    }),
    reviewerId: varchar('reviewer_id', { length: 64 }).references(() => teamMembers.id, {
      onDelete: 'set null',
    }),
    reviewedAt: date('reviewed_at', { mode: 'string' }),
    categoryId: varchar('category_id', { length: 64 })
      .notNull()
      .references(() => categories.id),
    featuredMediaId: varchar('featured_media_id', { length: 64 }).references(() => media.id, {
      onDelete: 'set null',
    }),
    indexable: boolean('indexable').default(false).notNull(),
    canonicalOverride: varchar('canonical_override', { length: 1024 }),
    keywords: json('keywords').$type<string[]>().notNull(),
    image: json('image').$type<ArticleImage>(),
    experience: json('experience').$type<ArticleExperience>(),
    sortOrder: int('sort_order', { unsigned: true }).default(0).notNull(),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex('posts_slug_uq').on(table.slug),
    index('posts_public_idx').on(table.status, table.indexable, table.publishedAt),
    index('posts_category_idx').on(table.categoryId, table.status),
    index('posts_author_idx').on(table.authorId),
    index('posts_reviewer_idx').on(table.reviewerId),
  ],
)

export const postRevisions = mysqlTable(
  'post_revisions',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
    postId: varchar('post_id', { length: 64 })
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    editorId: varchar('editor_id', { length: 64 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    snapshot: json('snapshot').$type<Record<string, unknown>>().notNull(),
    changeNote: varchar('change_note', { length: 500 }),
    createdAt: datetime('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index('post_revisions_post_idx').on(table.postId, table.createdAt)],
)

export const postWorkingCopies = mysqlTable(
  'post_working_copies',
  {
    postId: varchar('post_id', { length: 64 })
      .primaryKey()
      .references(() => posts.id, { onDelete: 'cascade' }),
    editorId: varchar('editor_id', { length: 64 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    status: mysqlEnum('status', ['draft', 'in_review', 'scheduled']).default('draft').notNull(),
    snapshot: json('snapshot').$type<Record<string, unknown>>().notNull(),
    contentHash: char('content_hash', { length: 64 }).notNull(),
    scheduledAt: datetime('scheduled_at', { mode: 'string' }),
    ...timestamps(),
  },
  (table) => [index('post_working_status_idx').on(table.status, table.scheduledAt)],
)

export const sources = mysqlTable(
  'sources',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
    postId: varchar('post_id', { length: 64 })
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 500 }).notNull(),
    url: varchar('url', { length: 2048 }).notNull(),
    urlHash: char('url_hash', { length: 64 }).notNull(),
    publisher: varchar('publisher', { length: 255 }),
    verifiedAt: date('verified_at', { mode: 'string' }),
    evidenceReference: varchar('evidence_reference', { length: 255 }),
    usageNote: text('usage_note'),
    sortOrder: int('sort_order', { unsigned: true }).default(0).notNull(),
    ...timestamps(),
  },
  (table) => [
    index('sources_post_idx').on(table.postId, table.sortOrder),
    uniqueIndex('sources_post_url_uq').on(table.postId, table.urlHash),
  ],
)

export const editorialReviews = mysqlTable(
  'editorial_reviews',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    postId: varchar('post_id', { length: 64 })
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    reviewerId: varchar('reviewer_id', { length: 64 })
      .notNull()
      .references(() => teamMembers.id),
    completedAt: date('completed_at', { mode: 'string' }),
    expertiseSourceUrl: varchar('expertise_source_url', { length: 1024 }).notNull(),
    evidenceReference: varchar('evidence_reference', { length: 255 }).notNull(),
    contentHash: char('content_hash', { length: 64 }),
    decidedByUserId: varchar('decided_by_user_id', { length: 64 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    status: mysqlEnum('status', ['pending', 'approved', 'rejected']).default('pending').notNull(),
    ...timestamps(),
  },
  (table) => [
    index('reviews_post_idx').on(table.postId, table.status),
    index('reviews_reviewer_idx').on(table.reviewerId),
  ],
)

export const pages = mysqlTable(
  'pages',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    path: varchar('path', { length: 512 }).notNull(),
    name: varchar('name', { length: 320 }).notNull(),
    title: varchar('title', { length: 320 }).notNull(),
    description: text('description').notNull(),
    schemaType: varchar('schema_type', { length: 64 }),
    content: mediumtext('content'),
    status: mysqlEnum('status', ['draft', 'published', 'archived']).default('published').notNull(),
    indexable: boolean('indexable').default(true).notNull(),
    canonicalOverride: varchar('canonical_override', { length: 1024 }),
    contentUpdatedAt: date('content_updated_at', { mode: 'string' }),
    sortOrder: int('sort_order', { unsigned: true }).default(0).notNull(),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex('pages_path_uq').on(table.path),
    index('pages_public_idx').on(table.status, table.indexable, table.sortOrder),
  ],
)

export const siteSettings = mysqlTable('site_settings', {
  key: varchar('key', { length: 120 }).primaryKey(),
  value: json('value').$type<unknown>().notNull(),
  description: varchar('description', { length: 500 }),
  updatedBy: varchar('updated_by', { length: 64 }).references(() => users.id, {
    onDelete: 'set null',
  }),
  ...timestamps(),
})

export const redirects = mysqlTable(
  'redirects',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    sourcePath: varchar('source_path', { length: 512 }).notNull(),
    targetPath: varchar('target_path', { length: 1024 }).notNull(),
    httpCode: int('http_code', { unsigned: true }).default(308).notNull(),
    active: boolean('active').default(true).notNull(),
    reason: varchar('reason', { length: 500 }).notNull(),
    validationStatus: mysqlEnum('validation_status', ['pending', 'valid', 'invalid'])
      .default('pending')
      .notNull(),
    checkedAt: datetime('checked_at', { mode: 'string' }),
    sortOrder: int('sort_order', { unsigned: true }).default(0).notNull(),
    ...timestamps(),
  },
  (table) => [
    uniqueIndex('redirects_source_uq').on(table.sourcePath),
    index('redirects_active_idx').on(table.active, table.sortOrder),
  ],
)

export const auditLogs = mysqlTable(
  'audit_logs',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
    actorId: varchar('actor_id', { length: 64 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    action: varchar('action', { length: 120 }).notNull(),
    entityType: varchar('entity_type', { length: 120 }).notNull(),
    entityId: varchar('entity_id', { length: 128 }).notNull(),
    previousRevisionId: bigint('previous_revision_id', { mode: 'number', unsigned: true }),
    newRevisionId: bigint('new_revision_id', { mode: 'number', unsigned: true }),
    context: json('context').$type<Record<string, unknown>>(),
    createdAt: datetime('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index('audit_entity_idx').on(table.entityType, table.entityId, table.createdAt),
    index('audit_actor_idx').on(table.actorId, table.createdAt),
  ],
)

export type Database = typeof import('./schema')
