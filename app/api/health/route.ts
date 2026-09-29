import { constants } from 'node:fs'
import { access } from 'node:fs/promises'
import { NextResponse } from 'next/server'
import { getMySqlPool } from '@/db/client'
import { getDatabaseRuntimeConfigurationIssues } from '@/db/runtime-config'
import { mediaRoot } from '@/lib/admin/media-storage'
import { getAuthRuntimeConfigurationIssues } from '@/lib/auth/runtime-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const privateHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
}

export async function GET() {
  try {
    const configurationIssues = [
      ...getDatabaseRuntimeConfigurationIssues(),
      ...getAuthRuntimeConfigurationIssues(),
    ]
    if (process.env.CONTENT_SOURCE !== 'mysql') {
      configurationIssues.push('CONTENT_SOURCE mysql olmalı')
    }
    if (configurationIssues.length > 0) {
      throw new Error(`Runtime yapılandırması eksik: ${configurationIssues.join('; ')}`)
    }

    await Promise.all([
      getMySqlPool().query('SELECT 1 FROM `posts` LIMIT 1'),
      access(mediaRoot(), constants.R_OK | constants.W_OK),
    ])

    return NextResponse.json(
      { status: 'ok', checks: { database: 'ok', media: 'ok', authentication: 'configured' } },
      { headers: privateHeaders },
    )
  } catch (error) {
    console.error('Health check başarısız.', error)
    return NextResponse.json(
      { status: 'unavailable' },
      { status: 503, headers: privateHeaders },
    )
  }
}
