import { SITE } from '@/lib/site'

const DEVELOPMENT_SECRET = 'development-only-kodil-auth-secret-change-before-production'

export const AUTH_BASE_URL =
  process.env.BETTER_AUTH_URL?.trim() ||
  (process.env.NODE_ENV === 'production' ? SITE.url : 'http://localhost:3000')

export const AUTH_SECRET = process.env.BETTER_AUTH_SECRET?.trim() || DEVELOPMENT_SECRET

const REQUIRED_PRODUCTION_VARIABLES = [
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM',
] as const

export function getAuthRuntimeConfigurationIssues(environment = process.env) {
  const issues: string[] = []

  if (!environment.DATABASE_URL?.trim()) issues.push('DATABASE_URL tanımlı değil')

  if (environment.NODE_ENV === 'production') {
    for (const name of REQUIRED_PRODUCTION_VARIABLES) {
      if (!environment[name]?.trim()) issues.push(`${name} tanımlı değil`)
    }
  }

  const secret = environment.BETTER_AUTH_SECRET?.trim()
  if (secret && secret.length < 32) {
    issues.push('BETTER_AUTH_SECRET en az 32 karakter olmalı')
  }

  const configuredUrl = environment.BETTER_AUTH_URL?.trim()
  if (configuredUrl) {
    try {
      const url = new URL(configuredUrl)
      const localDevelopmentUrl =
        environment.NODE_ENV !== 'production' &&
        url.protocol === 'http:' &&
        ['localhost', '127.0.0.1'].includes(url.hostname)

      if (url.protocol !== 'https:' && !localDevelopmentUrl) {
        issues.push('BETTER_AUTH_URL HTTPS kullanmalı')
      }
      if (url.pathname !== '/' || url.search || url.hash) {
        issues.push('BETTER_AUTH_URL yalnız origin içermeli')
      }
    } catch {
      issues.push('BETTER_AUTH_URL geçerli bir URL değil')
    }
  }

  const smtpPort = environment.SMTP_PORT?.trim()
  if (smtpPort && (!Number.isInteger(Number(smtpPort)) || Number(smtpPort) < 1 || Number(smtpPort) > 65535)) {
    issues.push('SMTP_PORT 1–65535 arasında olmalı')
  }

  return issues
}

export function assertAuthRuntimeConfiguration() {
  const issues = getAuthRuntimeConfigurationIssues()
  if (issues.length > 0) {
    throw new Error(`Yönetim kimlik doğrulama yapılandırması eksik: ${issues.join('; ')}`)
  }
}
