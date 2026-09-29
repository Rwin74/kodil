import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { PoolOptions } from 'mysql2'

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])

function databaseUrl(environment: NodeJS.ProcessEnv, allowUnconfigured = false) {
  const value = environment.DATABASE_URL?.trim()
  if (!value) {
    if (allowUnconfigured) {
      return new URL('mysql://unconfigured:unconfigured@127.0.0.1:1/unconfigured')
    }
    throw new Error('DATABASE_URL tanımlı değil. MySQL işlemleri için .env.example şablonunu kullanın.')
  }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error('DATABASE_URL geçerli bir URL değil.')
  }
  if (url.protocol !== 'mysql:') throw new Error('DATABASE_URL mysql:// şeması kullanmalı.')
  if (!url.username || !url.password || url.pathname === '/') {
    throw new Error('DATABASE_URL kullanıcı, parola ve veritabanı adı içermeli.')
  }
  return url
}

export function getDatabaseRuntimeConfigurationIssues(environment = process.env) {
  const issues: string[] = []
  let url: URL | undefined
  try {
    url = databaseUrl(environment)
  } catch (error) {
    issues.push(error instanceof Error ? error.message : String(error))
  }

  const caFile = environment.DATABASE_TLS_CA_FILE?.trim()
  if (caFile && !path.isAbsolute(caFile)) {
    issues.push('DATABASE_TLS_CA_FILE mutlak bir yol olmalı')
  }
  if (
    environment.NODE_ENV === 'production' &&
    url &&
    !LOOPBACK_HOSTS.has(url.hostname) &&
    !caFile
  ) {
    issues.push('Uzak production MySQL bağlantısı doğrulanan DATABASE_TLS_CA_FILE kullanmalı')
  }

  return issues
}

export function getDatabasePoolOptions(
  environment = process.env,
  options: { allowUnconfigured?: boolean } = {},
): PoolOptions {
  const url = databaseUrl(environment, options.allowUnconfigured)
  const caFile = environment.DATABASE_TLS_CA_FILE?.trim()
  const poolOptions: PoolOptions = { uri: url.toString() }

  if (caFile) {
    if (!path.isAbsolute(caFile)) throw new Error('DATABASE_TLS_CA_FILE mutlak bir yol olmalı.')
    poolOptions.ssl = {
      ca: readFileSync(caFile, 'utf8'),
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    }
  } else if (environment.NODE_ENV === 'production' && !LOOPBACK_HOSTS.has(url.hostname)) {
    throw new Error('Uzak production MySQL bağlantısı doğrulanan DATABASE_TLS_CA_FILE kullanmalı.')
  }

  return poolOptions
}
