import { readFile } from 'node:fs/promises'
import { and, eq, or } from 'drizzle-orm'
import { getDatabase } from '@/db/client'
import { media } from '@/db/schema'
import { resolveMediaStorageKey } from '@/lib/admin/media-storage'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params
  const storageKey = key.join('/')
  const [record] = await getDatabase()
    .select({
      webpStorageKey: media.webpStorageKey,
      avifStorageKey: media.avifStorageKey,
      permissionStatus: media.permissionStatus,
    })
    .from(media)
    .where(
      and(
        eq(media.rightsStatus, 'verified'),
        or(eq(media.permissionStatus, 'verified'), eq(media.permissionStatus, 'not_applicable')),
        or(eq(media.webpStorageKey, storageKey), eq(media.avifStorageKey, storageKey)),
      ),
    )
    .limit(1)

  if (!record) return new Response('Bulunamadı', { status: 404 })

  try {
    const body = await readFile(resolveMediaStorageKey(storageKey))
    const contentType = storageKey.endsWith('.avif') ? 'image/avif' : 'image/webp'
    return new Response(new Uint8Array(body), {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': contentType,
        'Content-Length': String(body.byteLength),
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new Response('Bulunamadı', { status: 404 })
  }
}
