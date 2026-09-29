import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { hashPassword } from 'better-auth/crypto'
import { closeDatabasePool, getDatabase } from '@/db/client'
import { accounts, auditLogs, users } from '@/db/schema'

function requiredEnvironment(name: 'ADMIN_EMAIL' | 'ADMIN_NAME' | 'ADMIN_PASSWORD') {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} tanımlı değil.`)
  return value
}

function validatePassword(password: string) {
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/]
  if (password.length < 12 || password.length > 128 || !classes.every((pattern) => pattern.test(password))) {
    throw new Error('ADMIN_PASSWORD 12–128 karakter; küçük/büyük harf, rakam ve sembol içermeli.')
  }
}

async function main() {
  const email = requiredEnvironment('ADMIN_EMAIL').toLowerCase()
  const displayName = requiredEnvironment('ADMIN_NAME')
  const password = requiredEnvironment('ADMIN_PASSWORD')

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('ADMIN_EMAIL geçerli değil.')
  if (displayName.length > 160) throw new Error('ADMIN_NAME en fazla 160 karakter olabilir.')
  validatePassword(password)

  const database = getDatabase()
  const [existing] = await database.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
  if (existing) throw new Error('Bu e-posta ile bir yönetim hesabı zaten var; mevcut hesap değiştirilmedi.')

  const userId = randomUUID()
  const accountId = randomUUID()
  const passwordHash = await hashPassword(password)

  await database.transaction(async (transaction) => {
    await transaction.insert(users).values({
      id: userId,
      email,
      displayName,
      emailVerified: true,
      role: 'admin',
      status: 'active',
      mfaEnabled: false,
    })
    await transaction.insert(accounts).values({
      id: accountId,
      userId,
      issuer: 'local:credential',
      accountId: userId,
      providerId: 'credential',
      password: passwordHash,
    })
    await transaction.insert(auditLogs).values({
      actorId: userId,
      action: 'auth.admin_bootstrapped',
      entityType: 'user',
      entityId: userId,
      context: { role: 'admin', mfaEnrollmentRequired: true },
    })
  })

  console.log(`İlk yönetici hesabı oluşturuldu: ${email}. İlk girişte MFA kurulumu zorunludur.`)
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(closeDatabasePool)
