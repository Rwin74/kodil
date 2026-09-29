import 'server-only'

import { auditLogs } from '@/db/schema'
import { getDatabase } from '@/db/client'

type SafeAuditValue = string | number | boolean | null

type AuditEvent = {
  actorId: string | null
  action: string
  entityType: string
  entityId: string
  context?: Record<string, SafeAuditValue>
}

const FORBIDDEN_CONTEXT_KEY = /password|passphrase|token|secret|code|cookie|authorization/i

function sanitizeContext(context: Record<string, SafeAuditValue> | undefined) {
  if (!context) return null

  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => {
      if (FORBIDDEN_CONTEXT_KEY.test(key)) {
        throw new Error(`Audit context hassas alan içeremez: ${key}`)
      }
      return [key.slice(0, 80), typeof value === 'string' ? value.slice(0, 500) : value]
    }),
  )
}

export async function recordAuditEvent(event: AuditEvent) {
  await getDatabase().insert(auditLogs).values({
    actorId: event.actorId,
    action: event.action.slice(0, 120),
    entityType: event.entityType.slice(0, 120),
    entityId: event.entityId.slice(0, 128),
    context: sanitizeContext(event.context),
  })
}

export async function recordAuthAuditEvent(event: AuditEvent) {
  try {
    await recordAuditEvent(event)
  } catch (error) {
    console.error('Kimlik doğrulama audit kaydı yazılamadı.', error)
  }
}
