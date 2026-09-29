import 'server-only'

import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { getDatabase } from '@/db/client'
import { redirects } from '@/db/schema'
import { SITE } from '@/lib/site'

type TransactionCallback = Parameters<ReturnType<typeof getDatabase>['transaction']>[0]
type DatabaseTransaction = Parameters<TransactionCallback>[0]

export interface RedirectGraphRow {
  id: string
  sourcePath: string
  targetPath: string
}

function normalizedInternalPath(value: string, label: string) {
  let url: URL
  try {
    url = new URL(value, SITE.url)
  } catch {
    throw new Error(`${label} geçerli bir URL yolu olmalı.`)
  }
  if (url.origin !== SITE.url || url.search || url.hash || !value.startsWith('/')) {
    throw new Error(`${label} sorgu/fragment içermeyen canlı site içi bir yol olmalı.`)
  }
  const path = url.pathname.length > 1 && url.pathname.endsWith('/')
    ? url.pathname.slice(0, -1)
    : url.pathname
  if (!/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(path)) {
    throw new Error(`${label} yalnız güvenli, normalize edilmiş URL segmentleri içermeli.`)
  }
  if (/^\/(?:yonetim|api|onizleme|media)(?:\/|$)/.test(path)) {
    throw new Error(`${label} özel veya altyapı rotası olamaz.`)
  }
  return path
}

export function planSafeRedirect(
  existingRows: readonly RedirectGraphRow[],
  sourceValue: string,
  targetValue: string,
) {
  const sourcePath = normalizedInternalPath(sourceValue, 'Redirect kaynağı')
  const targetPath = normalizedInternalPath(targetValue, 'Redirect hedefi')
  if (sourcePath === targetPath) throw new Error('Redirect kaynağı ve hedefi aynı olamaz.')

  const exactRows = existingRows.filter((row) => !row.sourcePath.includes(':'))
  const graph = new Map<string, string>()
  for (const row of exactRows) {
    const rowSource = normalizedInternalPath(row.sourcePath, 'Kayıtlı redirect kaynağı')
    const rowTarget = normalizedInternalPath(row.targetPath, 'Kayıtlı redirect hedefi')
    if (rowSource !== sourcePath) graph.set(rowSource, rowTarget)
  }

  if (graph.has(targetPath)) {
    throw new Error(`Redirect hedefi başka bir redirect kaynağıdır: ${targetPath}`)
  }

  const flattenedIds = exactRows
    .filter((row) => normalizedInternalPath(row.targetPath, 'Kayıtlı redirect hedefi') === sourcePath)
    .map((row) => row.id)
  for (const row of exactRows) {
    if (flattenedIds.includes(row.id)) {
      graph.set(normalizedInternalPath(row.sourcePath, 'Kayıtlı redirect kaynağı'), targetPath)
    }
  }
  graph.set(sourcePath, targetPath)

  for (const start of graph.keys()) {
    const visited = new Set<string>()
    let cursor: string | undefined = start
    while (cursor && graph.has(cursor)) {
      if (visited.has(cursor)) throw new Error(`Redirect döngüsü algılandı: ${start}`)
      visited.add(cursor)
      cursor = graph.get(cursor)
    }
  }

  return { sourcePath, targetPath, flattenedIds }
}

export async function writeValidatedRedirect(
  transaction: DatabaseTransaction,
  input: { sourcePath: string; targetPath: string; reason: string; checkedAt: string },
) {
  const rows = await transaction
    .select({
      id: redirects.id,
      sourcePath: redirects.sourcePath,
      targetPath: redirects.targetPath,
    })
    .from(redirects)
    .where(and(eq(redirects.active, true), eq(redirects.validationStatus, 'valid')))
    .for('update')
  const plan = planSafeRedirect(rows, input.sourcePath, input.targetPath)

  for (const id of plan.flattenedIds) {
    await transaction
      .update(redirects)
      .set({ targetPath: plan.targetPath, checkedAt: input.checkedAt })
      .where(eq(redirects.id, id))
  }
  await transaction
    .insert(redirects)
    .values({
      id: randomUUID(),
      sourcePath: plan.sourcePath,
      targetPath: plan.targetPath,
      httpCode: 308,
      active: true,
      reason: input.reason,
      validationStatus: 'valid',
      checkedAt: input.checkedAt,
    })
    .onDuplicateKeyUpdate({
      set: {
        targetPath: plan.targetPath,
        httpCode: 308,
        active: true,
        reason: input.reason,
        validationStatus: 'valid',
        checkedAt: input.checkedAt,
      },
    })
  return plan
}
