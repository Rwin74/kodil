export const AUTH_COOKIE_PREFIX = 'kodil-admin'

export function authCookieAttributes(production: boolean) {
  return {
    httpOnly: true,
    secure: production,
    sameSite: 'lax' as const,
    path: '/',
  }
}
