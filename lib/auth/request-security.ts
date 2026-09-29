import 'server-only'

import { AUTH_BASE_URL } from '@/lib/auth/runtime-config'

export class UnsafeMutationRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnsafeMutationRequestError'
  }
}

export function assertTrustedMutationRequest(requestHeaders: Headers) {
  const fetchSite = requestHeaders.get('sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin') {
    throw new UnsafeMutationRequestError('Çapraz kaynaklı mutation isteği reddedildi.')
  }

  const origin = requestHeaders.get('origin')
  if (!origin) {
    if (process.env.NODE_ENV === 'production') {
      throw new UnsafeMutationRequestError('Origin başlığı olmayan mutation isteği reddedildi.')
    }
    return
  }

  if (origin !== new URL(AUTH_BASE_URL).origin) {
    throw new UnsafeMutationRequestError('Güvenilmeyen origin mutation isteği reddedildi.')
  }
}
