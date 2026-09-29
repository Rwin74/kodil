import { createHmac, timingSafeEqual } from 'node:crypto'

const MAX_LIFETIME_SECONDS = 24 * 60 * 60

function signingSecret() {
  const value = process.env.PREVIEW_SIGNING_SECRET?.trim()
  if (!value || value.length < 32) {
    throw new Error('PREVIEW_SIGNING_SECRET en az 32 karakter olmalı.')
  }
  return value
}

function signatureFor(postId: string, contentHash: string, expires: number) {
  return createHmac('sha256', signingSecret()).update(`${postId}:${contentHash}:${expires}`).digest('hex')
}

export function createPreviewToken(postId: string, contentHash: string, now = Date.now()) {
  const expires = Math.floor(now / 1000) + MAX_LIFETIME_SECONDS
  return { expires, signature: signatureFor(postId, contentHash, expires) }
}

export function verifyPreviewToken(
  postId: string,
  contentHash: string | null | undefined,
  expiresValue: string | null | undefined,
  signature: string | null | undefined,
  now = Date.now(),
) {
  if (!contentHash || !/^[a-f0-9]{64}$/.test(contentHash) || !expiresValue || !signature || !/^\d+$/.test(expiresValue) || !/^[a-f0-9]{64}$/.test(signature)) {
    return false
  }
  const expires = Number(expiresValue)
  const nowSeconds = Math.floor(now / 1000)
  if (expires < nowSeconds || expires > nowSeconds + MAX_LIFETIME_SECONDS) return false
  const expected = Buffer.from(signatureFor(postId, contentHash, expires), 'hex')
  const actual = Buffer.from(signature, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
