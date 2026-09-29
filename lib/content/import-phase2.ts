import type { MySql2Database } from 'drizzle-orm/mysql2'
import type * as schema from '@/db/schema'
import {
  categories,
  credentials,
  editorialReviews,
  pages,
  posts,
  redirects,
  siteSettings,
  teamMembers,
} from '@/db/schema'
import type { Phase2MigrationSnapshot } from '@/lib/content/migration-source'

type Database = MySql2Database<typeof schema>

export async function importPhase2Snapshot(db: Database, snapshot: Phase2MigrationSnapshot) {
  await db.transaction(async (transaction) => {
    for (const row of snapshot.categories) {
      await transaction
        .insert(categories)
        .values(row)
        .onDuplicateKeyUpdate({
          set: {
            name: row.name,
            slug: row.slug,
            description: row.description,
            sortOrder: row.sortOrder,
          },
        })
    }

    for (const row of snapshot.teamMembers) {
      await transaction
        .insert(teamMembers)
        .values(row)
        .onDuplicateKeyUpdate({
          set: {
            slug: row.slug,
            name: row.name,
            role: row.role,
            bio: row.bio,
            imagePath: row.imagePath,
            accent: row.accent,
            verifiedEducation: row.verifiedEducation,
            verifiedExpertise: row.verifiedExpertise,
            verifiedExternalProfiles: row.verifiedExternalProfiles,
            status: row.status,
            sortOrder: row.sortOrder,
            featuredMediaId: row.featuredMediaId,
            contentUpdatedAt: row.contentUpdatedAt,
          },
        })
    }

    for (const row of snapshot.credentials) {
      await transaction
        .insert(credentials)
        .values(row)
        .onDuplicateKeyUpdate({
          set: {
            teamMemberId: row.teamMemberId,
            kind: row.kind,
            name: row.name,
            institution: row.institution,
            field: row.field,
            sourceUrl: row.sourceUrl,
            sourceUrlHash: row.sourceUrlHash,
            verifiedAt: row.verifiedAt,
            evidenceReference: row.evidenceReference,
          },
        })
    }

    for (const row of snapshot.posts) {
      await transaction
        .insert(posts)
        .values(row)
        .onDuplicateKeyUpdate({
          set: {
            slug: row.slug,
            title: row.title,
            seoTitle: row.seoTitle,
            excerpt: row.excerpt,
            content: row.content,
            status: row.status,
            publishedAt: row.publishedAt,
            publishedLabel: row.publishedLabel,
            contentUpdatedAt: row.contentUpdatedAt,
            contentUpdatedLabel: row.contentUpdatedLabel,
            authorId: row.authorId,
            reviewerId: row.reviewerId,
            reviewedAt: row.reviewedAt,
            categoryId: row.categoryId,
            featuredMediaId: row.featuredMediaId,
            indexable: row.indexable,
            canonicalOverride: row.canonicalOverride,
            keywords: row.keywords,
            image: row.image,
            experience: row.experience,
            sortOrder: row.sortOrder,
          },
        })
    }

    for (const row of snapshot.editorialReviews) {
      await transaction
        .insert(editorialReviews)
        .values(row)
        .onDuplicateKeyUpdate({
          set: {
            postId: row.postId,
            reviewerId: row.reviewerId,
            completedAt: row.completedAt,
            expertiseSourceUrl: row.expertiseSourceUrl,
            evidenceReference: row.evidenceReference,
            status: row.status,
          },
        })
    }

    for (const row of snapshot.pages) {
      await transaction
        .insert(pages)
        .values(row)
        .onDuplicateKeyUpdate({
          set: {
            path: row.path,
            name: row.name,
            title: row.title,
            description: row.description,
            schemaType: row.schemaType,
            content: row.content,
            status: row.status,
            indexable: row.indexable,
            canonicalOverride: row.canonicalOverride,
            contentUpdatedAt: row.contentUpdatedAt,
            sortOrder: row.sortOrder,
          },
        })
    }

    for (const row of snapshot.siteSettings) {
      await transaction
        .insert(siteSettings)
        .values(row)
        .onDuplicateKeyUpdate({
          set: {
            value: row.value,
            description: row.description,
            updatedBy: row.updatedBy,
          },
        })
    }

    for (const row of snapshot.redirects) {
      await transaction
        .insert(redirects)
        .values(row)
        .onDuplicateKeyUpdate({
          set: {
            sourcePath: row.sourcePath,
            targetPath: row.targetPath,
            httpCode: row.httpCode,
            active: row.active,
            reason: row.reason,
            validationStatus: row.validationStatus,
            checkedAt: row.checkedAt,
            sortOrder: row.sortOrder,
          },
        })
    }
  })
}
