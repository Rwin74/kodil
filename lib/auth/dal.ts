import 'server-only'

import { cache } from 'react'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getDatabase } from '@/db/client'
import { users } from '@/db/schema'
import { auth } from '@/lib/auth/auth'
import {
  hasPermission,
  isAdminRole,
  type AdminPermission,
  type AdminRole,
} from '@/lib/auth/permissions'
import { assertAuthRuntimeConfiguration } from '@/lib/auth/runtime-config'

export type AdminSessionDto = Readonly<{
  user: Readonly<{
    id: string
    email: string
    displayName: string
    role: AdminRole
  }>
  sessionId: string
}>

export class AdminAuthorizationError extends Error {
  constructor(message = 'Bu işlem için yetkiniz yok.') {
    super(message)
    this.name = 'AdminAuthorizationError'
  }
}

const readAuthoritativeSession = cache(async () => {
  assertAuthRuntimeConfiguration()
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const [adminUser] = await getDatabase()
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      role: users.role,
      status: users.status,
      mfaEnabled: users.mfaEnabled,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  return adminUser ? { session, adminUser } : null
})

function toAdminSessionDto(result: NonNullable<Awaited<ReturnType<typeof readAuthoritativeSession>>>) {
  const role = result.adminUser.role
  if (!isAdminRole(role)) throw new AdminAuthorizationError('Geçersiz yönetim rolü.')

  return Object.freeze({
    user: Object.freeze({
      id: result.adminUser.id,
      email: result.adminUser.email,
      displayName: result.adminUser.displayName,
      role,
    }),
    sessionId: result.session.session.id,
  }) satisfies AdminSessionDto
}

export async function requireEnrollmentSession() {
  const result = await readAuthoritativeSession()
  if (!result) redirect('/yonetim/giris')
  if (result.adminUser.status !== 'active') redirect('/yonetim/giris?durum=hesap-kapali')
  if (!isAdminRole(result.adminUser.role)) redirect('/yonetim/giris?durum=yetkisiz')
  if (result.adminUser.mfaEnabled) redirect('/yonetim')
  return toAdminSessionDto(result)
}

export async function requireAdminSession() {
  const result = await readAuthoritativeSession()
  if (!result) redirect('/yonetim/giris')
  if (result.adminUser.status !== 'active') redirect('/yonetim/giris?durum=hesap-kapali')
  if (!result.adminUser.mfaEnabled) redirect('/yonetim/mfa-kurulum')
  return toAdminSessionDto(result)
}

export async function requirePermission(permission: AdminPermission) {
  const session = await requireAdminSession()
  if (!hasPermission(session.user.role, permission)) throw new AdminAuthorizationError()
  return session
}
