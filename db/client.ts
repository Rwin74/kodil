import { drizzle } from 'drizzle-orm/mysql2'
import { createPool, type Pool } from 'mysql2/promise'
import * as schema from '@/db/schema'
import { getDatabasePoolOptions } from '@/db/runtime-config'

const globalDatabase = globalThis as typeof globalThis & {
  kodilMySqlPool?: Pool
}

type DatabaseConnectionOptions = {
  allowUnconfigured?: boolean
}

export function getMySqlPool(options: DatabaseConnectionOptions = {}) {
  if (!globalDatabase.kodilMySqlPool) {
    const connectionLimit = Number(process.env.DATABASE_POOL_SIZE ?? '5')
    if (!Number.isInteger(connectionLimit) || connectionLimit < 1 || connectionLimit > 20) {
      throw new Error('DATABASE_POOL_SIZE 1 ile 20 arasında bir tam sayı olmalı.')
    }
    globalDatabase.kodilMySqlPool = createPool({
      ...getDatabasePoolOptions(process.env, options),
      connectionLimit,
      enableKeepAlive: true,
      charset: 'utf8mb4',
    })
  }
  return globalDatabase.kodilMySqlPool
}

export function getDatabase(options: DatabaseConnectionOptions = {}) {
  return drizzle(getMySqlPool(options), { schema, mode: 'default' })
}

export async function closeDatabasePool() {
  if (!globalDatabase.kodilMySqlPool) return
  const pool = globalDatabase.kodilMySqlPool
  delete globalDatabase.kodilMySqlPool
  await pool.end()
}
