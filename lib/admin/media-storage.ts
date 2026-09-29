import 'server-only'

import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

export const MAX_MEDIA_BYTES = 10 * 1024 * 1024
export const MAX_MEDIA_PIXELS = 40_000_000
export const MAX_MEDIA_EDGE = 2400

const SUPPORTED_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif'])

export type PreparedMedia = {
  id: string
  storageKey: string
  originalFilename: string
  originalStorageKey: null
  webpStorageKey: string
  avifStorageKey: string
  mimeType: 'image/webp'
  byteSize: number
  width: number
  height: number
  cleanup: () => Promise<void>
}

export function mediaRoot() {
  const configured = process.env.MEDIA_ROOT?.trim()
  if (configured) {
    if (!path.isAbsolute(configured)) throw new Error('MEDIA_ROOT mutlak bir dosya yolu olmalı.')
    return configured
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Production ortamında kalıcı MEDIA_ROOT tanımlanmalı.')
  }
  return path.join(process.cwd(), '.media')
}

export function resolveMediaStorageKey(storageKey: string) {
  if (!/^[a-f0-9-]{36}\/(?:image\.(?:webp|avif))$/.test(storageKey)) {
    throw new Error('Geçersiz medya anahtarı.')
  }
  const root = mediaRoot()
  const resolved = path.resolve(root, storageKey)
  if (!resolved.startsWith(`${path.resolve(root)}${path.sep}`)) {
    throw new Error('Medya yolu kalıcı depolama alanının dışında.')
  }
  return resolved
}

export async function prepareMediaUpload(file: File): Promise<PreparedMedia> {
  if (!(file instanceof File) || file.size === 0) throw new Error('Bir görsel dosyası seçin.')
  if (file.size > MAX_MEDIA_BYTES) throw new Error('Görsel en fazla 10 MB olabilir.')

  const buffer = Buffer.from(await file.arrayBuffer())
  const decoder = sharp(buffer, { limitInputPixels: MAX_MEDIA_PIXELS, animated: false, failOn: 'error' })
  const metadata = await decoder.metadata()
  if (!metadata.format || !SUPPORTED_FORMATS.has(metadata.format)) {
    throw new Error('Yalnız JPEG, PNG, WebP veya AVIF görseller kabul edilir.')
  }
  if (!metadata.width || !metadata.height || metadata.pages && metadata.pages > 1) {
    throw new Error('Görsel boyutları okunamadı veya hareketli görsel desteklenmiyor.')
  }
  if (metadata.width * metadata.height > MAX_MEDIA_PIXELS) {
    throw new Error('Görsel en fazla 40 megapiksel olabilir.')
  }

  const id = randomUUID()
  const directory = path.join(mediaRoot(), id)
  const webpStorageKey = `${id}/image.webp`
  const avifStorageKey = `${id}/image.avif`
  const webpPath = resolveMediaStorageKey(webpStorageKey)
  const avifPath = resolveMediaStorageKey(avifStorageKey)
  await mkdir(directory, { recursive: true, mode: 0o750 })

  const pipeline = sharp(buffer, { limitInputPixels: MAX_MEDIA_PIXELS, animated: false })
    .rotate()
    .resize({ width: MAX_MEDIA_EDGE, height: MAX_MEDIA_EDGE, fit: 'inside', withoutEnlargement: true })

  try {
    const [webp, avif] = await Promise.all([
      pipeline.clone().webp({ quality: 82, effort: 5 }).toBuffer({ resolveWithObject: true }),
      pipeline.clone().avif({ quality: 55, effort: 5 }).toBuffer({ resolveWithObject: true }),
    ])
    await Promise.all([
      writeFile(webpPath, webp.data, { flag: 'wx', mode: 0o640 }),
      writeFile(avifPath, avif.data, { flag: 'wx', mode: 0o640 }),
    ])
    return {
      id,
      storageKey: webpStorageKey,
      originalFilename: `image.${metadata.format}`,
      originalStorageKey: null,
      webpStorageKey,
      avifStorageKey,
      mimeType: 'image/webp',
      byteSize: webp.data.byteLength,
      width: webp.info.width,
      height: webp.info.height,
      cleanup: async () => {
        await Promise.allSettled([unlink(webpPath), unlink(avifPath)])
      },
    }
  } catch (error) {
    await Promise.allSettled([unlink(webpPath), unlink(avifPath)])
    throw error
  }
}
