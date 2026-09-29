import { toNextJsHandler } from 'better-auth/next-js'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { assertAuthRuntimeConfiguration } from '@/lib/auth/runtime-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const handlers = toNextJsHandler(auth)
const READ_ONLY_AUTH_GET_PATHS = new Set([
  '/api/auth/get-session',
  '/api/auth/ok',
  '/api/auth/error',
])

function unavailableResponse() {
  return NextResponse.json(
    { message: 'Kimlik doğrulama hizmeti yapılandırılmamış.' },
    {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    },
  )
}

async function run(handler: (request: Request) => Promise<Response>, request: Request) {
  try {
    assertAuthRuntimeConfiguration()
  } catch (error) {
    console.error('Kimlik doğrulama yapılandırması geçersiz.', error)
    return unavailableResponse()
  }

  const response = await handler(request)
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  return response
}

export function GET(request: Request) {
  const pathname = new URL(request.url).pathname
  const isPasswordResetRedirect = pathname.startsWith('/api/auth/reset-password/')
  if (!READ_ONLY_AUTH_GET_PATHS.has(pathname) && !isPasswordResetRedirect) {
    return NextResponse.json(
      { message: 'Bu auth işlemi GET yöntemiyle kullanılamaz.' },
      { status: 405, headers: { Allow: 'POST', 'Cache-Control': 'no-store' } },
    )
  }
  return run(handlers.GET, request)
}

export function POST(request: Request) {
  return run(handlers.POST, request)
}
